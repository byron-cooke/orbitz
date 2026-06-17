// ORBITZ Account — My Orders + Order Detail
function OrderListCard({ o, go }) {
  return (
    <div className="oz-card oz-card-hover" style={{ padding: 14 }} onClick={() => go("order", { id: o.id })}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>
        <span className="mono" style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-2)" }}>{o.number}</span>
        <StatusBadge status={o.status} size="sm" />
      </div>
      <div className="ac-row">
        <div style={{ display: "flex", marginRight: 2 }}>
          {o.items.slice(0, 3).map((it, j) => (
            <div key={j} style={{ marginLeft: j ? -14 : 0, zIndex: 3 - j }}>
              <ProductThumb p={productById(it.productId)} size={42} />
            </div>
          ))}
        </div>
        <div className="ac-row-main">
          <span className="ac-row-title">{o.items.map(it => productById(it.productId).name).join(", ")}</span>
          <span className="ac-row-sub">{o.items.reduce((s, i) => s + i.qty, 0)} items · {fmtDateShort(o.createdAt)}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          <span className="ac-amt">{fmtMoney(o.total)}</span>
          <Icon name="chevR" size={17} style={{ color: "var(--muted)" }} />
        </div>
      </div>
    </div>
  );
}

function OrdersList({ go }) {
  const [filter, setFilter] = useState("all");
  const isActive = (o) => ["new","confirmed","payment_verified","packed","out_for_delivery"].includes(o.status);
  const list = MY_ORDERS.filter(o => filter === "all" ? true : filter === "active" ? isActive(o) : !isActive(o));
  const counts = {
    all: MY_ORDERS.length,
    active: MY_ORDERS.filter(isActive).length,
    past: MY_ORDERS.filter(o => !isActive(o)).length,
  };
  return (
    <div className="ac-screen">
      <div className="ac-seg">
        {[["all","All"],["active","Active"],["past","Past"]].map(([id, lb]) => (
          <button key={id} className={"ac-seg-btn" + (filter === id ? " active" : "")} onClick={() => setFilter(id)}>
            {lb} <span style={{ opacity: .6 }}>{counts[id]}</span>
          </button>
        ))}
      </div>
      {list.length ? list.map(o => <OrderListCard key={o.id} o={o} go={go} />)
        : <Empty icon="receipt" label="No orders here yet." />}
    </div>
  );
}

function KV({ icon, label, value, mono }) {
  return (
    <div className="ac-kv">
      <Icon name={icon} size={17} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 700 }}>{label}</div>
        <div className={mono ? "mono" : ""} style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text)" }}>{value}</div>
      </div>
    </div>
  );
}

function OrderDetail({ params, go, toast, reorder }) {
  const o = orderById(params.id);
  if (!o) return <Empty label="Order not found." />;
  const addr = ME.addresses.find(a => a.id === o.addressId) || ME.addresses[0];
  const pm = ME.payment.methods.find(m => m.id === o.paymentMethod);
  const active = ["confirmed","payment_verified","packed","out_for_delivery"].includes(o.status);
  const steps = o.timeline.map(t => ({ status: t.status, label: ORBITZ_STATUS[t.status].label, time: fmtDateTime(t.at) }));

  return (
    <div className="ac-screen">
      <div className="span-all" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 600 }}>{o.number}</div>
          <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>{fmtDateTime(o.createdAt)}</div>
        </div>
        <StatusBadge status={o.status} />
      </div>

      {active && (
        <Button full iconRight="truck" onClick={() => go("track", { id: o.id })}>Track this delivery</Button>
      )}

      {/* Items */}
      <Card pad={0}>
        <div style={{ padding: "14px 16px 10px" }}><SectionTitle>Items</SectionTitle></div>
        {o.items.map((it, i) => {
          const p = productById(it.productId);
          return (
            <div key={i}>
              <hr className="ac-divider" />
              <div className="ac-row" style={{ padding: "12px 16px" }}>
                <ProductThumb p={p} size={44} />
                <div className="ac-row-main">
                  <span className="ac-row-title">{p.name}</span>
                  <span className="ac-row-sub" style={{ textTransform: "capitalize" }}>{p.strain} · {p.size} · {fmtMoney0(p.price)}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 700 }}>×{it.qty}</span>
                  <span className="ac-amt">{fmtMoney(it.lineTotal)}</span>
                </div>
              </div>
            </div>
          );
        })}
        <hr className="ac-divider" />
        <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
          {[["Subtotal", fmtMoney(o.subtotal)], ["Delivery", o.deliveryFee ? fmtMoney(o.deliveryFee) : "Free"], ["Tax", fmtMoney(o.tax)]].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-2)" }}>
              <span>{l}</span><span style={{ fontWeight: 600 }}>{v}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, marginTop: 2, borderTop: "1px solid var(--line)", fontSize: 16, fontWeight: 700 }}>
            <span>Total</span><span style={{ color: "#fff" }}>{fmtMoney(o.total)}</span>
          </div>
        </div>
      </Card>

      {/* Delivery + payment */}
      <Card pad={16}>
        <SectionTitle>Delivery</SectionTitle>
        <div className="ac-kv-stack" style={{ marginTop: 14 }}>
          <KV icon="pin" label="Address" value={`${addr.line1}${addr.line2 ? ", " + addr.line2 : ""}, ${addr.city} ${addr.state}`} />
          <KV icon={pm?.emoji ? "card" : "card"} label="Payment" value={pm ? pm.label : o.paymentMethod} />
          {o.proof && (
            <div className="ac-kv">
              <Icon name="shieldCheck" size={17} style={{ color: o.proof.verified ? "var(--green)" : "var(--amber)" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 700 }}>Payment proof</div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: o.proof.verified ? "var(--green)" : "var(--amber)" }}>
                  {o.proof.verified ? "Verified" : "Pending review"} · {o.proof.method}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Timeline */}
      <Card pad={16}>
        <SectionTitle>Order timeline</SectionTitle>
        <div style={{ marginTop: 16 }}><Timeline steps={steps} current={o.status} /></div>
      </Card>

      <div style={{ display: "flex", gap: 10 }}>
        <Button variant="ghost" full icon="repeat" onClick={() => reorder(o.items.map(it => [it.productId, it.qty]), null, o.number)}>Reorder</Button>
        <Button variant="ghost" full icon="msg" onClick={() => go("support")}>Support</Button>
      </div>
    </div>
  );
}

Object.assign(window, { OrdersList, OrderDetail, OrderListCard, KV });
