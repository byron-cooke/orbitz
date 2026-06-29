// ORBITZ Account — app root + routing + shell
const { useState, useEffect, useRef } = React;

const ROOT_TABS = ["home", "orders", "rewards", "profile"];
const TAB_OF = { home: "home", orders: "orders", order: "orders", track: "orders",
  rewards: "rewards", profile: "profile", idverify: "profile", pay: "profile", favorites: "profile", support: "profile" };

const LS_AUTH = "orbitz_acct_authed";
const LS_ROUTE = "orbitz_acct_route";
const LS_RETURN_SHOP = "orbitz_return_to_shop";

// ---------- Support screen ----------
function Support({ toast }) {
  const opts = [
    { icon: "msg",   tone: "#b07cff", title: "Live chat",   sub: "Avg reply under 2 min",     act: "Opening live chat…" },
    { icon: "phone", tone: "#34d399", title: "Call us",     sub: "(202) 555-ORBZ · 9am–11pm",  act: "Calling ORBITZ support…" },
    { icon: "mail",  tone: "#5b8cff", title: "Email",       sub: "help@orbitz.delivery",       act: "Opening email…" },
  ];
  const faqs = [
    ["How long does delivery take?", "Most DMV drops land in 30–60 minutes depending on your zone."],
    ["What payment methods work?", "Zelle, Cash App, USDC, or cash on delivery — upload proof in the app."],
    ["Do I need ID?", "Yes — 21+ with a valid government ID, verified once in your account."],
  ];
  const [open, setOpen] = useState(0);
  return (
    <div className="ac-screen">
      <div className="ac-hero" style={{ textAlign: "center", padding: 20 }}>
        <div className="ac-hero-glow" />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 34 }}>🛰️</div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 19, fontWeight: 600, marginTop: 6 }}>How can we help?</div>
          <div style={{ fontSize: 13, color: "var(--text-2)", marginTop: 4 }}>The ORBITZ crew is standing by.</div>
        </div>
      </div>
      <Card pad={0}>
        {opts.map((o, i) => (
          <div key={o.title}>
            {i > 0 && <hr className="ac-divider" />}
            <button className="ac-row" style={{ padding: "14px 15px", width: "100%", background: "none", border: "none", cursor: "pointer", color: "var(--text)" }}
              onClick={() => toast({ msg: o.act, icon: o.icon, tone: o.tone })}>
              <span className="ac-quick-ic" style={{ width: 38, height: 38, background: o.tone + "22", borderColor: o.tone + "55", color: o.tone }}><Icon name={o.icon} size={18} /></span>
              <div className="ac-row-main"><span className="ac-row-title">{o.title}</span><span className="ac-row-sub">{o.sub}</span></div>
              <Icon name="chevR" size={18} style={{ color: "var(--muted)" }} />
            </button>
          </div>
        ))}
      </Card>
      <div>
        <SectionTitle>Common questions</SectionTitle>
        <Card pad={0} style={{ marginTop: 12 }}>
          {faqs.map(([q, a], i) => (
            <div key={i}>
              {i > 0 && <hr className="ac-divider" />}
              <button className="ac-row" style={{ padding: "14px 15px", width: "100%", background: "none", border: "none", cursor: "pointer", color: "var(--text)", alignItems: "flex-start" }} onClick={() => setOpen(open === i ? -1 : i)}>
                <div className="ac-row-main">
                  <span className="ac-row-title" style={{ whiteSpace: "normal" }}>{q}</span>
                  {open === i && <span style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 6, lineHeight: 1.5, whiteSpace: "normal" }}>{a}</span>}
                </div>
                <Icon name="chevD" size={17} style={{ color: "var(--muted)", transform: open === i ? "rotate(180deg)" : "none", transition: ".2s", marginTop: 2 }} />
              </button>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ---------- Notifications sheet content ----------
function Notifications({ go, close }) {
  const items = [
    { icon: "truck", tone: "#b07cff", title: "Your order is out for delivery", sub: "ORB-2061 · arriving soon", to: () => go("track", { id: "o1" }) },
    { icon: "star",  tone: "#f5b945", title: "You earned 119 points",          sub: "Order ORB-2049 · 2d ago",  to: () => go("rewards") },
    { icon: "gift",  tone: "#34d399", title: "New drop: Nebula Shatter",        sub: "Restocked · tap to view",  to: () => go("favorites") },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      {items.map((n, i) => (
        <button key={i} className="ac-row" style={{ padding: 13, borderRadius: 13, background: "rgba(0,0,0,.22)", border: "1px solid var(--line)", cursor: "pointer", color: "var(--text)", width: "100%", textAlign: "left" }}
          onClick={() => { close(); n.to(); }}>
          <span className="ac-quick-ic" style={{ width: 38, height: 38, background: n.tone + "22", borderColor: n.tone + "55", color: n.tone }}><Icon name={n.icon} size={18} /></span>
          <div className="ac-row-main"><span className="ac-row-title" style={{ whiteSpace: "normal" }}>{n.title}</span><span className="ac-row-sub">{n.sub}</span></div>
          <Icon name="chevR" size={17} style={{ color: "var(--muted)" }} />
        </button>
      ))}
    </div>
  );
}

// ---------- Tweaks ----------
const GLOWS = [["Subtle", .4], ["Default", .85], ["Vivid", 1.35]];
function Tweaks({ glow, setGlow, frame, setFrame, isDesktop }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(o => !o)} style={{ position: "fixed", right: 16, bottom: 16, zIndex: 210,
        display: "flex", alignItems: "center", gap: 7, padding: "9px 14px", borderRadius: 30, cursor: "pointer",
        background: "linear-gradient(180deg,#1a1626,#13101d)", border: "1px solid var(--line-2)", color: "var(--text)",
        fontWeight: 700, fontSize: 12.5, boxShadow: "0 14px 34px -12px rgba(0,0,0,.8)" }}>
        <Icon name="settings" size={15} style={{ color: "var(--primary)" }} /> Tweaks
      </button>
      {open && (
        <div className="ac-tweaks">
          <div className="ac-tweaks-head">
            <h4>Tweaks</h4>
            <button className="ac-back" style={{ width: 30, height: 30, borderRadius: 8 }} onClick={() => setOpen(false)}><Icon name="x" size={16} /></button>
          </div>
          <div className="ac-tweaks-body">
            <div className="ac-tw-row">
              <span className="ac-tw-label">Glow intensity</span>
              <div style={{ display: "flex", gap: 7 }}>
                {GLOWS.map(([lb, v]) => (
                  <button key={lb} className={"ac-chip" + (glow === v ? " on" : "")} style={{ flex: 1, justifyContent: "center" }} onClick={() => setGlow(v)}>{lb}</button>
                ))}
              </div>
            </div>
            {!isDesktop && (
              <div className="ac-tw-row">
                <span className="ac-tw-label">Mobile bezel</span>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "var(--text-2)" }}>Show phone frame</span>
                  <Toggle on={frame} onChange={setFrame} />
                </div>
              </div>
            )}
            <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.5 }}>Visual tweaks only — your data and screens stay the same.</div>
          </div>
        </div>
      )}
    </>
  );
}

