// ORBITZ Checkout — UI primitives: hooks, Icon, ProductShot, Stepper, OrderSummary, Toast
const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ───────────────────────── Icon (24px stroke grid) ─────────────────────────
const CO_ICONS = {
  check:   <path d="M20 6L9 17l-5-5" />,
  x:       <><path d="M18 6L6 18" /><path d="M6 6l12 12" /></>,
  plus:    <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  minus:   <path d="M5 12h14" />,
  trash:   <><path d="M3 6h18" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></>,
  lock:    <><rect x="4.5" y="11" width="15" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  shield:  <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="M9 12l2 2 4-4" /></>,
  truck:   <><rect x="1.5" y="6" width="13" height="10" rx="1.5" /><path d="M14.5 9h4l3 3v4h-7z" /><circle cx="6" cy="18.5" r="1.8" /><circle cx="17.5" cy="18.5" r="1.8" /></>,
  pin:     <><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.6" /></>,
  home:    <><path d="M3 11l9-8 9 8" /><path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10" /></>,
  building:<><rect x="5" y="3" width="14" height="18" rx="1.5" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" /></>,
  clock:   <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  calendar:<><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M3.5 9.5h17M8 3v4M16 3v4" /></>,
  bolt:    <path d="M13 2L3 14h7l-1 8 10-12h-7z" />,
  card:    <><rect x="2.5" y="5" width="19" height="14" rx="2.5" /><path d="M2.5 9.5h19M6 15h3" /></>,
  cash:    <><rect x="2.5" y="6" width="19" height="12" rx="2" /><circle cx="12" cy="12" r="2.6" /><path d="M6 9.5v5M18 9.5v5" /></>,
  crypto:  <><circle cx="12" cy="12" r="9" /><path d="M9.5 8h4.2a2 2 0 0 1 0 4H9.5zM9.5 12h4.6a2 2 0 0 1 0 4H9.5zM9.5 8v8M11 6.4v1.6M11 16v1.6M13.5 6.4v1.6M13.5 16v1.6" /></>,
  apple:   <><path d="M16.3 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.9-1.4-.1-2.8.9-3.5.9s-1.8-.9-3-.8c-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.8 1.1 9 .8 1.1 1.6 2.3 2.8 2.2 1.1 0 1.6-.7 2.9-.7s1.8.7 3 .7 2-1.1 2.7-2.1c.9-1.3 1.2-2.5 1.2-2.6-.1 0-2.3-.9-2.4-3.5z" /><path d="M14.4 5.6c.6-.8 1-1.8.9-2.9-.9 0-2 .6-2.6 1.4-.6.7-1.1 1.7-.9 2.7 1 .1 2-.5 2.6-1.2z" /></>,
  google:  <><circle cx="12" cy="12" r="9" /><path d="M12 10.5h5c.2 3-2 5-5 5a5 5 0 1 1 3.3-8.8" /></>,
  idcard:  <><rect x="2.5" y="5" width="19" height="14" rx="2.5" /><circle cx="8" cy="11" r="2.2" /><path d="M5 16c.5-1.6 1.7-2.4 3-2.4s2.5.8 3 2.4M14 9.5h4M14 13h3" /></>,
  camera:  <><path d="M4 8h3l1.5-2h7L17 8h3a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 20 19H4a1.5 1.5 0 0 1-1.5-1.5v-8A1.5 1.5 0 0 1 4 8z" /><circle cx="12" cy="13" r="3.4" /></>,
  upload:  <><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></>,
  sparkle: <path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" />,
  rocket:  <><path d="M12 3c3.5 1.6 5.5 5 5.5 9 0 1.7-.4 3-1 4l-1.5-1H9l-1.5 1c-.6-1-1-2.3-1-4 0-4 2-7.4 5.5-9z" /><circle cx="12" cy="10" r="1.6" /><path d="M9 16l-2.5 4M15 16l2.5 4" /></>,
  chevR:   <path d="M9 6l6 6-6 6" />,
  chevL:   <path d="M15 6l-6 6 6 6" />,
  arrowR:  <><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></>,
  edit:    <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></>,
  bag:     <><path d="M5.5 8h13l-1 11.4a2 2 0 0 1-2 1.6H8.5a2 2 0 0 1-2-1.6z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></>,
  info:    <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
  warn:    <><path d="M12 3l9.5 17H2.5z" /><path d="M12 10v4M12 17h.01" /></>,
  phone:   <path d="M5 4h4l1.5 5-2 1.5a13 13 0 0 0 5 5l1.5-2 5 1.5v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  copy:    <><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></>,
  user:    <><circle cx="12" cy="8" r="3.6" /><path d="M5 20c.8-3.5 3.6-5.4 7-5.4s6.2 1.9 7 5.4" /></>,
};
const Icon = ({ name, size = 20, stroke = 2, fill = "none", style }) => {
  const path = CO_ICONS[name] || CO_ICONS.info;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
      stroke={stroke ? "currentColor" : "none"} strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round"
      style={{ display: "block", flexShrink: 0, ...(style || {}) }}>{path}</svg>
  );
};

