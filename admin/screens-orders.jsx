// ORBITZ Admin — Orders list + Order detail
const STATUS_FILTERS = [
  { value: "all", label: "All" },
  ...ORBITZ_FLOW.map(s => ({ value: s, label: ORBITZ_STATUS[s].label })),
  { value: "cancelled", label: "Cancelled" },
];

function OrdersList({ navigate, search }) {
  const [filter, setFilter] = useState("all");
  const q = (search || "").toLowerCase();

  let rows = [...ORDERS].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (filter !== "all") rows = rows.filter(o => o.status === filter);
  if (q) rows = rows.filter(o => {
    const c = customerById(o.customerId);
    return o.number.toLowerCase().includes(q) || c.name.toLowerCase().includes(q);
  });

  const counts = {}; ORDERS.forEach(o => counts[o.status] = (counts[o.status] || 0) + 1);

  return (
    <div className="oz-screen">
      <div className="oz-toolbar">
        <div className="oz-tabs">
          {STATUS_FILTERS.map(f => (
            <button key={f.value} className={"oz-tab " + (filter === f.value ? "active" : "")}
              onClick={() => setFilter(f.value)}>
              {f.value !== "all" && <span className="oz-dot" style={{ background: ORBITZ_STATUS[f.value]?.color }} />}
              {f.label}
              <span className="oz-tab-count">{f.value === "all" ? ORDERS.length : (counts[f.value] || 0)}</span>
            </button>
          ))}
        </div>
      </div>

      <Card pad={0}>
        <div className="oz-table">
          <div className="oz-tr oz-th">
            <div className="oz-td oz-c-num">Order</div>
            <div className="oz-td oz-c-cust">Customer</div>
            <div className="oz-td oz-c-items">Items</div>
            <div className="oz-td oz-c-total">Total</div>
            <div className="oz-td oz-c-pay">Payment</div>
            <div className="oz-td oz-c-status">Status</div>
            <div className="oz-td oz-c-time">Placed</div>
            <div className="oz-td oz-c-go" />
          </div>
          {rows.length === 0 && <Empty label="No orders match your filters" />}
          {rows.map(o => {
            const c = customerById(o.customerId);
            const itemCount = o.items.reduce((a, i) => a + i.qty, 0);
            return (
              <button key={o.id} className="oz-tr oz-row-btn" onClick={() => navigate("order", { id: o.id })}>
                <div className="oz-td oz-c-num mono">{o.number}</div>
                <div className="oz-td oz-c-cust">
                  <Avatar name={c.name} size={30} />
                  <span className="oz-cust-name">{c.name}</span>
                </div>
                <div className="oz-td oz-c-items">{itemCount} <span className="dim">items</span></div>
                <div className="oz-td oz-c-total mono">{fmtMoney(o.total)}</div>
                <div className="oz-td oz-c-pay">
                  <span className="oz-pay-chip">{o.paymentMethod}</span>
                  {o.proof && (o.proof.verified
                    ? <span className="oz-proof-ok" title="Proof verified"><Icon name="check" size={12} /></span>
                    : <span className="oz-proof-pend" title="Proof unverified"><Icon name="clock" size={12} /></span>)}
                </div>
                <div className="oz-td oz-c-status"><StatusBadge status={o.status} size="sm" /></div>
                <div className="oz-td oz-c-time dim">{ago(o.createdAt)}</div>
                <div className="oz-td oz-c-go"><Icon name="chevR" size={16} /></div>
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ---------- Order Detail ----------
function StatusTimeline({ order }) {
  const reached = {}; order.timeline.forEach(([s, t]) => reached[s] = t);
  const cancelled = order.status === "cancelled";
  const steps = cancelled ? [...ORBITZ_FLOW.slice(0, order.timeline.length - 1)] : ORBITZ_FLOW;
  return (
    <div className="oz-timeline">
      {(cancelled ? order.timeline.map(t => t[0]) : ORBITZ_FLOW).map((s, i, arr) => {
        const t = reached[s];
        const done = !!t;
        const m = ORBITZ_STATUS[s];
        const isCurrent = order.status === s;
        return (
          <div key={s} className={"oz-tl-step " + (done ? "done" : "")}>
            <div className="oz-tl-rail">
              <span className="oz-tl-node" style={{ borderColor: done ? m.color : "var(--line)",
                background: done ? m.color : "transparent", boxShadow: isCurrent ? `0 0 0 4px ${m.glow}` : "none" }}>
                {done && <Icon name="check" size={11} stroke={3} style={{ color: "#0a0a0f" }} />}
              </span>
              {i < arr.length - 1 && <span className="oz-tl-line" style={{ background: done ? m.color + "66" : "var(--line)" }} />}
            </div>
            <div className="oz-tl-body">
              <span className="oz-tl-label" style={{ color: done ? "var(--text)" : "var(--muted)" }}>{m.label}</span>
              {t && <span className="oz-tl-time mono">{fmtTime(t)} · {fmtDate(t)}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OrderDetail({ params, navigate, refresh }) {
  const order = orderById(params.id);
  const c = customerById(order.customerId);
  const [noteText, setNoteText] = useState("");
  const [driverModal, setDriverModal] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const zone = ZONES.find(z => z.id === order.zoneId);

  const nextStatus = () => {
    const idx = ORBITZ_FLOW.indexOf(order.status);
    return idx >= 0 && idx < ORBITZ_FLOW.length - 1 ? ORBITZ_FLOW[idx + 1] : null;
  };
  const advance = () => {
    const ns = nextStatus(); if (!ns) return;
    if (ns === "out_for_delivery" && !order.driverId) { setDriverModal(true); return; }
    order.status = ns; order.updatedAt = new Date().toISOString();
    order.timeline.push([ns, new Date().toISOString()]);
    refresh();
  };
  const setStatus = (ns) => {
    order.status = ns; order.updatedAt = new Date().toISOString();
    if (!order.timeline.find(t => t[0] === ns)) order.timeline.push([ns, new Date().toISOString()]);
    refresh();
  };
  const assignDriver = (id) => {
    order.driverId = id;
    setDriverModal(false);
    if (order.status === "packed") { order.status = "out_for_delivery"; order.timeline.push(["out_for_delivery", new Date().toISOString()]); }
    refresh();
  };
  const addNote = () => {
    if (!noteText.trim()) return;
    order.notes.unshift({ author: "Alex R.", body: noteText.trim(), at: new Date().toISOString() });
    setNoteText(""); refresh();
  };
  const verifyProof = () => { order.proof.verified = true; refresh(); };

  const ns = nextStatus();
  const driver = order.driverId ? DRIVERS.find(d => d.id === order.driverId) : null;

  return (
    <div className="oz-screen">
      <button className="oz-back" onClick={() => navigate("orders")}><Icon name="chevL" size={15} /> Orders</button>

      <div className="oz-detail-head">
        <div>
          <div className="oz-detail-titlerow">
            <h2 className="mono">{order.number}</h2>
            <StatusBadge status={order.status} />
          </div>
          <p className="oz-detail-meta">Placed {fmtDateTime(order.createdAt)} · {ago(order.createdAt)}</p>
        </div>
        <div className="oz-detail-actions">
          {order.status !== "cancelled" && order.status !== "delivered" && (
            <Button variant="ghost" onClick={() => setConfirmCancel(true)}>Cancel order</Button>
          )}
          {ns && order.status !== "cancelled" && (
            <Button icon="check" onClick={advance}>
              Mark {ORBITZ_STATUS[ns].label}
            </Button>
          )}
        </div>
      </div>

      <div className="oz-detail-grid">
        <div className="oz-detail-main">
          {/* Items */}
          <Card pad={0}>
            <div className="oz-card-head"><SectionTitle>Items</SectionTitle></div>
            <div className="oz-items">
              {order.items.map((it, i) => {
                const p = productById(it.productId);
                return (
                  <div key={i} className="oz-item-row">
                    <span className="oz-prod-thumb" style={{ background: `radial-gradient(circle at 30% 30%, ${p.tone}66, ${p.tone}11)` }}>{p.emoji}</span>
                    <div className="oz-item-info">
                      <span className="oz-item-name">{p.name}</span>
                      <span className="oz-item-sub">{p.strain} · {p.thc}% THC · {fmtMoney(it.unitPrice)} ea</span>
                    </div>
                    <span className="oz-item-qty mono">×{it.qty}</span>
                    <span className="oz-item-total mono">{fmtMoney(it.lineTotal)}</span>
                  </div>
                );
              })}
            </div>
            <div className="oz-totals">
              <div className="oz-total-row"><span>Subtotal</span><span className="mono">{fmtMoney(order.subtotal)}</span></div>
              <div className="oz-total-row"><span>Tax (6%)</span><span className="mono">{fmtMoney(order.tax)}</span></div>
              <div className="oz-total-row"><span>Delivery · {zone.name}</span><span className="mono">{order.deliveryFee ? fmtMoney(order.deliveryFee) : "Free"}</span></div>
              <div className="oz-total-row oz-total-grand"><span>Total</span><span className="mono">{fmtMoney(order.total)}</span></div>
            </div>
          </Card>

          {/* Payment proof */}
          <Card>
            <SectionTitle right={order.proof && (order.proof.verified
              ? <Pill color="#34d399">Verified</Pill>
              : <Button size="sm" icon="check" onClick={verifyProof}>Verify payment</Button>)}>
              Payment proof
            </SectionTitle>
            {order.proof ? (
              <>
                <div className="oz-pay-summary">
                  <div><span className="oz-kv-label">Method</span><span className="oz-kv-val">{order.proof.method}</span></div>
                  <div><span className="oz-kv-label">Amount due</span><span className="oz-kv-val mono">{fmtMoney(order.total)}</span></div>
                  <div><span className="oz-kv-label">Status</span><span className="oz-kv-val" style={{ color: order.proof.verified ? "#34d399" : "#f5b945" }}>{order.proof.verified ? "Confirmed" : "Awaiting review"}</span></div>
                </div>
                <ProofPlaceholder method={order.proof.method} />
              </>
            ) : (
              <div className="oz-noproof"><Icon name="upload" size={20} style={{ color: "var(--muted)" }} /><span>No payment proof uploaded yet</span><span className="dim">Cash on delivery</span></div>
            )}
          </Card>

          {/* Notes */}
          <Card>
            <SectionTitle>Admin notes</SectionTitle>
            <div className="oz-note-compose">
              <Input value={noteText} onChange={setNoteText} placeholder="Add an internal note…" />
              <Button icon="plus" onClick={addNote}>Add</Button>
            </div>
            <div className="oz-notes">
              {order.notes.length === 0 && <p className="oz-muted-sm" style={{ padding: "8px 0" }}>No notes yet.</p>}
              {order.notes.map((n, i) => (
                <div key={i} className="oz-note">
                  <Avatar name={n.author} size={28} tone="#6f5cff" />
                  <div className="oz-note-body">
                    <div className="oz-note-meta"><strong>{n.author}</strong><span className="dim">{ago(n.at)}</span></div>
                    <p>{n.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar column */}
        <div className="oz-detail-side">
          <Card>
            <SectionTitle>Customer</SectionTitle>
            <button className="oz-cust-link" onClick={() => navigate("customer", { id: c.id })}>
              <Avatar name={c.name} size={42} />
              <div>
                <span className="oz-cust-link-name">{c.name}</span>
                <span className="oz-cust-link-sub">{c.points.toLocaleString()} pts · since {fmtDate(c.joined)}</span>
              </div>
              <Icon name="chevR" size={16} style={{ marginLeft: "auto", color: "var(--muted)" }} />
            </button>
            <div className="oz-kv-list">
              <div className="oz-kv"><Icon name="phone" size={14} /><span>{c.phone}</span></div>
              <div className="oz-kv"><Icon name="mail" size={14} /><span>{c.email}</span></div>
              <div className="oz-kv"><Icon name="pin" size={14} /><span>{order.address}</span></div>
            </div>
          </Card>

          <Card>
            <SectionTitle right={<Button size="sm" variant="ghost" onClick={() => setDriverModal(true)}>{driver ? "Reassign" : "Assign"}</Button>}>Driver</SectionTitle>
            {driver ? (
              <div className="oz-driver-assigned">
                <Avatar name={driver.name} size={42} tone="#22d3ee" />
                <div>
                  <span className="oz-cust-link-name">{driver.name}</span>
                  <span className="oz-cust-link-sub">{driver.vehicle}</span>
                </div>
                <span className="oz-driver-rating mono">★ {driver.rating}</span>
              </div>
            ) : (
              <div className="oz-noproof" style={{ padding: "16px 0" }}><Icon name="truck" size={18} style={{ color: "var(--muted)" }} /><span>No driver assigned</span></div>
            )}
          </Card>

          <Card>
            <SectionTitle>Status timeline</SectionTitle>
            <StatusTimeline order={order} />
          </Card>
        </div>
      </div>

      {/* Driver assign modal */}
      <Modal open={driverModal} onClose={() => setDriverModal(false)} title="Assign driver">
        <div className="oz-driver-pick">
          {DRIVERS.map(d => (
            <button key={d.id} className="oz-driver-opt" disabled={!d.available} onClick={() => assignDriver(d.id)}>
              <Avatar name={d.name} size={38} tone="#22d3ee" />
              <div className="oz-driver-opt-info">
                <span className="oz-cust-link-name">{d.name}</span>
                <span className="oz-cust-link-sub">{d.vehicle}</span>
              </div>
              {d.available ? <Pill color="#34d399">Available</Pill> : <Pill color="#9aa6c4">Busy</Pill>}
            </button>
          ))}
        </div>
      </Modal>

      <Modal open={confirmCancel} onClose={() => setConfirmCancel(false)} title="Cancel this order?"
        footer={<><Button variant="ghost" onClick={() => setConfirmCancel(false)}>Keep order</Button>
          <Button variant="danger" onClick={() => { setStatus("cancelled"); setConfirmCancel(false); }}>Cancel order</Button></>}>
        <p className="oz-confirm-text">Order <strong className="mono">{order.number}</strong> for {c.name} will be marked <strong>Cancelled</strong>. This stops the delivery workflow. You can add a note explaining why afterward.</p>
      </Modal>
    </div>
  );
}

Object.assign(window, { OrdersList, OrderDetail });