// ---------- desktop nav + meta ----------
const NAV_PRIMARY = [
  { id: "home",    label: "Home",       icon: "home" },
  { id: "orders",  label: "My Orders",  icon: "receipt", badge: true },
  { id: "track",   label: "Track",      icon: "truck" },
  { id: "rewards", label: "Rewards",    icon: "star" },
  { id: "favorites", label: "Favorites", icon: "heart" },
];
const NAV_ACCOUNT = [
  { id: "profile",  label: "Profile",         icon: "user" },
  { id: "pay",      label: "Payments",        icon: "card" },
  { id: "idverify", label: "ID Verification", icon: "shield" },
  { id: "support",  label: "Support",         icon: "msg" },
];
const NAV_ACTIVE = { home: "home", orders: "orders", order: "orders", track: "track", rewards: "rewards",
  favorites: "favorites", profile: "profile", pay: "pay", idverify: "idverify", support: "support" };

function deskMeta(route) {
  const s = route.screen;
  if (s === "home")    return [greeting(), `Welcome back, ${ME.firstName}`, "Here's everything in orbit right now"];
  if (s === "orders")  return ["Orders", "My Orders", "Track, reorder, and review every delivery"];
  if (s === "order")   { const o = orderById(route.params.id); return ["Order", o ? o.number : "Order", o ? fmtDateTime(o.createdAt) : ""]; }
  if (s === "track")   { const o = orderById(route.params?.id) || activeOrder(); return ["Live", "Track Delivery", o ? o.number : ""]; }
  if (s === "rewards") return ["Rewards", "ORBITZ Rewards", "Points, tiers, and redemptions"];
  if (s === "favorites") return ["Saved", "Favorites", "Your go-to products, one tap away"];
  if (s === "profile") return ["Account", "Profile & Address", "Manage your contact and delivery details"];
  if (s === "pay")     return ["Account", "Payments", "Methods, instructions, and history"];
  if (s === "idverify")return ["Account", "ID Verification", "Your 21+ verification status"];
  if (s === "support") return ["Help", "Support", "We're here to help, on any orbit"];
  return ["", "", ""];
}

