// ORBITZ Admin — UI primitives (icons, cards, buttons, badges, inputs, modal)
const { useState, useEffect, useRef } = React;

// ---------- Icon ----------
const ICONS = {
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  receipt: "M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2zM8 8h8M8 12h8M8 16h5",
  box: "M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8",
  users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11",
  truck: "M1 3h15v13H1zM16 8h4l3 3v5h-7zM5.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM18.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z",
  gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  bell: "M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  plus: "M12 5v14M5 12h14",
  search2: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  chevR: "M9 18l6-6-6-6",
  chevL: "M15 18l-6-6 6-6",
  chevD: "M6 9l6 6 6-6",
  x: "M18 6L6 18M6 6l12 12",
  check: "M20 6L9 17l-5-5",
  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z",
  trash: "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6",
  pin: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  card: "M2 5h20v14H2zM2 10h20",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  trend: "M23 6l-9.5 9.5-5-5L1 18M17 6h6v6",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  image: "M3 3h18v18H3zM8.5 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM21 15l-5-5L5 21",
  gift: "M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z",
  sparkle: "M12 3l1.9 5.8L20 10l-6.1 1.2L12 17l-1.9-5.8L4 10l6.1-1.2z",
  filter: "M22 3H2l8 9.46V19l4 2v-8.54z",
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  dollar: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  menu: "M3 12h18M3 6h18M3 18h18",
  alert: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
};
function Icon({ name, size = 18, stroke = 2, style, fill }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
      <path d={ICONS[name] || ""} />
    </svg>
  );
}

// ---------- Card ----------
function Card({ children, style, pad = 22, className = "", onClick, hover }) {
  return (
    <div className={"oz-card " + (hover ? "oz-card-hover " : "") + className} onClick={onClick}
      style={{ padding: pad, cursor: onClick ? "pointer" : undefined, ...style }}>
      {children}
    </div>
  );
}

// ---------- Button ----------
function Button({ children, variant = "primary", size = "md", icon, onClick, type = "button", style, disabled, full }) {
  const sizes = { sm: { h: 32, px: 12, fs: 12.5 }, md: { h: 40, px: 16, fs: 13.5 }, lg: { h: 46, px: 22, fs: 14.5 } };
  const s = sizes[size];
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={"oz-btn oz-btn-" + variant}
      style={{ height: s.h, padding: `0 ${s.px}px`, fontSize: s.fs, width: full ? "100%" : undefined,
        opacity: disabled ? .45 : 1, pointerEvents: disabled ? "none" : undefined, ...style }}>
      {icon && <Icon name={icon} size={size === "sm" ? 14 : 16} />}
      {children}
    </button>
  );
}

// ---------- Badge / StatusBadge ----------
function StatusBadge({ status, size = "md" }) {
  const m = ORBITZ_STATUS[status]; if (!m) return null;
  const sm = size === "sm";
  return (
    <span className="oz-status" style={{
      color: m.color, background: m.glow, borderColor: m.color + "55",
      fontSize: sm ? 11 : 12, padding: sm ? "3px 8px" : "4px 11px" }}>
      <span className="oz-dot" style={{ background: m.color, boxShadow: `0 0 8px ${m.color}` }} />
      {m.label}
    </span>
  );
}
function Pill({ children, color = "#9aa6c4", tone }) {
  return <span className="oz-pill" style={{ color, background: (tone || color) + "1f", borderColor: color + "44" }}>{children}</span>;
}

// ---------- Avatar ----------
function Avatar({ name, size = 36, tone = "#b07cff" }) {
  return (
    <div className="oz-avatar" style={{ width: size, height: size, fontSize: size * 0.36,
      background: `linear-gradient(135deg, ${tone}, ${tone}55)` }}>
      {initials(name)}
    </div>
  );
}

// ---------- Inputs ----------
function Field({ label, children, hint }) {
  return (
    <label className="oz-field">
      {label && <span className="oz-field-label">{label}</span>}
      {children}
      {hint && <span className="oz-field-hint">{hint}</span>}
    </label>
  );
}
function Input({ value, onChange, placeholder, type = "text", icon, style }) {
  return (
    <div className="oz-input-wrap" style={style}>
      {icon && <Icon name={icon} size={15} style={{ color: "var(--muted)", flexShrink: 0 }} />}
      <input className="oz-input" type={type} value={value} placeholder={placeholder}
        onChange={(e) => onChange && onChange(e.target.value)} />
    </div>
  );
}
function Select({ value, onChange, options, style }) {
  return (
    <div className="oz-input-wrap oz-select-wrap" style={style}>
      <select className="oz-input oz-select" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <Icon name="chevD" size={14} style={{ color: "var(--muted)", position: "absolute", right: 12, pointerEvents: "none" }} />
    </div>
  );
}
function Toggle({ on, onChange }) {
  return (
    <button type="button" className="oz-toggle" data-on={on ? "1" : "0"} onClick={() => onChange(!on)}>
      <span className="oz-toggle-knob" />
    </button>
  );
}

// ---------- Modal / Drawer ----------
function Modal({ open, onClose, title, children, width = 480, footer }) {
  useEffect(() => {
    if (!open) return;
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [open]);
  if (!open) return null;
  return (
    <div className="oz-overlay" onClick={onClose}>
      <div className="oz-modal" style={{ width }} onClick={(e) => e.stopPropagation()}>
        <div className="oz-modal-head">
          <h3>{title}</h3>
          <button className="oz-icon-btn" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>
        <div className="oz-modal-body">{children}</div>
        {footer && <div className="oz-modal-foot">{footer}</div>}
      </div>
    </div>
  );
}
function Drawer({ open, onClose, title, children, width = 560, footer }) {
  useEffect(() => {
    if (!open) return;
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [open]);
  return (
    <div className={"oz-drawer-overlay " + (open ? "open" : "")} onClick={onClose}>
      <div className="oz-drawer" style={{ width, transform: open ? "translateX(0)" : "translateX(100%)" }}
        onClick={(e) => e.stopPropagation()}>
        <div className="oz-modal-head">
          <h3>{title}</h3>
          <button className="oz-icon-btn" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>
        <div className="oz-drawer-body">{children}</div>
        {footer && <div className="oz-modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

// ---------- Image placeholder ----------
function ProofPlaceholder({ method, height = 240 }) {
  return (
    <div className="oz-proof" style={{ height }}>
      <div className="oz-proof-stripes" />
      <div className="oz-proof-label">
        <Icon name="image" size={20} style={{ color: "var(--muted)" }} />
        <span className="mono">payment_proof.png</span>
        <span className="mono dim">{method} transfer · uploaded by customer</span>
      </div>
    </div>
  );
}

// ---------- Section header ----------
function SectionTitle({ children, right }) {
  return (
    <div className="oz-section-title">
      <h2>{children}</h2>
      {right}
    </div>
  );
}
function Empty({ icon = "search", label }) {
  return (
    <div className="oz-empty">
      <Icon name={icon} size={26} style={{ color: "var(--muted)" }} />
      <span>{label}</span>
    </div>
  );
}

Object.assign(window, {
  Icon, Card, Button, StatusBadge, Pill, Avatar, Field, Input, Select, Toggle,
  Modal, Drawer, ProofPlaceholder, SectionTitle, Empty,
});
