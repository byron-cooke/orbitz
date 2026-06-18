// ORBITZ Shop — app root: state, persistence, filtering, routing
const LS_CART = "orbitz_cart";
const LS_FAVS = "orbitz_favorites";

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "thc-desc", label: "Highest THC" },
  { id: "rating-desc", label: "Top Rated" },
  { id: "name-asc", label: "Name A–Z" },
];

function loadJSON(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch (e) { return fallback; }
}

function emptyFilters() {
  return { maxPrice: PRICE_MAX, minThc: 0, strains: new Set(), brands: new Set() };
}

// ════════ Mobile search overlay ════════
function MobileSearch({ open, search, setSearch, onClose }) {
  const ref = React.useRef(null);
  useEffect(() => { if (open && ref.current) ref.current.focus(); }, [open]);
  if (!open) return null;
  return (
    <div className="modal-overlay" style={{ alignItems: "flex-start", padding: 0 }} onClick={onClose}>
      <div style={{ width: "100%", background: "rgba(12,11,20,.98)", borderBottom: "1px solid var(--line)", padding: "14px 16px",
        display: "flex", alignItems: "center", gap: 10 }} onClick={(e) => e.stopPropagation()}>
        <div className="snav-search" style={{ display: "flex", flex: 1, maxWidth: "none", margin: 0 }}>
          <Icon name="search" size={18} stroke={2.2} />
          <input ref={ref} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products & brands…" />
          {search && <button className="clear-x" onClick={() => setSearch("")}><Icon name="x" size={13} stroke={2.6} /></button>}
        </div>
        <button className="cart-close" onClick={onClose} style={{ margin: 0 }} aria-label="Close search"><Icon name="x" size={18} stroke={2.4} /></button>
      </div>
    </div>
  );
}

// ════════ Mobile filter sheet ════════
function MobileFilterSheet({ open, onClose, f, set, clearAll, activeCount, resultCount }) {
  return (
    <div className={"fsheet-overlay" + (open ? " open" : "")} onClick={onClose}>
      <div className="fsheet" onClick={(e) => e.stopPropagation()}>
        <div className="fsheet-grip" />
        <div className="fsheet-head">
          <h2>Filters</h2>
          {activeCount > 0 && <button className="fclear" onClick={clearAll}>Clear all ({activeCount})</button>}
        </div>
        <FilterControls f={f} set={set} clearAll={clearAll} activeCount={activeCount} />
        <button className="fsheet-apply" onClick={onClose}>Show {resultCount} {resultCount === 1 ? "product" : "products"}</button>
      </div>
    </div>
  );
}