// ---------- App ----------
function App() {
  const [authed, setAuthed] = useState(() => localStorage.getItem(LS_AUTH) === "1");
  const [history, setHistory] = useState(() => {
    try { const s = JSON.parse(localStorage.getItem(LS_ROUTE)); if (Array.isArray(s) && s.length) return s; } catch (e) {}
    return [{ screen: "home", params: {} }];
  });
  const [toast, setToastState] = useState(null);
  const [sheet, setSheet] = useState(null);
  const [cart, setCart] = useState(0);
  const [glow, setGlow] = useState(.85);
  const [frame, setFrame] = useState(true);
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia("(min-width:900px)").matches);
  const toastTimer = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width:900px)");
    const h = (e) => setIsDesktop(e.matches);
    mq.addEventListener ? mq.addEventListener("change", h) : mq.addListener(h);
    return () => { mq.removeEventListener ? mq.removeEventListener("change", h) : mq.removeListener(h); };
  }, []);

  const route = history[history.length - 1];

  useEffect(() => { localStorage.setItem(LS_AUTH, authed ? "1" : "0"); }, [authed]);
  useEffect(() => { localStorage.setItem(LS_ROUTE, JSON.stringify(history)); }, [history]);
  useEffect(() => { document.documentElement.style.setProperty("--glow", glow); }, [glow]);
  useEffect(() => { if (contentRef.current) contentRef.current.scrollTop = 0; }, [history.length, route.screen]);

  const showToast = (opts) => {
    setToastState(opts);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastState(null), 2400);
  };

  const go = (screen, params = {}) => {
    if (ROOT_TABS.includes(screen)) {
      setHistory([{ screen, params }]);
    } else {
      setHistory(h => [...h, { screen, params }]);
    }
  };
  const back = () => setHistory(h => h.length > 1 ? h.slice(0, -1) : h);
  const navReset = (screen) => setHistory([{ screen, params: {} }]);

  const reorder = (items, singleName, orderNumber) => {
    const count = items.reduce((s, [, q]) => s + q, 0);
    setCart(c => c + count);
    const msg = singleName ? `${singleName} added to cart`
      : orderNumber ? `Reordered ${orderNumber} · ${count} items`
      : `${count} items added to cart`;
    showToast({ msg, icon: "bag", tone: "#34d399" });
  };

  const openSheet = (s) => setSheet(s);
  const closeSheet = () => setSheet(null);

  const signOut = () => { setAuthed(false); setHistory([{ screen: "home", params: {} }]); };

  if (!authed) {
    const onAuth = () => {
      setAuthed(true);
      // If user came from the shop, send them back there
      if (localStorage.getItem(LS_RETURN_SHOP) === "1") {
        localStorage.removeItem(LS_RETURN_SHOP);
        window.location.href = "../shop/index.html";
        return;
      }
      setHistory([{ screen: "home", params: {} }]);
    };
    if (isDesktop) {
      return (
        <div className="ac-auth-root">
          <div className="ac-stage-stars" />
          <div className="ac-auth-card"><Login onAuth={onAuth} /></div>
          <Tweaks glow={glow} setGlow={setGlow} frame={frame} setFrame={setFrame} isDesktop={isDesktop} />
        </div>
      );
    }
    return (
      <div className="ac-stage">
        <div className="ac-stage-stars" />
        <div className="ac-phone" style={frame ? null : { border: "none", borderRadius: 0, boxShadow: "none", width: "100vw", height: "100dvh" }}>
          <div className="ac-app">
            <StatusBar />
            <Login onAuth={onAuth} />
          </div>
        </div>
        <Tweaks glow={glow} setGlow={setGlow} frame={frame} setFrame={setFrame} isDesktop={isDesktop} />
      </div>
    );
  }

  const activeTab = TAB_OF[route.screen] || "home";
  const ord = route.screen === "order" ? orderById(route.params.id) : null;

  // ----- header -----
  let header;
  if (route.screen === "home") {
    header = (
      <AppHeader eyebrow={greeting()} title={ME.firstName}
        leading={<button onClick={() => go("profile")} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", marginRight: 2 }} aria-label="Account"><Avatar name={ME.name} size={40} tone={ME.avatarTone} /></button>}
        action="bell" actionDot onAction={() => openSheet({ title: "Notifications", content: <Notifications go={go} close={closeSheet} /> })} />
    );
  } else if (route.screen === "orders") {
    header = <AppHeader title="My Orders" />;
  } else if (route.screen === "order") {
    header = <AppHeader onBack={back} eyebrow="Order" title={ord ? ord.number : "Order"} />;
  } else if (route.screen === "track") {
    header = <AppHeader onBack={back} eyebrow="Live" title="Track Delivery" />;
  } else if (route.screen === "rewards") {
    header = <AppHeader title="Rewards" />;
  } else if (route.screen === "profile") {
    header = <AppHeader title="Account" action="msg" onAction={() => go("support")} />;
  } else {
    const meta = { idverify: ["Account", "ID Verification"], pay: ["Account", "Payments"], favorites: ["Saved", "Favorites"], support: ["Help", "Support"] }[route.screen] || [null, ""];
    header = <AppHeader onBack={back} eyebrow={meta[0]} title={meta[1]} />;
  }

  // ----- body -----
  let body;
  switch (route.screen) {
    case "home":      body = <Home go={go} toast={showToast} reorder={reorder} />; break;
    case "orders":    body = <OrdersList go={go} />; break;
    case "order":     body = <OrderDetail params={route.params} go={go} toast={showToast} reorder={reorder} />; break;
    case "track":     body = <TrackDelivery params={route.params} go={go} toast={showToast} />; break;
    case "profile":   body = <Profile go={go} toast={showToast} onSignOut={signOut} />; break;
    case "idverify":  body = <IDVerification go={go} toast={showToast} />; break;
    case "pay":       body = <Payments go={go} toast={showToast} />; break;
    case "rewards":   body = <Rewards go={go} toast={showToast} />; break;
    case "favorites": body = <Favorites go={go} toast={showToast} reorder={reorder} />; break;
    case "support":   body = <Support toast={showToast} />; break;
    default:          body = <Home go={go} toast={showToast} reorder={reorder} />;
  }

  const ordersBadge = MY_ORDERS.filter(o => ["confirmed","payment_verified","packed","out_for_delivery"].includes(o.status)).length;

  if (isDesktop) {
    const [eyebrow, title, sub] = deskMeta(route);
    const navActive = NAV_ACTIVE[route.screen] || "home";
    const SideItem = ({ n }) => (
      <button className={"ac-side-item" + (navActive === n.id ? " active" : "")} onClick={() => navReset(n.id)}>
        <Icon name={n.icon} size={18} />
        <span>{n.label}</span>
        {n.badge && ordersBadge > 0 && <span className="ac-side-badge">{ordersBadge}</span>}
      </button>
    );
    return (
      <div className="ac-desk-root ac-desk">
        <div className="ac-stage-stars" />
        <aside className="ac-side">
          <div className="ac-side-top">
            <img src="assets/logo_wordmark.png" alt="ORBITZ" style={{ height: 24, filter: "drop-shadow(0 2px 10px rgba(176,124,255,.35))" }} />
            <span className="ac-side-tag">ACCOUNT</span>
          </div>
          <div className="ac-side-nav">
            {NAV_PRIMARY.map(n => <SideItem key={n.id} n={n} />)}
            <div className="ac-side-sec">Account</div>
            {NAV_ACCOUNT.map(n => <SideItem key={n.id} n={n} />)}
            <div className="ac-side-sec">Browse</div>
            <a href="../shop/index.html" className="ac-side-item" style={{ textDecoration: "none" }}>
              <Icon name="bag" size={18} />
              <span>Shop</span>
            </a>
          </div>
          <div className="ac-side-foot">
            <div className="ac-side-user">
              <Avatar name={ME.name} size={36} tone={ME.avatarTone} />
              <div className="nm"><b>{ME.name}</b><span>{ME.tier} · {ME.points.toLocaleString()} pts</span></div>
              <button className="ac-back" style={{ width: 32, height: 32, borderRadius: 9 }} onClick={signOut} title="Sign out"><Icon name="logout" size={16} /></button>
            </div>
          </div>
        </aside>
        <div className="ac-desk-main">
          <header className="ac-desk-top">
            {history.length > 1 && <button className="ac-back" onClick={back} aria-label="Back"><Icon name="chevL" size={20} /></button>}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="ac-desk-eyebrow">{eyebrow}</div>
              <div className="ac-desk-title">{title}</div>
              {sub && <div className="ac-desk-sub">{sub}</div>}
            </div>
            <button className="ac-header-action" onClick={() => openSheet({ title: "Notifications", content: <Notifications go={go} close={closeSheet} /> })} aria-label="Notifications">
              <Icon name="bell" size={19} /><span className="ac-action-dot" />
            </button>
            <button className="ac-desk-avatar-btn" onClick={() => navReset("profile")} aria-label="Account"><Avatar name={ME.name} size={38} tone={ME.avatarTone} /></button>
          </header>
          <div className="ac-desk-content" ref={contentRef}>{body}</div>
          <Toast toast={toast} />
          <Sheet open={!!sheet} onClose={closeSheet} title={sheet?.title} sub={sheet?.sub}>{sheet?.content}</Sheet>
        </div>
        <Tweaks glow={glow} setGlow={setGlow} frame={frame} setFrame={setFrame} isDesktop={isDesktop} />
      </div>
    );
  }

  // Mobile — add Shop tab to bottom nav via BottomNav wrapper
  return (
    <div className="ac-stage">
      <div className="ac-stage-stars" />
      <div className="ac-phone" style={frame ? null : { border: "none", borderRadius: 0, boxShadow: "none", width: "100vw", height: "100dvh" }}>
        <div className="ac-app">
          <StatusBar />
          {header}
          <div className="ac-content has-nav" ref={contentRef}>{body}</div>
          <BottomNavWithShop active={activeTab} go={go} ordersBadge={ordersBadge} />
          <Toast toast={toast} />
          <Sheet open={!!sheet} onClose={closeSheet} title={sheet?.title} sub={sheet?.sub}>{sheet?.content}</Sheet>
        </div>
      </div>
      <Tweaks glow={glow} setGlow={setGlow} frame={frame} setFrame={setFrame} isDesktop={isDesktop} />
    </div>
  );
}

// Mobile bottom nav with Shop link appended
function BottomNavWithShop({ active, go, ordersBadge }) {
  const tabs = [
    { id: "home",    label: "Home",    icon: "home" },
    { id: "orders",  label: "Orders",  icon: "receipt", badge: ordersBadge > 0 ? ordersBadge : null },
    { id: "rewards", label: "Rewards", icon: "star" },
    { id: "profile", label: "Account", icon: "user" },
  ];
  return (
    <nav className="ac-bottomnav">
      {tabs.map(t => (
        <button key={t.id} className={"ac-tab" + (active === t.id ? " active" : "")} onClick={() => go(t.id)}>
          {active === t.id && <span className="ac-tab-ind" />}
          <Icon name={t.icon} size={22} />
          <span>{t.label}</span>
          {t.badge && <span className="ac-tab-badge">{t.badge}</span>}
        </button>
      ))}
      <a href="../shop/index.html" className="ac-tab" style={{ textDecoration: "none", color: "var(--muted)" }}>
        <Icon name="bag" size={22} />
        <span>Shop</span>
      </a>
    </nav>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
