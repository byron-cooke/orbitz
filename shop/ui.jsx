// ORBITZ Shop — UI primitives: Icon, Stars, StrainBadge, ProductShot, PotChips
const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ───────────────────────── Icon (24px stroke grid) ─────────────────────────
const ICON_PATHS = {
  search:   <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>,
  x:        <><path d="M18 6L6 18" /><path d="M6 6l12 12" /></>,
  bag:      <><path d="M5.5 8h13l-1 11.4a2 2 0 0 1-2 1.6H8.5a2 2 0 0 1-2-1.6z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></>,
  heart:    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />,
  plus:     <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  minus:    <path d="M5 12h14" />,
  check:    <path d="M20 6L9 17l-5-5" />,
  star:     <path d="M12 2.5l2.95 5.98 6.6.96-4.77 4.65 1.13 6.57L12 18.6l-5.9 3.06 1.12-6.57L2.45 9.44l6.6-.96z" />,
  sliders:  <><path d="M4 6h10" /><path d="M18 6h2" /><path d="M4 12h4" /><path d="M12 12h8" /><path d="M4 18h12" /><path d="M18 18h2" /><circle cx="16" cy="6" r="2" /><circle cx="10" cy="12" r="2" /><circle cx="16" cy="18" r="2" /></>,
  filter:   <><path d="M3 5h18" /><path d="M6 12h12" /><path d="M10 19h4" /></>,
  chevD:    <path d="M6 9l6 6 6-6" />,
  chevR:    <path d="M9 6l6 6-6 6" />,
  trash:    <><path d="M3 6h18" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></>,
  sparkle:  <path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6zM18 15l.7 2 .3.7 2 .3-2 .3-.3.7-.7 2-.7-2-.3-.7-2-.3 2-.3.3-.7z" />,
  lock:     <><rect x="4.5" y="11" width="15" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  rocket:   <><path d="M12 3c3.5 1.6 5.5 5 5.5 9 0 1.7-.4 3-1 4l-1.5-1H9l-1.5 1c-.6-1-1-2.3-1-4 0-4 2-7.4 5.5-9z" /><circle cx="12" cy="10" r="1.6" /><path d="M9 16l-2.5 4M15 16l2.5 4" /></>,
  grid:     <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  leaf:     <path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 16-9 0 9-4 16-9 16a6 6 0 0 1-2-.4M4 20c2-6 5-8 9-9" />,
  bolt:     <path d="M13 2L3 14h7l-1 8 10-12h-7z" />,
  gift:     <><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M5 12v9h14v-9M12 8v13" /><path d="M12 8S10 3 7.5 4.5 9 8 12 8zM12 8s2-5 4.5-3.5S15 8 12 8z" /></>,
  info:     <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
};

const Icon = ({ name, size = 20, stroke = 2, fill = "none", style }) => {
  const path = ICON_PATHS[name] || ICON_PATHS.info;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
      stroke={stroke ? "currentColor" : "none"} strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round"
      style={{ display: "block", flexShrink: 0, ...(style || {}) }}>{path}</svg>
  );
};

// ───────────────────────── Stars ─────────────────────────
const Stars = ({ rating, size = 14 }) => {
  const full = Math.round(rating);
  return (
    <span style={{ color: "var(--gold)", fontSize: size, letterSpacing: "1px", lineHeight: 1, whiteSpace: "nowrap" }}
      aria-label={rating + " out of 5 stars"}>
      {[1, 2, 3, 4, 5].map((i) => <span key={i} style={{ opacity: i <= full ? 1 : 0.24 }}>★</span>)}
    </span>
  );
};

// ───────────────────────── Strain badge ─────────────────────────
// Default: absolute corner badge for product cards (.scard-badge).
// inline: static pill for use in modal headers / rows.
const STATIC_BADGE = { padding: "4px 10px", borderRadius: 7, fontSize: 10.5, fontWeight: 700,
  textTransform: "uppercase", letterSpacing: ".04em", display: "inline-block", lineHeight: 1.35 };
const StrainBadge = ({ strain, inline = false }) => {
  if (!strain) return null;
  const m = STRAIN_META[strain];
  if (!m) return null;
  return inline
    ? <span className={"sh-badge " + m.cls} style={STATIC_BADGE}>{m.label}</span>
    : <span className={"scard-badge " + m.cls}>{m.label}</span>;
};

// ───────────────────────── Product shot placeholder ─────────────────────────
// A premium, labeled stand-in for real product photography. Striped field +
// tonal glow keyed to the product, with a mono "PRODUCT SHOT" caption so it
// reads as a deliberate drop-zone for real imagery later — never emoji art.
const CAT_LABEL = {
  flower: "Flower", preroll: "Pre-Roll", edible: "Edible", vape: "Vape",
  concentrate: "Concentrate", accessory: "Accessory",
};
const ProductShot = ({ tone = "#B86AFF", category, compact = false, ring = true }) => (
  <div className="pshot">
    <div className="pshot-glow" style={{ background: `radial-gradient(circle at 50% 42%, ${tone}3d 0%, transparent 68%)` }} />
    <div className="pshot-stripes" />
    <div className="pshot-label">
      {ring && <div className="pshot-ring" style={{ borderColor: tone + "66", width: compact ? 30 : 54, height: compact ? 30 : 54 }} />}
      {!compact && <div className="pshot-cap">Product&nbsp;Shot</div>}
      {!compact && category && <div className="pshot-cap sub">{CAT_LABEL[category] || category}</div>}
    </div>
  </div>
);

// ───────────────────────── Potency chips (card meta) ─────────────────────────
const PotChips = ({ p }) => {
  if (p.category === "accessory") return null;
  const unit = p.category === "edible" ? "mg" : "%";
  const chips = [];
  if (p.thc != null && p.thc > 0) chips.push(["THC", p.thc + unit]);
  if (p.cbd != null && p.cbd >= 1) chips.push(["CBD", p.cbd + unit]);
  if (!chips.length) return null;
  return <>{chips.map(([k, v]) => <span className="potchip" key={k}>{k}&nbsp;<b>{v}</b></span>)}</>;
};

Object.assign(window, { Icon, Stars, StrainBadge, ProductShot, PotChips });
