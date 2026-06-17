// ORBITZ Account — Rewards + Favorites
function Rewards({ go, toast }) {
  const [points, setPoints] = useState(ME.points);
  const [redeemed, setRedeemed] = useState([]);
  const tierPct = Math.max(0, Math.min(100, Math.round(((points - ME.tierFloor) / (ME.tierCeil - ME.tierFloor)) * 100)));

  const redeem = (perk) => {
    if (points < perk.cost || redeemed.includes(perk.id)) return;
    setPoints(p => { const n = p - perk.cost; ME.points = n; return n; });
    setRedeemed(r => [...r, perk.id]);
    toast({ msg: `Redeemed ${perk.title} · −${perk.cost} pts`, icon: "gift", tone: "#f5b945" });
  };

  return (
    <div className="ac-screen">
      {/* Points hero */}
      <div className="ac-hero" style={{ textAlign: "center", padding: 22 }}>
        <div className="ac-hero-glow" />
        <div style={{ position: "relative" }}>
          <Pill color="#b07cff">{ME.tier} tier</Pill>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 52, fontWeight: 600, lineHeight: 1.05, margin: "10px 0 0", letterSpacing: "-.01em" }}>
            {points.toLocaleString()}
          </div>
          <div style={{ fontSize: 13, color: "var(--text-2)", fontWeight: 600, marginBottom: 16 }}>reward points</div>
          <div className="ac-prog" style={{ background: "rgba(0,0,0,.3)" }}><div className="ac-prog-fill" style={{ width: tierPct + "%" }} /></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "var(--text-2)", marginTop: 8, fontWeight: 600 }}>
            <span>{ME.tier}</span>
            <span>{ME.tierCeil - points} pts to {ME.nextTier}</span>
          </div>
        </div>
      </div>

      {/* Redeem */}
      <div>
        <SectionTitle>Redeem points</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11, marginTop: 12 }}>
          {REWARD_PERKS.map(perk => {
            const done = redeemed.includes(perk.id);
            const afford = points >= perk.cost && !done;
            return (
              <div key={perk.id} className="oz-card" style={{ padding: 14, display: "flex", flexDirection: "column", gap: 4, opacity: done ? .55 : 1 }}>
                <div style={{ fontSize: 30, marginBottom: 4 }}>{perk.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{perk.title}</div>
                <div style={{ fontSize: 11.5, color: "var(--muted)", lineHeight: 1.4 }}>{perk.sub}</div>
                <div style={{ marginTop: "auto", paddingTop: 11 }}>
                  <button className={"oz-btn " + (afford ? "oz-btn-primary" : "oz-btn-ghost")} disabled={!afford}
                    style={{ height: 36, width: "100%", fontSize: 12.5, opacity: afford ? 1 : .6, pointerEvents: afford ? "auto" : "none" }}
                    onClick={() => redeem(perk)}>
                    {done ? <><Icon name="check" size={14} /> Redeemed</> : <><Icon name="sparkle" size={14} /> {perk.cost} pts</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* History */}
      <div>
        <SectionTitle>Points history</SectionTitle>
        <Card pad={0} style={{ marginTop: 12 }}>
          {REWARDS_TX.map((tx, i) => {
            const pos = tx.points >= 0;
            return (
              <div key={tx.id}>
                {i > 0 && <hr className="ac-divider" />}
                <div className="ac-row" style={{ padding: "13px 15px" }}>
                  <span className="ac-quick-ic" style={{ width: 34, height: 34, background: pos ? "rgba(52,211,153,.14)" : "rgba(176,124,255,.14)", borderColor: pos ? "rgba(52,211,153,.4)" : "rgba(176,124,255,.4)", color: pos ? "var(--green)" : "var(--primary)" }}>
                    <Icon name={pos ? "plus" : "gift"} size={15} />
                  </span>
                  <div className="ac-row-main">
                    <span className="ac-row-title" style={{ fontSize: 13.5 }}>{tx.reason}</span>
                    <span className="ac-row-sub">{ago(tx.at)}</span>
                  </div>
                  <span className="mono" style={{ fontWeight: 700, fontSize: 14, color: pos ? "var(--green)" : "var(--text-2)" }}>{pos ? "+" : ""}{tx.points}</span>
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      <div style={{ display: "flex", gap: 9, padding: 13, borderRadius: 13, background: "rgba(176,124,255,.07)", border: "1px solid rgba(176,124,255,.24)" }}>
        <Icon name="sparkle" size={16} style={{ color: "var(--primary)", flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.5 }}>Earn ~1 point per $1 spent, plus bonuses for referrals and birthdays. Points never expire.</span>
      </div>
    </div>
  );
}

// ---------- Favorites ----------
function Favorites({ go, toast, reorder }) {
  const [favs, setFavs] = useState([...ME.favorites]);
  const remove = (id) => {
    const next = favs.filter(f => f !== id);
    setFavs(next); ME.favorites = next;
    toast({ msg: "Removed from favorites", icon: "heart", tone: "#fb7185" });
  };
  const products = favs.map(productById);

  return (
    <div className="ac-screen">
      {products.length ? (
        <>
          <div className="span-all" style={{ fontSize: 13, color: "var(--muted)", padding: "2px 2px 0" }}>{products.length} saved · tap + to add to your next order</div>
          {products.map(p => (
            <div key={p.id} className="oz-card" style={{ padding: 13 }}>
              <div className="ac-row">
                <ProductThumb p={p} size={52} />
                <div className="ac-row-main">
                  <span className="ac-row-title">{p.name}</span>
                  <span className="ac-row-sub" style={{ textTransform: "capitalize" }}>{p.strain} · {p.size} · THC {p.thc}%</span>
                  <span style={{ fontWeight: 700, color: "var(--primary)", fontSize: 15, marginTop: 3 }}>{fmtMoney0(p.price)}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button className="ac-back" style={{ width: 38, height: 38, color: "#fb7185", borderColor: "rgba(251,113,133,.4)", background: "rgba(251,113,133,.12)" }} onClick={() => remove(p.id)} aria-label="Remove favorite">
                    <Icon name="heart" size={17} fill="currentColor" stroke={0} />
                  </button>
                  <button className="oz-btn oz-btn-primary" style={{ width: 38, height: 38, padding: 0 }} onClick={() => reorder([[p.id, 1]], p.name)} aria-label="Add to cart">
                    <Icon name="plus" size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <Button variant="ghost" full icon="bag" onClick={() => reorder(favs.map(f => [f, 1]), favs.length + " favorites")}>Add all to cart</Button>
        </>
      ) : (
        <div style={{ paddingTop: 30 }}>
          <Empty icon="heart" label="No favorites yet." />
          <Button variant="ghost" full onClick={() => go("home")} style={{ marginTop: 4 }}>Browse the menu</Button>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Rewards, Favorites });
