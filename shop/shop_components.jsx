// ORBITZ Shop — shell components: nav, tabs, filters, card, grid

// ════════ TOP NAV ════════
function ShopNav({ search, setSearch, cartCount, onOpenCart, onOpenMobileSearch }) {
  const authed = typeof orbitzAuth !== "undefined" && orbitzAuth.authed();

  const handleSignIn = (e) => {
    e.preventDefault();
    localStorage.setItem("orbitz_return_to_shop", "1");
    window.location.href = "../account/index.html";
  };

  return (
    <nav className="snav">
      <a className="snav-brand" href="../index.html" title="Back to Orbitz">
        <img src="assets/logo_wordmark.png" alt="ORBITZ" />
        <span className="snav-tag">SHOP</span>
      </a>

      <div className="snav-search">
        <Icon name="search" size={18} stroke={2.2} />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search flower, vapes, brands…" aria-label="Search products" />
        {search && <button className="clear-x" onClick={() => setSearch("")} aria-label="Clear search"><Icon name="x" size={13} stroke={2.6} /></button>}
      </div>

      <div className="snav-right">
        <button className="snav-iconbtn snav-mobsearch" onClick={onOpenMobileSearch} aria-label="Search"><Icon name="search" size={19} /></button>
        {authed ? (
          <a className="snav-acct" href="../account/index.html" title="My account">
            <span className="snav-av">KM</span>
            <span className="acct-label">Account</span>
          </a>
        ) : (
          <a className="snav-acct" href="../account/index.html" title="Sign in" onClick={handleSignIn}>
            <span className="snav-av"><Icon name="user" size={15} stroke={2} /></span>
            <span className="acct-label">Sign in</span>
          </a>
        )}
        <button className="snav-iconbtn" onClick={onOpenCart} aria-label="Open cart">
          <Icon name="bag" size={19} />
          {cartCount > 0 && <span className="snav-cartcount">{cartCount}</span>}
        </button>
      </div>
    </nav>
  );
}

