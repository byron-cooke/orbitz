// ORBITZ Account — UI primitives + mobile shell components
const { useState, useEffect, useRef, useCallback } = React;

// ---------- Icons ----------
const ICONS = {
  home: "M3 11l9-8 9 8M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10",
  receipt: "M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2zM8 8h8M8 12h8M8 16h5",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
  truck: "M1 3h15v13H1zM16 8h4l3 3v5h-7zM5.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM18.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z",
  bell: "M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  chevR: "M9 18l6-6-6-6",
  chevL: "M15 18l-6-6 6-6",
  chevD: "M6 9l6 6 6-6",
  x: "M18 6L6 18M6 6l12 12",
  check: "M20 6L9 17l-5-5",
  plus: "M12 5v14M5 12h14",
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6",
  pin: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  card: "M2 5h20v14H2zM2 10h20",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  image: "M3 3h18v18H3zM8.5 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM21 15l-5-5L5 21",
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  gift: "M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z",
  sparkle: "M12 3l1.9 5.8L20 10l-6.1 1.2L12 17l-1.9-5.8L4 10l6.1-1.2z",
  repeat: "M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  shieldCheck: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4",
  help: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01",
  msg: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
  signal: "M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 4v16",
  wifi: "M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01",
  battery: "M3 7h15v10H3zM21 10v4",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  bag: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0",
  arrowR: "M5 12h14M12 5l7 7-7 7",
  trash: "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
  copy: "M9 9h13v13H9zM5 15H3V3h12v2",
  zap: "M13 2L3 14h9l-1 8 10-12h-9z",
  rocket: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91 0zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2zM9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",
};
function Icon({ name, size = 20, stroke = 2, style, fill }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
      <path d={ICONS[name] || ""} />
    </svg>
  );
}

// ---------- Card ----------
function Card({ children, style, pad = 16, hover, onClick, className = "" }) {
  return (
    <div className={"oz-card" + (hover ? " oz-card-hover" : "") + (className ? " " + className : "")} onClick={onClick}
      style={{ padding: pad, cursor: onClick ? "pointer" : undefined, ...style }}>
      {children}
    </div>
  );
}

// ---------- Button ----------
function Button({ children, variant = "primary", size = "md", icon, iconRight, onClick, type = "button", style, disabled, full }) {
  const sizes = { sm: { h: 36, px: 14, fs: 13 }, md: { h: 46, px: 18, fs: 14.5 }, lg: { h: 52, px: 22, fs: 15.5 } };
  const s = sizes[size];
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={"oz-btn oz-btn-" + variant}
      style={{ height: s.h, padding: `0 ${s.px}px`, fontSize: s.fs, width: full ? "100%" : undefined,
        opacity: disabled ? .45 : 1, pointerEvents: disabled ? "none" : undefined, ...style }}>
      {icon && <Icon name={icon} size={size === "lg" ? 18 : 16} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === "lg" ? 18 : 16} />}
    </button>
  );
}

// ---------- StatusBadge / Pill ----------
function StatusBadge({ status, size = "md" }) {
  const m = ORBITZ_STATUS[status]; if (!m) return null;
  const sm = size === "sm";
  return (
    <span className="oz-status" style={{ color: m.color, background: m.glow, borderColor: m.color + "55",
      fontSize: sm ? 11 : 12, padding: sm ? "3px 9px" : "4px 11px" }}>
      <span className="oz-dot" style={{ background: m.color, boxShadow: `0 0 8px ${m.color}` }} />
      {m.label}
    </span>
  );
}
function Pill({ children, color = "#9aa6c4" }) {
  return <span className="oz-pill" style={{ color, background: color + "1f", borderColor: color + "44" }}>{children}</span>;
}
function StrainPill({ strain }) {
  const map = { hybrid: "#b07cff", indica: "#f472b6", sativa: "#34d399" };
  return <Pill color={map[strain] || "#b07cff"}>{strain[0].toUpperCase() + strain.slice(1)}</Pill>;
}