function App() {
  const [cart, setCart] = useState(() => loadJSON(LS_CART, []));
  const [favs, setFavs] = useState(() => new Set(loadJSON(LS_FAVS, [])));
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [filters, setFilters] = useState(emptyFilters);
  const [cartOpen, setCartOpen] = useState(false);
  const [filterSheet, setFilterSheet] = useState(false);
  const [mobSearch, setMobSearch] = useState(false);
  const [modalId, setModalId] = useState(() => {
    const m = location.hash.match(/^#p\/(.+)$/); return m ? m[1] : null;
  });
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  // ----- persistence -----
  useEffect(() => { localStorage.setItem(LS_CART, JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem(LS_FAVS, JSON.stringify([...favs])); }, [favs]);

  // ----- modal <-> hash sync (deep-linkable + back button) -----
  useEffect(() => {
    const onHash = () => {
      const m = location.hash.match(/^#p\/(.+)$/);
      setModalId(m ? m[1] : null);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const openProduct = (p) => { location.hash = "p/" + p.id; setModalId(p.id); };
  const closeProduct = () => { if (location.hash) history.replaceState(null, "", location.pathname + location.search); setModalId(null); };

  const showToast = (opts) => {
    setToast(opts);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  // ----- cart ops -----
  const addToCart = (p, qty = 1) => {
    setCart(c => {
      const ex = c.find(l => l.id === p.id);
      if (ex) return c.map(l => l.id === p.id ? { ...l, qty: Math.min(99, l.qty + qty) } : l);
      return [...c, { id: p.id, qty }];
    });
    showToast({ msg: `${p.name} added to cart`, icon: "bag" });
  };
  const setQty = (id, qty) => {
    if (qty <= 0) return setCart(c => c.filter(l => l.id !== id));
    setCart(c => c.map(l => l.id === id ? { ...l, qty: Math.min(99, qty) } : l));
  };
  const removeItem = (id) => setCart(c => c.filter(l => l.id !== id));
  const cartCount = cart.reduce((s, l) => s + l.qty, 0);

  // ----- favorites -----
  const toggleFav = (id) => {
    setFavs(prev => {
      const next = new Set(prev);
      const adding = !next.has(id);
      adding ? next.add(id) : next.delete(id);
      showToast({ msg: adding ? `${productById(id).name} saved to favorites` : `Removed from favorites`, icon: "heart", kind: "fav" });
      return next;
    });
  };

  // ----- filtering + sorting -----
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = PRODUCTS.filter(p => {
      if (!inCategory(p, category)) return false;
      if (p.price > filters.maxPrice) return false;
      if (filters.minThc > 0 && (p.thc == null || p.thc < filters.minThc)) return false;
      if (filters.strains.size && !(p.strain && filters.strains.has(p.strain))) return false;
      if (filters.brands.size && !filters.brands.has(p.brand)) return false;
      if (q) {
        const hay = (p.name + " " + p.brand + " " + (p.strain || "") + " " + (p.effects || []).join(" ") + " " + p.category).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    const byThc = (p) => p.thc == null ? -1 : p.thc;
    list = [...list].sort((a, b) => {
      switch (sort) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "thc-desc": return byThc(b) - byThc(a);
        case "rating-desc": return b.rating - a.rating;
        case "name-asc": return a.name.localeCompare(b.name);
        default: return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.deal ? 1 : 0) - (a.deal ? 1 : 0);
      }
    });
    return list;
  }, [category, search, sort, filters]);

  const activeFilterCount = (filters.maxPrice < PRICE_MAX ? 1 : 0) + (filters.minThc > 0 ? 1 : 0) + filters.strains.size + filters.brands.size;
  const clearAll = () => setFilters(emptyFilters());

  const catLabel = CATEGORIES.find(c => c.id === category)?.label || "All";
  const modalProduct = modalId ? productById(modalId) : null;

  // reset scroll on category change
  useEffect(() => { window.scrollTo({ top: 0 }); }, [category]);

  return (
    <>
      <ShopNav search={search} setSearch={setSearch} cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)} onOpenMobileSearch={() => setMobSearch(true)} />
      <CategoryTabs active={category} setActive={setCategory} />

      <div className="shop-wrap">
        <FilterRail f={filters} set={setFilters} clearAll={clearAll} activeCount={activeFilterCount} />

        <main>
          <div className="catalog-bar">
            <div className="catalog-title">
              <h1>{category === "deals" ? "Deals" : catLabel}</h1>
              <p><b>{filtered.length}</b> {filtered.length === 1 ? "product" : "products"}{search ? <> for “{search}”</> : null}</p>
            </div>
            <div className="catalog-tools">
              <button className="mobile-filter-btn" onClick={() => setFilterSheet(true)}>
                <Icon name="sliders" size={17} />Filters{activeFilterCount > 0 ? ` · ${activeFilterCount}` : ""}
              </button>
              <div className="sortsel">
                <Icon name="filter" size={15} style={{ color: "var(--t3)" }} />
                <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
                  {SORTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
                <Icon name="chevD" size={15} style={{ color: "var(--t3)" }} />
              </div>
            </div>
          </div>

          <ActiveFilters f={filters} set={setFilters} clearAll={clearAll} />

          <ProductGrid products={filtered} favs={favs} onFav={toggleFav} onAdd={addToCart}
            onOpen={openProduct} onResetFilters={() => { clearAll(); setSearch(""); setCategory("all"); }} />
        </main>
      </div>

      {modalProduct && (
        <ProductModal p={modalProduct} fav={favs.has(modalProduct.id)} onFav={toggleFav}
          onAdd={addToCart} onClose={closeProduct} onOpen={openProduct} />
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart}
        setQty={setQty} remove={removeItem} onBrowse={() => setCartOpen(false)} />

      <MobileFilterSheet open={filterSheet} onClose={() => setFilterSheet(false)} f={filters} set={setFilters}
        clearAll={clearAll} activeCount={activeFilterCount} resultCount={filtered.length} />

      <MobileSearch open={mobSearch} search={search} setSearch={setSearch} onClose={() => setMobSearch(false)} />

      <ShopToast toast={toast} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
