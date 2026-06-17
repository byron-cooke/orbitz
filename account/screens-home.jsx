// ORBITZ Account — Account Home
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function ActiveOrderCard({ order, go }) {
  const m = ORBITZ_STATUS[order.status];
  const idx = ORBITZ_FLOW.indexOf(order.status);
  const pct = Math.round(((idx + 1) / ORBITZ_FLOW.length) * 100);
  return (
    <div className="ac-hero" onClick={() => go("track", { id: order.id })} style={{ cursor: "pointer" }}>
      <div className="ac-hero-glow" />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <StatusBadge status={order.status} />
          <span className="mono" style={{ fontSize: 12, color: "var(--text-2)", fontWeight: 600 }}>{order.number}</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 12.5, color: "var(--text-2)", fontWeight: 600 }}>Arriving in</div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 32, fontWeight: 600, lineHeight: 1, marginTop: 3 }}>
              {fromNow(order.eta)}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 28, filter: "drop-shadow(0 4px 10px rgba(176,124,255,.5))" }}>{order.driver?.avatar || "🛸"}</div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12.5, fontWeight: 700 }}>{order.driver?.short || "Courier"}</div>
              <div style={{ fontSize: 11, color: "var(--amber)", fontWeight: 700 }}>★ {order.driver?.rating}</div>
            </div>
          </div>
        </div>
        <div className="ac-prog"><div className="ac-prog-fill" style={{ width: pct + "%" }} /></div>
        <Button size="sm" full iconRight="arrowR" style={{ marginTop: 2 }} onClick={(e) => { e.stopPropagation(); go("track", { id: order.id }); }}>
          Track delivery
        </Button>
      </div>
    </div>
  );
}

function Home({ go, toast, reorder }) {
  const active = activeOrder();
  const recent = MY_ORDERS.filter(o => o.status === "delivered").slice(0, 3);
  const favs = ME.favorites.map(productById);
  const tierPct = Math.round(((ME.points - ME.tierFloor) / (ME.tierCeil - ME.tierFloor)) * 100);

  return (
    <div className="ac-screen">
      {active
        ? <ActiveOrderCard order={active} go={go} />
        : (
          <Card pad={18}>
            <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
              <span className="ac-quick-ic" style={{ width: 46, height: 46, background: "rgba(176,124,255,.14)", borderColor: "rgba(176,124,255,.4)", color: "var(--primary)" }}>
                <Icon name="rocket" size={22} />
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>No orders in orbit</div>
                <div style={{ fontSize: 12.5, color: "var(--muted)" }}>Your next drop will show up here.</div>
              </div>
            </div>
          </Card>
        )}

      <div className="ac-quick">
        <QuickAction icon="repeat" label="Reorder" tone="#b07cff" onClick={() => go("orders")} />
        <QuickAction icon="truck"  label="Track"   tone="#5b8cff" onClick={() => active ? go("track", { id: active.id }) : go("orders")} />
        <QuickAction icon="star"   label="Rewards" tone="#f5b945" onClick={() => go("rewards")} />
        <QuickAction icon="heart"  label="Favorites" tone="#fb7185" onClick={() => go("favorites")} />
      </div>

      {/* Rewards strip */}
      <Card pad={16} hover onClick={() => go("rewards")}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <Icon name="sparkle" size={18} style={{ color: "var(--primary)" }} />
            <span style={{ fontWeight: 700, fontSize: 14 }}>ORBITZ Rewards</span>
          </div>
          <Pill color="#b07cff">{ME.tier}</Pill>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 11 }}>
          <span className="mono" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 30, fontWeight: 600, color: "var(--primary)" }}>
            {ME.points.toLocaleString()}
          </span>
          <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>pts</span>
        </div>
        <div className="ac-prog"><div className="ac-prog-fill" style={{ width: tierPct + "%" }} /></div>
        <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 8 }}>
          {ME.tierCeil - ME.points} pts to {ME.nextTier}
        </div>
      </Card>

      {/* Favorites rail */}
      <div>
        <SectionTitle right={<button className="oz-link" onClick={() => go("favorites")}>See all</button>}>Your favorites</SectionTitle>
        <div style={{ display: "flex", gap: 11, overflowX: "auto", padding: "12px 2px 4px", margin: "0 -2px" }}>
          {favs.map(p => (
            <div key={p.id} className="oz-card" style={{ padding: 12, width: 132, flexShrink: 0 }}>
              <ProductThumb p={p} size={52} />
              <div style={{ fontWeight: 700, fontSize: 13.5, marginTop: 10, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
              <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 1 }}>{p.size} · THC {p.thc}%</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                <span style={{ fontWeight: 700, color: "var(--primary)", fontSize: 14.5 }}>{fmtMoney0(p.price)}</span>
                <button className="ac-back" style={{ width: 32, height: 32, borderRadius: 9 }}
                  onClick={() => reorder([[p.id, 1]], p.name)} aria-label={"Add " + p.name}>
                  <Icon name="plus" size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order again */}
      <div>
        <SectionTitle right={<button className="oz-link" onClick={() => go("orders")}>All orders</button>}>Order again</SectionTitle>
        <Card pad={0} style={{ marginTop: 12 }}>
          {recent.map((o, i) => (
            <div key={o.id}>
              {i > 0 && <hr className="ac-divider" />}
              <div className="ac-row" style={{ padding: 14 }}>
                <div style={{ display: "flex", marginRight: 2 }}>
                  {o.items.slice(0, 2).map((it, j) => (
                    <div key={j} style={{ marginLeft: j ? -14 : 0, zIndex: 2 - j }}>
                      <ProductThumb p={productById(it.productId)} size={40} />
                    </div>
                  ))}
                </div>
                <div className="ac-row-main" onClick={() => go("order", { id: o.id })} style={{ cursor: "pointer" }}>
                  <span className="ac-row-title">{o.items.map(it => productById(it.productId).name).join(", ")}</span>
                  <span className="ac-row-sub">{o.number} · {fmtDateShort(o.createdAt)} · {fmtMoney(o.total)}</span>
                </div>
                <button className="oz-btn oz-btn-ghost" style={{ height: 36, padding: "0 13px", fontSize: 12.5 }}
                  onClick={() => reorder(o.items.map(it => [it.productId, it.qty]), null, o.number)}>
                  <Icon name="repeat" size={15} />Reorder
                </button>
              </div>
            </div>
          ))}
        </Card>
      </div>

      <button className="ac-row" style={{ padding: "13px 15px", borderRadius: 14, background: "var(--surface)", border: "1px solid var(--line)", cursor: "pointer", color: "var(--text)" }} onClick={() => go("support")}>
        <span className="ac-quick-ic" style={{ width: 36, height: 36, background: "rgba(91,140,255,.14)", borderColor: "rgba(91,140,255,.4)", color: "var(--blue)" }}><Icon name="msg" size={17} /></span>
        <div className="ac-row-main"><span className="ac-row-title">Contact support</span><span className="ac-row-sub">Chat, text, or call the crew</span></div>
        <Icon name="chevR" size={18} style={{ color: "var(--muted)" }} />
      </button>
    </div>
  );
}

Object.assign(window, { Home, greeting, ActiveOrderCard });
