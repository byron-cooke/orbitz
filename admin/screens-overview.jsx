// ORBITZ Admin — Overview screen
function StatTile({ icon, label, value, sub, tone, trend }) {
  return (
    <Card pad={20} className="oz-stat">
      <div className="oz-stat-top">
        <span className="oz-stat-icon" style={{ color: tone, background: tone + "1c", borderColor: tone + "33" }}>
          <Icon name={icon} size={18} />
        </span>
        {trend && <span className="oz-stat-trend" style={{ color: trend[0] === "-" ? "#f87171" : "#34d399" }}>
          <Icon name="trend" size={12} /> {trend}</span>}
      </div>
      <div className="oz-stat-value">{value}</div>
      <div className="oz-stat-label">{label}</div>
      {sub && <div className="oz-stat-sub">{sub}</div>}
    </Card>
  );
}

function Sparkline({ data, color }) {
  const w = 320, h = 64, max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d - min) / (max - min || 1)) * (h - 8) - 4;
    return [x, y];
  });
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = line + ` L${w} ${h} L0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: "100%", height: h }}>
      <defs>
        <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity=".35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark)" />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => i === pts.length - 1 && <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill={color} />)}
    </svg>
  );
}

function PipelineBar() {
  const counts = {};
  ORBITZ_FLOW.forEach(s => counts[s] = ORDERS.filter(o => o.status === s).length);
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  return (
    <Card>
      <SectionTitle right={<span className="oz-muted-sm">{total} active in pipeline</span>}>Order pipeline</SectionTitle>
      <div className="oz-pipe-bar">
        {ORBITZ_FLOW.map(s => {
          const m = ORBITZ_STATUS[s], pct = (counts[s] / total) * 100;
          return counts[s] > 0 ? (
            <div key={s} className="oz-pipe-seg" style={{ width: pct + "%", background: m.color }} title={`${m.label}: ${counts[s]}`} />
          ) : null;
        })}
      </div>
      <div className="oz-pipe-legend">
        {ORBITZ_FLOW.map(s => (
          <div key={s} className="oz-pipe-item">
            <span className="oz-dot" style={{ background: ORBITZ_STATUS[s].color }} />
            <span className="oz-pipe-label">{ORBITZ_STATUS[s].label}</span>
            <span className="oz-pipe-count">{counts[s]}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Overview({ navigate }) {
  const s = overviewStats();
  const recent = [...ORDERS].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);
  const lowStock = PRODUCTS.filter(p => p.inv <= 10).sort((a, b) => a.inv - b.inv);

  return (
    <div className="oz-screen">
      <div className="oz-stat-grid">
        <StatTile icon="receipt" label="Today's orders" value={s.todays} tone="#5b8cff" trend="+12%" sub="vs. yesterday" />
        <StatTile icon="clock" label="Pending orders" value={s.pending} tone="#f5b945" sub="awaiting action" />
        <StatTile icon="dollar" label="Revenue (est.)" value={fmtMoney0(s.revenue)} tone="#34d399" trend="+8%" sub="last 24 hours" />
        <StatTile icon="truck" label="Out for delivery" value={s.outForDelivery} tone="#b07cff" sub="couriers active" />
        <StatTile icon="users" label="New customers" value={s.newCustomers} tone="#22d3ee" trend="+5" sub="this month" />
      </div>

      <div className="oz-grid-2">
        <Card>
          <SectionTitle right={<span className="oz-muted-sm">Last 14 days</span>}>Revenue trend</SectionTitle>
          <div className="oz-rev-row">
            <div>
              <div className="oz-rev-big">{fmtMoney0(s.revenue * 11.4)}</div>
              <div className="oz-rev-sub"><span style={{ color: "#34d399" }}>▲ 14.2%</span> vs. prior period</div>
            </div>
          </div>
          <Sparkline color="#b07cff" data={[18,22,19,27,24,31,28,34,30,38,33,41,37,46]} />
        </Card>
        <PipelineBar />
      </div>

      <div className="oz-grid-2">
        <Card pad={0}>
          <div className="oz-card-head">
            <SectionTitle right={<Button size="sm" variant="ghost" icon="chevR" onClick={() => navigate("orders")}>View all</Button>}>Recent orders</SectionTitle>
          </div>
          <div className="oz-list">
            {recent.map(o => {
              const c = customerById(o.customerId);
              return (
                <button key={o.id} className="oz-list-row" onClick={() => navigate("order", { id: o.id })}>
                  <Avatar name={c.name} size={34} />
                  <div className="oz-list-main">
                    <span className="oz-list-title">{c.name}</span>
                    <span className="oz-list-sub mono">{o.number} · {o.items.reduce((a, i) => a + i.qty, 0)} items</span>
                  </div>
                  <div className="oz-list-end">
                    <span className="oz-list-amount">{fmtMoney(o.total)}</span>
                    <StatusBadge status={o.status} size="sm" />
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Card pad={0}>
          <div className="oz-card-head">
            <SectionTitle right={<Button size="sm" variant="ghost" icon="chevR" onClick={() => navigate("products")}>Manage</Button>}>Low inventory</SectionTitle>
          </div>
          <div className="oz-list">
            {lowStock.map(p => (
              <div key={p.id} className="oz-list-row" style={{ cursor: "default" }}>
                <span className="oz-prod-thumb" style={{ background: `radial-gradient(circle at 30% 30%, ${p.tone}66, ${p.tone}11)` }}>{p.emoji}</span>
                <div className="oz-list-main">
                  <span className="oz-list-title">{p.name}</span>
                  <span className="oz-list-sub">{p.category} · {p.strain}</span>
                </div>
                <div className="oz-list-end">
                  <span className="oz-stock-num" style={{ color: p.inv === 0 ? "#f87171" : "#f5b945" }}>{p.inv} left</span>
                  {p.inv === 0 ? <Pill color="#f87171">Out of stock</Pill> : <Pill color="#f5b945">Low</Pill>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { Overview });
