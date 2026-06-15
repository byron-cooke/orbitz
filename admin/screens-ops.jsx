// ORBITZ Admin — Drivers + Rewards + Settings
function Drivers({ refresh }) {
  const assigned = (id) => ORDERS.filter(o => o.driverId === id && ["out_for_delivery"].includes(o.status));
  const toggle = (d) => { d.available = !d.available; refresh(); };
  return (
    <div className="oz-screen">
      <div className="oz-toolbar">
        <span className="oz-muted-sm">{DRIVERS.filter(d => d.available).length} of {DRIVERS.length} available</span>
        <Button icon="plus">Add driver</Button>
      </div>
      <div className="oz-driver-grid">
        {DRIVERS.map(d => {
          const live = assigned(d.id);
          return (
            <Card key={d.id} className="oz-driver-card">
              <div className="oz-driver-top">
                <Avatar name={d.name} size={48} tone="#22d3ee" />
                <div className="oz-driver-id">
                  <span className="oz-driver-name">{d.name}</span>
                  <span className="oz-driver-rating mono">★ {d.rating}</span>
                </div>
                <div className="oz-driver-avail">
                  <span className="oz-avail-dot" style={{ background: d.available ? "#34d399" : "#9aa6c4", boxShadow: d.available ? "0 0 8px #34d399" : "none" }} />
                  <Toggle on={d.available} onChange={() => toggle(d)} />
                </div>
              </div>
              <div className="oz-kv-list">
                <div className="oz-kv"><Icon name="truck" size={14} /><span>{d.vehicle}</span></div>
                <div className="oz-kv"><Icon name="phone" size={14} /><span>{d.phone}</span></div>
              </div>
              <div className="oz-driver-orders">
                <span className="oz-kv-label">Active deliveries</span>
                {live.length === 0 ? <span className="dim oz-tiny">None — {d.available ? "ready for dispatch" : "off shift"}</span> : (
                  <div className="oz-driver-orderlist">
                    {live.map(o => <span key={o.id} className="oz-driver-ord mono">{o.number}</span>)}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Rewards ----------
function Rewards({ refresh }) {
  const [adjust, setAdjust] = useState(null);
  const [pts, setPts] = useState("");
  const [reason, setReason] = useState("");
  const sorted = [...CUSTOMERS].sort((a, b) => b.points - a.points);
  const totalOutstanding = CUSTOMERS.reduce((s, c) => s + c.points, 0);

  const save = () => {
    const n = parseInt(pts, 10); if (!n) { setAdjust(null); return; }
    adjust.points += n;
    REWARDS_TX.unshift({ id: "rt" + Date.now(), customerId: adjust.id, orderId: null, points: n, reason: reason || "Manual adjustment", by: "Alex R.", at: new Date().toISOString() });
    setAdjust(null); setPts(""); setReason(""); refresh();
  };

  return (
    <div className="oz-screen">
      <div className="oz-stat-grid oz-stat-grid-3">
        <StatTile icon="star" label="Points outstanding" value={totalOutstanding.toLocaleString()} tone="#b07cff" sub="across all members" />
        <StatTile icon="users" label="Reward members" value={CUSTOMERS.length} tone="#22d3ee" sub="active loyalty accounts" />
        <StatTile icon="gift" label="Earn rate" value="1 pt / $1" tone="#34d399" sub="redeem 500 pts = free eighth" />
      </div>

      <div className="oz-grid-2">
        <Card pad={0}>
          <div className="oz-card-head"><SectionTitle right={<span className="oz-muted-sm">Tap to adjust</span>}>Member balances</SectionTitle></div>
          <div className="oz-list">
            {sorted.map(c => (
              <div key={c.id} className="oz-list-row" style={{ cursor: "default" }}>
                <Avatar name={c.name} size={34} />
                <div className="oz-list-main"><span className="oz-list-title">{c.name}</span><span className="oz-list-sub">member since {fmtDate(c.joined)}</span></div>
                <div className="oz-list-end" style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <span className="oz-points-big mono">{c.points.toLocaleString()}<span className="oz-pts-unit">pts</span></span>
                  <Button size="sm" variant="ghost" icon="edit" onClick={() => { setAdjust(c); setPts(""); setReason(""); }}>Adjust</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="oz-detail-side">
          <Card>
            <SectionTitle>Rewards rules</SectionTitle>
            <div className="oz-rules">
              <div className="oz-rule"><span className="oz-rule-ic" style={{ color: "#34d399" }}><Icon name="dollar" size={15} /></span><div><strong>Earn 1 point per $1</strong><span>Points credited automatically when an order is marked Delivered.</span></div></div>
              <div className="oz-rule"><span className="oz-rule-ic" style={{ color: "#b07cff" }}><Icon name="gift" size={15} /></span><div><strong>500 points = free eighth</strong><span>Redeemable at checkout on the storefront.</span></div></div>
              <div className="oz-rule"><span className="oz-rule-ic" style={{ color: "#f5b945" }}><Icon name="sparkle" size={15} /></span><div><strong>250 point birthday bonus</strong><span>Applied once per year on the customer's birthday.</span></div></div>
              <div className="oz-rule"><span className="oz-rule-ic" style={{ color: "#22d3ee" }}><Icon name="users" size={15} /></span><div><strong>Refer a friend = 300 points</strong><span>Credited after the referred friend's first delivery.</span></div></div>
            </div>
            <Button variant="ghost" full icon="edit" style={{ marginTop: 14 }}>Edit rules</Button>
          </Card>
          <Card>
            <SectionTitle>Recent adjustments</SectionTitle>
            <div className="oz-tx-list">
              {REWARDS_TX.slice(0, 5).map(t => {
                const cu = customerById(t.customerId);
                return (
                  <div key={t.id} className="oz-tx-row">
                    <Avatar name={cu.name} size={28} />
                    <div className="oz-tx-body"><span>{cu.name}</span><span className="dim oz-tiny">{t.reason} · {ago(t.at)}</span></div>
                    <span className="oz-tx-amt mono" style={{ color: t.points > 0 ? "#34d399" : "#f87171" }}>{t.points > 0 ? "+" : ""}{t.points}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      <Modal open={!!adjust} onClose={() => setAdjust(null)} title={"Adjust points · " + (adjust?.name || "")}
        footer={<><Button variant="ghost" onClick={() => setAdjust(null)}>Cancel</Button><Button icon="check" onClick={save}>Apply adjustment</Button></>}>
        {adjust && <div className="oz-form">
          <div className="oz-adjust-current"><span className="oz-kv-label">Current balance</span><span className="oz-points-big mono">{adjust.points.toLocaleString()}<span className="oz-pts-unit">pts</span></span></div>
          <Field label="Points (use a negative number to deduct)"><Input type="number" value={pts} onChange={setPts} placeholder="e.g. 250 or -100" /></Field>
          <div className="oz-quick-pts">
            {[100, 250, 500, -100].map(v => <button key={v} className="oz-chip-btn" onClick={() => setPts(String(v))}>{v > 0 ? "+" : ""}{v}</button>)}
          </div>
          <Field label="Reason"><Input value={reason} onChange={setReason} placeholder="e.g. Service recovery, birthday bonus…" /></Field>
        </div>}
      </Modal>
    </div>
  );
}

// ---------- Settings ----------
function SettingsBlock({ title, desc, children }) {
  return (
    <Card>
      <div className="oz-set-head"><h3>{title}</h3><p>{desc}</p></div>
      {children}
    </Card>
  );
}
function Settings({ refresh }) {
  const [hours, setHours] = useState({ open: "10:00 AM", close: "10:00 PM" });
  const [notif, setNotif] = useState({ newOrder: true, lowStock: true, payment: true, daily: false });
  const toggleZone = (z) => { z.active = !z.active; refresh(); };

  return (
    <div className="oz-screen">
      <div className="oz-grid-2">
        <SettingsBlock title="Delivery zones" desc="Areas you currently serve and their fees.">
          <div className="oz-zone-list">
            {ZONES.map(z => (
              <div key={z.id} className="oz-zone-row">
                <span className="oz-zone-ic" style={{ color: z.active ? "#b07cff" : "var(--muted)" }}><Icon name="pin" size={16} /></span>
                <div className="oz-zone-info"><span className="oz-zone-name">{z.name}</span><span className="oz-zone-sub">{z.fee ? fmtMoney(z.fee) + " fee" : "Free delivery"} · ~{z.eta} min ETA</span></div>
                <Toggle on={z.active} onChange={() => toggleZone(z)} />
              </div>
            ))}
          </div>
          <Button variant="ghost" full icon="plus" style={{ marginTop: 12 }}>Add zone</Button>
        </SettingsBlock>

        <SettingsBlock title="Taxes & fees" desc="Applied to every order at checkout.">
          <div className="oz-form">
            <div className="oz-form-2">
              <Field label="Sales tax (%)"><Input type="number" value="6" onChange={() => {}} /></Field>
              <Field label="Base delivery fee ($)"><Input type="number" value="5" onChange={() => {}} /></Field>
            </div>
            <Field label="Free delivery threshold ($)" hint="Orders above this ship free in active zones."><Input type="number" value="100" onChange={() => {}} /></Field>
            <div className="oz-form-2">
              <Field label="Minimum order ($)"><Input type="number" value="40" onChange={() => {}} /></Field>
              <Field label="Service fee (%)"><Input type="number" value="0" onChange={() => {}} /></Field>
            </div>
          </div>
        </SettingsBlock>
      </div>

      <div className="oz-grid-2">
        <SettingsBlock title="Business hours" desc="When customers can place delivery orders.">
          <div className="oz-form">
            <div className="oz-form-2">
              <Field label="Opens"><Input value={hours.open} onChange={v => setHours(h => ({ ...h, open: v }))} /></Field>
              <Field label="Closes"><Input value={hours.close} onChange={v => setHours(h => ({ ...h, close: v }))} /></Field>
            </div>
            <div className="oz-days">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
                <button key={d} className={"oz-day " + (i < 7 ? "on" : "")}>{d}</button>
              ))}
            </div>
            <p className="oz-field-hint">Open daily · {hours.open} – {hours.close}</p>
          </div>
        </SettingsBlock>

        <SettingsBlock title="Notifications" desc="What the team gets pinged about.">
          <div className="oz-notif-list">
            {[["newOrder", "New order placed", "Alert when a customer checks out"],
              ["payment", "Payment proof uploaded", "Ping when proof needs review"],
              ["lowStock", "Low inventory", "When a product drops below 10 units"],
              ["daily", "Daily summary", "End-of-day revenue & order recap"]].map(([k, t, d]) => (
              <div key={k} className="oz-notif-row">
                <div><span className="oz-notif-title">{t}</span><span className="oz-notif-sub">{d}</span></div>
                <Toggle on={notif[k]} onChange={v => setNotif(n => ({ ...n, [k]: v }))} />
              </div>
            ))}
          </div>
        </SettingsBlock>
      </div>
    </div>
  );
}

Object.assign(window, { Drivers, Rewards, Settings });