// ---------- Avatar ----------
function Avatar({ name, size = 40, tone = "#b07cff" }) {
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
function Input({ value, onChange, placeholder, type = "text", icon, style, inputMode }) {
  return (
    <div className="oz-input-wrap" style={style}>
      {icon && <Icon name={icon} size={16} style={{ color: "var(--muted)", flexShrink: 0 }} />}
      <input className="oz-input" type={type} value={value} placeholder={placeholder} inputMode={inputMode}
        onChange={(e) => onChange && onChange(e.target.value)} />
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

// ---------- Section title ----------
function SectionTitle({ children, right }) {
  return <div className="oz-section-title"><h2>{children}</h2>{right}</div>;
}
function Empty({ icon = "receipt", label }) {
  return <div className="oz-empty"><Icon name={icon} size={28} style={{ color: "var(--muted)" }} /><span>{label}</span></div>;
}

// ---------- Product thumb ----------
function ProductThumb({ p, size = 46 }) {
  return (
    <div className="ac-thumb" style={{ width: size, height: size, fontSize: size * 0.5,
      background: `radial-gradient(circle at 50% 38%, ${p.tone}33, rgba(0,0,0,.25) 72%)`, borderColor: p.tone + "44" }}>
      {p.emoji}
    </div>
  );
}

// ---------- Striped proof / id placeholder ----------
function FilePlaceholder({ filename = "upload.png", caption, height = 150, uploaded }) {
  return (
    <div className="oz-proof" style={{ height }}>
      <div className="oz-proof-stripes" />
      <div className="oz-proof-label">
        <Icon name={uploaded ? "image" : "upload"} size={22} style={{ color: uploaded ? "var(--primary)" : "var(--muted)" }} />
        <span className="mono">{filename}</span>
        {caption && <span className="mono dim">{caption}</span>}
      </div>
    </div>
  );
}

// ---------- Timeline ----------
function Timeline({ steps, current }) {
  const flowIdx = ORBITZ_FLOW.indexOf(current);
  return (
    <div className="oz-timeline">
      {steps.map((st, i) => {
        const idx = ORBITZ_FLOW.indexOf(st.status);
        const done = st.status === "cancelled" || (idx >= 0 && idx <= flowIdx);
        const isCurrent = st.status === current;
        const color = done ? (st.status === "cancelled" ? "var(--red)" : "var(--green)") : "var(--muted)";
        const cur = isCurrent ? ORBITZ_STATUS[current].color : color;
        return (
          <div className="oz-tl-step" key={i}>
            <div className="oz-tl-rail">
              <div className="oz-tl-node" style={{ borderColor: cur,
                background: done || isCurrent ? cur + "26" : "transparent",
                boxShadow: isCurrent ? `0 0 12px ${cur}` : "none" }}>
                {done && st.status !== "cancelled" && <Icon name="check" size={12} style={{ color: cur }} />}
                {st.status === "cancelled" && <Icon name="x" size={12} style={{ color: cur }} />}
                {isCurrent && st.status !== "cancelled" && !done && <span style={{ width: 7, height: 7, borderRadius: "50%", background: cur }} />}
              </div>
              {i < steps.length - 1 && <div className="oz-tl-line" style={{ background: done ? "var(--green)" : "var(--line-2)" }} />}
            </div>
            <div className="oz-tl-body">
              <span className="oz-tl-label" style={{ color: isCurrent ? "#fff" : (done ? "var(--text)" : "var(--muted)") }}>{st.label}</span>
              {st.time && <span className="oz-tl-time">{st.time}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ───────────── Mobile shell ─────────────
function StatusBar() {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).replace(/\s?[AP]M/, ""));
  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).replace(/\s?[AP]M/, "")), 20000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="ac-statusbar">
      <span className="ac-sb-time">{time}</span>
      <span className="ac-sb-icons">
        <Icon name="signal" size={15} stroke={2.4} />
        <Icon name="wifi" size={15} stroke={2.2} />
        <Icon name="battery" size={17} stroke={2} fill="currentColor" style={{ opacity: .85 }} />
      </span>
    </div>
  );
}

function AppHeader({ eyebrow, title, onBack, action, onAction, actionDot, leading }) {
  return (
    <div className="ac-header">
      {onBack && <button className="ac-back" onClick={onBack} aria-label="Back"><Icon name="chevL" size={20} /></button>}
      {leading}
      <div className="ac-header-titles">
        {eyebrow && <span className="ac-header-eyebrow">{eyebrow}</span>}
        <span className="ac-header-title">{title}</span>
      </div>
      {action && (
        <button className="ac-header-action" onClick={onAction} aria-label={action}>
          <Icon name={action} size={19} />
          {actionDot && <span className="ac-action-dot" />}
        </button>
      )}
    </div>
  );
}

const TABS = [
  { id: "home",    label: "Home",    icon: "home" },
  { id: "orders",  label: "Orders",  icon: "receipt" },
  { id: "rewards", label: "Rewards", icon: "star" },
  { id: "profile", label: "Account", icon: "user" },
];
function BottomNav({ active, go, ordersBadge }) {
  return (
    <nav className="ac-bottomnav">
      {TABS.map(t => {
        const on = active === t.id;
        return (
          <button key={t.id} className={"ac-tab" + (on ? " active" : "")} onClick={() => go(t.id)}>
            {on && <span className="ac-tab-ind" />}
            <Icon name={t.icon} size={22} fill={on ? "currentColor" : "none"} stroke={on ? 1.6 : 2} />
            <span>{t.label}</span>
            {t.id === "orders" && ordersBadge > 0 && <span className="ac-tab-badge">{ordersBadge}</span>}
          </button>
        );
      })}
    </nav>
  );
}

// ---------- Toast ----------
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="ac-toast-wrap">
      <div className="ac-toast">
        <span className="ac-toast-ic" style={toast.tone ? { background: toast.tone + "2e", color: toast.tone } : null}>
          <Icon name={toast.icon || "check"} size={14} stroke={2.6} />
        </span>
        {toast.msg}
      </div>
    </div>
  );
}

// ---------- Bottom sheet ----------
function Sheet({ open, onClose, title, sub, children }) {
  useEffect(() => {
    if (!open) return;
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  return (
    <div className={"ac-sheet-overlay" + (open ? " open" : "")} onClick={onClose}>
      <div className="ac-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="ac-sheet-grip" />
        {title && <div className="ac-sheet-title">{title}</div>}
        {sub && <div className="ac-sheet-sub">{sub}</div>}
        {children}
      </div>
    </div>
  );
}

// ---------- Quick action ----------
function QuickAction({ icon, label, tone = "#b07cff", onClick }) {
  return (
    <button className="ac-quick-btn" onClick={onClick}>
      <span className="ac-quick-ic" style={{ background: tone + "1f", borderColor: tone + "44", color: tone }}>
        <Icon name={icon} size={19} />
      </span>
      <span className="ac-quick-lb">{label}</span>
    </button>
  );
}

Object.assign(window, {
  Icon, Card, Button, StatusBadge, Pill, StrainPill, Avatar, Field, Input, Toggle,
  SectionTitle, Empty, ProductThumb, FilePlaceholder, Timeline,
  StatusBar, AppHeader, BottomNav, TABS, Toast, Sheet, QuickAction,
});