// ───────────────────────── Stars ─────────────────────────
const Stars = ({ rating = 5, size = 12 }) => {
  const full = Math.round(rating);
  return (
    <span style={{ color: "var(--gold)", fontSize: size, letterSpacing: ".5px", lineHeight: 1, whiteSpace: "nowrap" }}>
      {[1, 2, 3, 4, 5].map(i => <span key={i} style={{ opacity: i <= full ? 1 : .26 }}>★</span>)}
    </span>
  );
};

// ───────────────────────── Product shot placeholder (self-contained) ─────────────────────────
// Premium labeled stand-in for real photography — striped field + tonal glow + mono caption.
const CO_CAT_LABEL = { flower: "Flower", preroll: "Pre-Roll", edible: "Edible", vape: "Vape", concentrate: "Concentrate", accessory: "Accessory" };
const ProductShot = ({ tone = "#B86AFF", category, size = "md" }) => {
  const compact = size === "sm" || size === "xs";
  const ringSize = size === "xs" ? 16 : size === "sm" ? 26 : 48;
  return (
    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", overflow: "hidden",
      background: "rgba(10,10,18,.6)" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 42%, ${tone}40 0%, transparent 70%)` }} />
      <div style={{ position: "absolute", inset: 0,
        background: "repeating-linear-gradient(135deg,rgba(255,255,255,.03) 0 10px,transparent 10px 20px)" }} />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: .7 }}>
        <div style={{ width: ringSize, height: ringSize, borderRadius: "50%", border: `1.5px dashed ${tone}88`, position: "relative" }} />
        {!compact && <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, letterSpacing: ".14em", color: "rgba(255,255,255,.5)", textTransform: "uppercase" }}>Product&nbsp;Shot</div>}
        {!compact && category && <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, letterSpacing: ".1em", color: "rgba(255,255,255,.3)", textTransform: "uppercase" }}>{CO_CAT_LABEL[category] || category}</div>}
      </div>
    </div>
  );
};

const strainLine = (p) => {
  if (p.category === "accessory") return p.size;
  const unit = p.category === "edible" ? "" : `THC ${p.thc}%`;
  const strain = p.strain ? p.strain[0].toUpperCase() + p.strain.slice(1) : "";
  return [strain, p.size, p.category === "edible" ? null : unit].filter(Boolean).join(" · ");
};

// ───────────────────────── Stepper ─────────────────────────
function Stepper({ steps, current, maxReached, onJump }) {
  const cur = steps[current];
  const next = steps[current + 1];
  return (
    <div className="co-stepper-wrap">
      {/* desktop */}
      <div className="co-stepper">
        {steps.map((s, i) => {
          const state = i < current ? "done" : i === current ? "active" : "todo";
          const clickable = i <= maxReached && i !== current;
          return (
            <React.Fragment key={s.id}>
              <div className={`co-step ${state} ${clickable ? "clickable" : ""}`} style={{ flex: i === steps.length - 1 ? "0 0 auto" : undefined }}>
                <button className="co-step-btn" disabled={!clickable} onClick={() => clickable && onJump(i)}>
                  <span className="co-step-dot">{i < current ? <Icon name="check" size={16} stroke={2.6} /> : i + 1}</span>
                  <span className="co-step-label">
                    <span className="co-step-idx">Step {i + 1}</span>
                    <span className="co-step-name">{s.name}</span>
                  </span>
                </button>
              </div>
              {i < steps.length - 1 && (
                <span className={`co-step-conn ${i < current ? "done" : ""}`}><span className="co-step-conn-fill" /></span>
              )}
            </React.Fragment>
          );
        })}
      </div>
      {/* mobile */}
      <div className="co-stepper-mob">
        <div className="co-mob-top">
          <div className="co-mob-cur">
            <b>{cur.name}</b>
            <span className="co-mob-count">{current + 1}/{steps.length}</span>
          </div>
          {next && <span className="co-mob-next">Next: {next.name}</span>}
        </div>
        <div className="co-mob-bar"><div className="co-mob-bar-fill" style={{ width: ((current + 1) / steps.length) * 100 + "%" }} /></div>
      </div>
    </div>
  );
}

// ───────────────────────── Order Summary (sidebar) ─────────────────────────
function OrderSummary({ cart, co, setCheckout, totals, cta, showControls = true, title = "Order Summary" }) {
  const t = totals;
  const [promoInput, setPromoInput] = useState("");
  const [promoErr, setPromoErr] = useState("");

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    if (CO_PROMOS[code]) {
      setCheckout(c => ({ ...c, promo: code }));
      setPromoErr(""); setPromoInput("");
    } else {
      setPromoErr("That code isn’t valid.");
    }
  };
  const clearPromo = () => setCheckout(c => ({ ...c, promo: "" }));
  const toggleRewards = () => setCheckout(c => ({ ...c, rewardsApplied: !c.rewardsApplied }));

  return (
    <div className="card co-side-summary">
      <div className="co-sum-head">
        <h3>{title}</h3>
        <span className="cc">{t.itemCount} {t.itemCount === 1 ? "item" : "items"}</span>
      </div>

      <div className="co-sum-items">
        {t.lines.map(x => (
          <div className="co-sum-item" key={x.id}>
            <div className="co-sum-item-img">
              <span className="co-sum-item-qty">{x.qty}</span>
              <ProductShot tone={x.p.tone} size="xs" />
            </div>
            <div className="co-sum-item-main">
              <div className="co-sum-item-name">{x.p.name}</div>
              <div className="co-sum-item-sub">{x.p.size}</div>
            </div>
            <span className="co-sum-item-price">{fmtMoney(x.p.price * x.qty)}</span>
          </div>
        ))}
      </div>

      {showControls && (
        <>
          <div className="co-promo">
            {t.promo ? (
              <div className="co-promo-applied">
                <Icon name="sparkle" size={15} />
                <span><b>{t.promo.code}</b> — {t.promo.label}</span>
                <button className="rm" onClick={clearPromo} aria-label="Remove promo"><Icon name="x" size={14} stroke={2.4} /></button>
              </div>
            ) : (
              <>
                <div className="co-promo-row">
                  <input className="co-promo-input" placeholder="Promo code" value={promoInput}
                    onChange={e => { setPromoInput(e.target.value); setPromoErr(""); }}
                    onKeyDown={e => e.key === "Enter" && applyPromo()} />
                  <button className="co-promo-btn" onClick={applyPromo}>Apply</button>
                </div>
                {promoErr && <div className="co-promo-err"><Icon name="warn" size={13} />{promoErr}</div>}
              </>
            )}
          </div>

          <div className="co-rewards-toggle">
            <span className="co-rw-ic"><Icon name="sparkle" size={18} /></span>
            <div className="co-rw-txt">
              <div className="co-rw-title">Apply Orbitz Rewards</div>
              <div className="co-rw-sub">{CUSTOMER.points.toLocaleString()} pts available · save up to {fmtMoney(CO_MAX_REWARD_PTS * CO_POINTS_VALUE)}</div>
            </div>
            <button className={"switch" + (co.rewardsApplied ? " on" : "")} onClick={toggleRewards} aria-pressed={co.rewardsApplied} aria-label="Toggle rewards" />
          </div>
        </>
      )}

      <div className="co-totals">
        <div className="co-trow"><span>Subtotal</span><span className="v">{fmtMoney(t.subtotal)}</span></div>
        {t.discount > 0 && <div className="co-trow discount"><span>Discount{t.promo ? ` (${t.promo.code})` : ""}</span><span className="v">−{fmtMoney(t.discount)}</span></div>}
        <div className={"co-trow" + (t.freeShip ? " free" : "")}><span>Delivery{co.delivery.timing === "asap" ? " · Priority" : ""}</span><span className="v">{t.freeShip ? "FREE" : fmtMoney(t.deliveryFee)}</span></div>
        <div className="co-trow"><span>Taxes</span><span className="v">{fmtMoney(t.tax)}</span></div>
        {t.rewardValue > 0 && <div className="co-trow discount"><span>Rewards ({t.rewardPts.toLocaleString()} pts)</span><span className="v">−{fmtMoney(t.rewardValue)}</span></div>}
        <div className="co-trow grand"><span>Total</span><span className="v">{fmtMoney(t.total)}</span></div>
      </div>

      <div className="co-eta-chip">
        <Icon name="clock" size={18} />
        <div>
          <div className="lbl">Estimated arrival</div>
          <div className="val">{etaLabel(co)}</div>
        </div>
      </div>

      {t.pointsEarned > 0 && (
        <div className="co-sum-pts"><Icon name="sparkle" size={13} style={{ color: "var(--p)" }} />You’ll earn <b>{t.pointsEarned.toLocaleString()} pts</b> on this order</div>
      )}

      {cta && <div className="co-sum-cta">{cta}</div>}
    </div>
  );
}

// ───────────────────────── Toast ─────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="co-toast-wrap">
      <div className="co-toast">
        <span className="co-toast-ic"><Icon name={toast.icon || "check"} size={15} stroke={2.6} /></span>
        {toast.msg}
      </div>
    </div>
  );
}

Object.assign(window, { Icon, Stars, ProductShot, strainLine, Stepper, OrderSummary, Toast });