// ════════ CATEGORY TABS (sub-nav) ════════
function CategoryTabs({ active, setActive }) {
  return (
    <div className="subnav">
      <div className="subnav-inner">
        {CATEGORIES.map(c => {
          const on = active === c.id;
          return (
            <button key={c.id} className={"cat-tab" + (on ? " on" : "") + (c.id === "deals" ? " deals" : "")}
              onClick={() => setActive(c.id)}>
              <span className="cat-ic"><Icon name={c.icon} size={16} stroke={2} /></span>
              {c.label}
              <span className="cat-count">{categoryCount(c.id)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ════════ FILTER CONTROLS (shared by rail + mobile sheet) ════════
function FilterControls({ f, set, clearAll, activeCount }) {
  const toggleSet = (key, val) => {
    const next = new Set(f[key]);
    next.has(val) ? next.delete(val) : next.add(val);
    set({ ...f, [key]: next });
  };
  return (
    <>
      <div className="fgroup">
        <div className="fgroup-title">Price · up to {fmtMoney0(f.maxPrice)}</div>
        <div className="frange">
          <input type="range" min={PRICE_MIN} max={PRICE_MAX} step="1" value={f.maxPrice}
            onChange={(e) => set({ ...f, maxPrice: +e.target.value })} aria-label="Max price" />
          <div className="frange-vals"><span>{fmtMoney0(PRICE_MIN)}</span><b>{fmtMoney0(f.maxPrice)}</b></div>
        </div>
      </div>

      <div className="fgroup">
        <div className="fgroup-title">Min THC · {f.minThc}%+</div>
        <div className="frange">
          <input type="range" min="0" max="90" step="1" value={f.minThc}
            onChange={(e) => set({ ...f, minThc: +e.target.value })} aria-label="Minimum THC" />
          <div className="frange-vals"><span>Any</span><b>{f.minThc}%</b></div>
        </div>
      </div>

      <div className="fgroup">
        <div className="fgroup-title">Strain</div>
        <div className="fchip-row">
          {STRAINS.map(s => (
            <button key={s.id} data-strain={s.id}
              className={"fchip" + (f.strains.has(s.id) ? " on" : "")}
              onClick={() => toggleSet("strains", s.id)}>{s.label}</button>
          ))}
        </div>
      </div>

      <div className="fgroup">
        <div className="fgroup-title">Brand</div>
        <div className="fchecks">
          {BRANDS.map(b => {
            const on = f.brands.has(b);
            return (
              <button key={b} className={"fcheck" + (on ? " on" : "")} onClick={() => toggleSet("brands", b)}>
                <span className="fcheck-box">{on && <Icon name="check" size={12} stroke={3} style={{ color: "#fff" }} />}</span>
                {b}
                <span className="fcheck-count">{brandCount(b)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ════════ DESKTOP FILTER RAIL ════════
function FilterRail({ f, set, clearAll, activeCount }) {
  return (
    <aside className="frail">
      <div className="fcard">
        <div className="fcard-head">
          <h3>Filters</h3>
          {activeCount > 0 && <button className="fclear" onClick={clearAll}>Clear ({activeCount})</button>}
        </div>
        <FilterControls f={f} set={set} clearAll={clearAll} activeCount={activeCount} />
      </div>
    </aside>
  );
}

// ════════ ACTIVE FILTER CHIPS ════════
function ActiveFilters({ f, set, clearAll }) {
  const chips = [];
  if (f.maxPrice < PRICE_MAX) chips.push({ k: "price", label: `Under ${fmtMoney0(f.maxPrice)}`, clear: () => set({ ...f, maxPrice: PRICE_MAX }) });
  if (f.minThc > 0) chips.push({ k: "thc", label: `THC ${f.minThc}%+`, clear: () => set({ ...f, minThc: 0 }) });
  f.strains.forEach(s => chips.push({ k: "s" + s, label: s === "cbd" ? "CBD" : s[0].toUpperCase() + s.slice(1), clear: () => { const n = new Set(f.strains); n.delete(s); set({ ...f, strains: n }); } }));
  f.brands.forEach(b => chips.push({ k: "b" + b, label: b, clear: () => { const n = new Set(f.brands); n.delete(b); set({ ...f, brands: n }); } }));
  if (!chips.length) return null;
  return (
    <div className="active-filters">
      {chips.map(c => (
        <span key={c.k} className="af-chip">{c.label}<button onClick={c.clear} aria-label={"Remove " + c.label}><Icon name="x" size={11} stroke={3} /></button></span>
      ))}
      <button className="af-chip" style={{ background: "rgba(255,255,255,.05)", borderColor: "var(--line-2)", color: "var(--t2)" }} onClick={clearAll}>Clear all</button>
    </div>
  );
}

// ════════ PRODUCT CARD ════════
function ProductCard({ p, fav, onFav, onAdd, onOpen }) {
  const [added, setAdded] = useState(false);
  const add = (e) => {
    e.stopPropagation();
    onAdd(p, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1100);
  };
  const isGear = p.category === "accessory";
  return (
    <article className="scard">
      <div className="scard-imgwrap" onClick={() => onOpen(p)}>
        <ProductShot tone={p.tone} category={p.category} />
        {p.deal ? <span className="scard-deal">Deal</span> : <StrainBadge strain={p.strain} />}
        <button className={"scard-fav" + (fav ? " on" : "")} onClick={(e) => { e.stopPropagation(); onFav(p.id); }}
          aria-label={fav ? "Remove favorite" : "Add favorite"} aria-pressed={fav}>
          <Icon name="heart" size={17} fill={fav ? "currentColor" : "none"} stroke={2} />
        </button>
      </div>
      <div className="scard-body">
        <div className="scard-brand">{p.brand}</div>
        <div className="scard-name" onClick={() => onOpen(p)}>{p.name}</div>
        <div className="scard-meta">
          {!isGear && (
            <span className="potchip" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Icon name="star" size={11} fill="var(--gold)" stroke={0} style={{ color: "var(--gold)" }} /><b>{p.rating}</b>
            </span>
          )}
          <PotChips p={p} />
        </div>
        <div className="scard-foot">
          <div className="scard-price">
            <span className="now">{fmtMoney0(p.price)}</span>
            {p.origPrice && <span className="was">{fmtMoney0(p.origPrice)}</span>}
            {!isGear && <span className="scard-size">{p.size}</span>}
          </div>
          <button className={"btn-add" + (added ? " added" : "")} onClick={add} aria-label={"Add " + p.name + " to cart"}>
            {added ? <><Icon name="check" size={16} stroke={3} />Added</> : <><Icon name="plus" size={16} stroke={2.6} />Add</>}
          </button>
        </div>
      </div>
    </article>
  );
}

// ════════ PRODUCT GRID ════════
function ProductGrid({ products, favs, onFav, onAdd, onOpen, onResetFilters }) {
  if (!products.length) {
    return (
      <div className="pgrid">
        <div className="shop-empty">
          <div className="shop-empty-ring"><Icon name="search" size={30} /></div>
          <h3>No products in this orbit</h3>
          <p>Nothing matches your current filters. Try widening your search or clearing a few filters.</p>
          <button className="mobile-filter-btn" style={{ display: "inline-flex" }} onClick={onResetFilters}>Clear filters</button>
        </div>
      </div>
    );
  }
  return (
    <div className="pgrid">
      {products.map(p => (
        <ProductCard key={p.id} p={p} fav={favs.has(p.id)} onFav={onFav} onAdd={onAdd} onOpen={onOpen} />
      ))}
    </div>
  );
}

// ════════ TOAST ════════
function ShopToast({ toast }) {
  if (!toast) return null;
  return (
    <div className="shop-toast-wrap">
      <div className="shop-toast">
        <span className={"shop-toast-ic" + (toast.kind === "fav" ? " fav" : "")}>
          <Icon name={toast.icon || "check"} size={15} stroke={2.6} fill={toast.kind === "fav" ? "currentColor" : "none"} />
        </span>
        {toast.msg}
      </div>
    </div>
  );
}

Object.assign(window, {
  ShopNav, CategoryTabs, FilterControls, FilterRail, ActiveFilters,
  ProductCard, ProductGrid, ShopToast,
});
