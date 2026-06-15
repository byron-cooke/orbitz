// ORBITZ Admin — shell (Logo, Sidebar, Topbar) + Login screen
const NAV = [
  { id: "overview",  label: "Overview",  icon: "grid" },
  { id: "orders",    label: "Orders",    icon: "receipt", badge: true },
  { id: "products",  label: "Products",  icon: "box" },
  { id: "customers", label: "Customers", icon: "users" },
  { id: "drivers",   label: "Drivers",   icon: "truck" },
  { id: "rewards",   label: "Rewards",   icon: "star" },
  { id: "settings",  label: "Settings",  icon: "gear" },
];

function Wordmark({ h = 24 }) {
  return (
    <div className="oz-wordmark">
      <img className="oz-wordmark-img" src="assets/logo_wordmark.png" alt="ORBITZ" style={{ height: h }} />
      <span className="oz-mark-admin">ADMIN</span>
    </div>
  );
}

function Sidebar({ route, navigate, open, setOpen }) {
  const pending = pendingCount();
  return (
    <>
      <div className={"oz-sidebar-scrim " + (open ? "show" : "")} onClick={() => setOpen(false)} />
      <aside className={"oz-sidebar " + (open ? "open" : "")}>
        <div className="oz-sidebar-top">
          <Wordmark />
        </div>
        <nav className="oz-nav">
          {NAV.map(n => {
            const active = route.screen === n.id || (n.id === "orders" && route.screen === "order");
            return (
              <button key={n.id} className={"oz-nav-item " + (active ? "active" : "")}
                onClick={() => { navigate(n.id); setOpen(false); }}>
                <Icon name={n.icon} size={18} />
                <span>{n.label}</span>
                {n.badge && pending > 0 && <span className="oz-nav-badge">{pending}</span>}
                {active && <span className="oz-nav-glow" />}
              </button>
            );
          })}
        </nav>
        <div className="oz-sidebar-foot">
          <div className="oz-admin-card">
            <Avatar name="Alex Rivera" size={34} tone="#6f5cff" />
            <div className="oz-admin-meta">
              <span className="oz-admin-name">Alex Rivera</span>
              <span className="oz-admin-role">Owner</span>
            </div>
            <button className="oz-icon-btn" title="Sign out" onClick={() => navigate("login")}>
              <Icon name="logout" size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function Topbar({ title, subtitle, setOpen, onSearch, searchValue }) {
  return (
    <header className="oz-topbar">
      <div className="oz-topbar-l">
        <button className="oz-icon-btn oz-burger" onClick={() => setOpen(true)}><Icon name="menu" size={20} /></button>
        <div>
          <h1 className="oz-page-title">{title}</h1>
          {subtitle && <p className="oz-page-sub">{subtitle}</p>}
        </div>
      </div>
      <div className="oz-topbar-r">
        {onSearch && (
          <div className="oz-topsearch">
            <Input icon="search" value={searchValue} onChange={onSearch} placeholder="Search orders, customers…" />
          </div>
        )}
        <button className="oz-icon-btn oz-bell">
          <Icon name="bell" size={18} />
          <span className="oz-bell-dot" />
        </button>
        <Avatar name="Alex Rivera" size={36} tone="#6f5cff" />
      </div>
    </header>
  );
}

// ---------- Login ----------
function Login({ navigate }) {
  const [email, setEmail] = useState("alex@orbitz.delivery");
  const [pw, setPw] = useState("••••••••••");
  const [loading, setLoading] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate("overview"); }, 700);
  };
  return (
    <div className="oz-login">
      <div className="oz-login-stars" />
      <div className="oz-login-orbit" />
      <div className="oz-login-card">
        <Wordmark h={30} />
        <h2 className="oz-login-h">Mission control</h2>
        <p className="oz-login-p">Sign in to the ORBITZ operations console.</p>
        <form onSubmit={submit} className="oz-login-form">
          <Field label="Email">
            <Input icon="mail" value={email} onChange={setEmail} placeholder="you@orbitz.delivery" />
          </Field>
          <Field label="Password">
            <Input icon="card" type="password" value={pw} onChange={setPw} placeholder="••••••••" />
          </Field>
          <div className="oz-login-row">
            <label className="oz-check"><input type="checkbox" defaultChecked /><span>Keep me signed in</span></label>
            <a className="oz-link">Forgot?</a>
          </div>
          <Button type="submit" size="lg" full icon={loading ? null : "logout"}>
            {loading ? "Authenticating…" : "Enter console"}
          </Button>
        </form>
        <p className="oz-login-foot">Protected by Supabase Auth · Admin access only</p>
      </div>
    </div>
  );
}

Object.assign(window, { Sidebar, Topbar, Login, Wordmark, NAV });
