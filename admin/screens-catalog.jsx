// ORBITZ Admin — Products + Customers + Customer detail
const CATS = ["flower", "vape", "edible", "concentrate", "preroll"];
const STRAINS = ["indica", "sativa", "hybrid"];
const STRAIN_TONE = { indica: "#b07cff", sativa: "#34d399", hybrid: "#5b8cff" };

// ---------- Products ----------
function ProductForm({ draft, set }) {
  return (
    <div className="oz-form">
      <Field label="Product name"><Input value={draft.name} onChange={v => set({ name: v })} placeholder="e.g. Galaxy Haze" /></Field>
      <div className="oz-form-2">
        <Field label="Category"><Select value={draft.category} onChange={v => set({ category: v })} options={CATS.map(c => ({ value: c, label: c[0].toUpperCase() + c.slice(1) }))} /></Field>
        <Field label="Strain type"><Select value={draft.strain} onChange={v => set({ strain: v })} options={STRAINS.map(s => ({ value: s, label: s[0].toUpperCase() + s.slice(1) }))} /></Field>
      </div>
      <div className="oz-form-3">
        <Field label="THC %"><Input type="number" value={draft.thc} onChange={v => set({ thc: v })} /></Field>
        <Field label="CBD %"><Input type="number" value={draft.cbd} onChange={v => set({ cbd: v })} /></Field>
        <Field label="Price ($)"><Input type="number" value={draft.price} onChange={v => set({ price: v })} /></Field>
      </div>
      <div className="oz-form-2">
        <Field label="Inventory count"><Input type="number" value={draft.inv} onChange={v => set({ inv: v })} /></Field>
        <Field label="Product image">
          <div className="oz-img-drop"><Icon name="image" size={16} style={{ color: "var(--muted)" }} /><span className="mono dim">drop image · 1:1</span></div>
        </Field>
      </div>
      <div className="oz-form-toggle">
        <div><span className="oz-field-label">Active</span><span className="oz-field-hint">Visible in the customer storefront</span></div>
        <Toggle on={draft.active} onChange={v => set({ active: v })} />
      </div>
    </div>
  );
}

function Products({ refresh }) {
  const [editing, setEditing] = useState(null);   // product or {} for new
  const [draft, setDraft] = useState(null);
  const [delTarget, setDelTarget] = useState(null);
  const [cat, setCat] = useState("all");

  const open = (p) => { const base = p || { name: "", category: "flower", strain: "hybrid", thc: 20, cbd: 0, price: 40, inv: 0, active: true, tone: "#b07cff", emoji: "🌿" }; setEditing(p || "new"); setDraft({ ...base }); };
  const save = () => {
    if (editing === "new") {
      PRODUCTS.unshift({ ...draft, id: "p" + Date.now(), thc: +draft.thc, cbd: +draft.cbd, price: +draft.price, inv: +draft.inv, tone: STRAIN_TONE[draft.strain] });
    } else {
      Object.assign(editing, { ...draft, thc: +draft.thc, cbd: +draft.cbd, price: +draft.price, inv: +draft.inv });
    }
    setEditing(null); refresh();
  };
  const remove = () => { const i = PRODUCTS.indexOf(delTarget); if (i >= 0) PRODUCTS.splice(i, 1); setDelTarget(null); refresh(); };
  const toggleActive = (p) => { p.active = !p.active; refresh(); };

  const rows = cat === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === cat);

  return (
    <div className="oz-screen">
      <div className="oz-toolbar">
        <div className="oz-tabs">
          <button className={"oz-tab " + (cat === "all" ? "active" : "")} onClick={() => setCat("all")}>All<span className="oz-tab-count">{PRODUCTS.length}</span></button>
          {CATS.map(cv => <button key={cv} className={"oz-tab " + (cat === cv ? "active" : "")} onClick={() => setCat(cv)}>{cv[0].toUpperCase() + cv.slice(1)}<span className="oz-tab-count">{PRODUCTS.filter(p => p.category === cv).length}</span></button>)}
        </div>
        <Button icon="plus" onClick={() => open(null)}>Add product</Button>
      </div>

      <div className="oz-prod-grid">
        {rows.map(p => (
          <Card key={p.id} pad={0} className="oz-prod-card">
            <div className="oz-prod-media" style={{ background: `radial-gradient(circle at 35% 30%, ${p.tone}55, ${p.tone}08 60%, transparent)` }}>
              <span className="oz-prod-emoji">{p.emoji}</span>
              <span className="oz-prod-strain" style={{ color: STRAIN_TONE[p.strain], borderColor: STRAIN_TONE[p.strain] + "55", background: STRAIN_TONE[p.strain] + "1c" }}>{p.strain}</span>
              {!p.active && <span className="oz-prod-inactive">Inactive</span>}
            </div>
            <div className="oz-prod-body">
              <div className="oz-prod-row1">
                <span className="oz-prod-name">{p.name}</span>
                <span className="oz-prod-price mono">{fmtMoney0(p.price)}</span>
              </div>
              <div className="oz-prod-specs">
                <span>{p.category}</span><span className="oz-sep">·</span>
                <span>{p.thc}% THC</span><span className="oz-sep">·</span>
                <span>{p.cbd}% CBD</span>
              </div>
              <div className="oz-prod-foot">
                <span className="oz-stock-pill" style={{ color: p.inv === 0 ? "#f87171" : p.inv <= 10 ? "#f5b945" : "#9aa6c4" }}>
                  <Icon name="box" size={13} /> {p.inv} in stock
                </span>
                <div className="oz-prod-actions">
                  <Toggle on={p.active} onChange={() => toggleActive(p)} />
                  <button className="oz-icon-btn" onClick={() => open(p)}><Icon name="edit" size={15} /></button>
                  <button className="oz-icon-btn oz-danger" onClick={() => setDelTarget(p)}><Icon name="trash" size={15} /></button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing === "new" ? "Add product" : "Edit product"} width={520}
        footer={<><Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button><Button icon="check" onClick={save}>{editing === "new" ? "Create product" : "Save changes"}</Button></>}>
        {draft && <ProductForm draft={draft} set={(p) => setDraft(d => ({ ...d, ...p }))} />}
      </Modal>

      <Modal open={!!delTarget} onClose={() => setDelTarget(null)} title="Delete product?"
        footer={<><Button variant="ghost" onClick={() => setDelTarget(null)}>Keep</Button><Button variant="danger" onClick={remove}>Delete</Button></>}>
        <p className="oz-confirm-text">Remove <strong>{delTarget?.name}</strong> from the catalog? This hides it from the storefront and admin lists.</p>
      </Modal>
    </div>
  );
}

// ---------- Customers ----------
function Customers({ navigate }) {
  const [q, setQ] = useState("");
  const rows = CUSTOMERS.filter(c => !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.phone.includes(q) || c.email.toLowerCase().includes(q.toLowerCase()));
  const orderCount = (id) => ORDERS.filter(o => o.customerId === id).length;
  const spent = (id) => ORDERS.filter(o => o.customerId === id && o.status !== "cancelled").reduce((s, o) => s + o.total, 0);

  return (
    <div className="oz-screen">
      <div className="oz-toolbar">
        <span className="oz-muted-sm">{CUSTOMERS.length} customers</span>
        <div className="oz-toolbar-search"><Input icon="search" value={q} onChange={setQ} placeholder="Search name, phone, email…" /></div>
      </div>
      <Card pad={0}>
        <div className="oz-table oz-table-cust">
          <div className="oz-tr oz-th">
            <div className="oz-td">Customer</div>
            <div className="oz-td">Contact</div>
            <div className="oz-td oz-num">Orders</div>
            <div className="oz-td oz-num">Spent</div>
            <div className="oz-td oz-num">Points</div>
            <div className="oz-td">Status</div>
            <div className="oz-td oz-c-go" />
          </div>
          {rows.map(c => (
            <button key={c.id} className="oz-tr oz-row-btn" onClick={() => navigate("customer", { id: c.id })}>
              <div className="oz-td oz-c-cust"><Avatar name={c.name} size={32} /><div className="oz-cust-stack"><span className="oz-cust-name">{c.name}</span><span className="dim oz-tiny">since {fmtDate(c.joined)}</span></div></div>
              <div className="oz-td oz-cust-contact"><span>{c.phone}</span><span className="dim oz-tiny">{c.email}</span></div>
              <div className="oz-td oz-num mono">{orderCount(c.id)}</div>
              <div className="oz-td oz-num mono">{fmtMoney0(spent(c.id))}</div>
              <div className="oz-td oz-num"><span className="oz-points-chip">{c.points.toLocaleString()}</span></div>
              <div className="oz-td">{c.status === "active" ? <Pill color="#34d399">Active</Pill> : <Pill color="#f5b945">Flagged</Pill>}</div>
              <div className="oz-td oz-c-go"><Icon name="chevR" size={16} /></div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

function CustomerDetail({ params, navigate, refresh }) {
  const c = customerById(params.id);
  const [note, setNote] = useState("");
  const orders = ORDERS.filter(o => o.customerId === c.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const tx = REWARDS_TX.filter(t => t.customerId === c.id);
  const spent = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  if (!c._notes) c._notes = [];
  const addNote = () => { if (!note.trim()) return; c._notes.unshift({ author: "Alex R.", body: note.trim(), at: new Date().toISOString() }); setNote(""); refresh(); };

  return (
    <div className="oz-screen">
      <button className="oz-back" onClick={() => navigate("customers")}><Icon name="chevL" size={15} /> Customers</button>

      <div className="oz-cust-hero">
        <Avatar name={c.name} size={64} />
        <div className="oz-cust-hero-info">
          <div className="oz-detail-titlerow"><h2>{c.name}</h2>{c.status === "active" ? <Pill color="#34d399">Active</Pill> : <Pill color="#f5b945">Flagged</Pill>}</div>
          <div className="oz-kv-list oz-kv-inline">
            <div className="oz-kv"><Icon name="phone" size={14} /><span>{c.phone}</span></div>
            <div className="oz-kv"><Icon name="mail" size={14} /><span>{c.email}</span></div>
            <div className="oz-kv"><Icon name="pin" size={14} /><span>{c.address}</span></div>
          </div>
        </div>
        <div className="oz-cust-hero-stats">
          <div><span className="oz-hero-num mono">{orders.length}</span><span className="oz-hero-lbl">Orders</span></div>
          <div><span className="oz-hero-num mono">{fmtMoney0(spent)}</span><span className="oz-hero-lbl">Lifetime</span></div>
          <div><span className="oz-hero-num mono" style={{ color: "#b07cff" }}>{c.points.toLocaleString()}</span><span className="oz-hero-lbl">Points</span></div>
        </div>
      </div>

      <div className="oz-grid-2">
        <Card pad={0}>
          <div className="oz-card-head"><SectionTitle>Order history</SectionTitle></div>
          <div className="oz-list">
            {orders.map(o => (
              <button key={o.id} className="oz-list-row" onClick={() => navigate("order", { id: o.id })}>
                <span className="oz-prod-thumb" style={{ background: "var(--surface-2)" }}><Icon name="receipt" size={15} style={{ color: "var(--muted)" }} /></span>
                <div className="oz-list-main"><span className="oz-list-title mono">{o.number}</span><span className="oz-list-sub">{fmtDate(o.createdAt)} · {o.items.reduce((a, i) => a + i.qty, 0)} items</span></div>
                <div className="oz-list-end"><span className="oz-list-amount">{fmtMoney(o.total)}</span><StatusBadge status={o.status} size="sm" /></div>
              </button>
            ))}
            {orders.length === 0 && <Empty icon="receipt" label="No orders yet" />}
          </div>
        </Card>

        <div className="oz-detail-side">
          <Card>
            <SectionTitle right={<span className="oz-muted-sm">Balance: {c.points.toLocaleString()} pts</span>}>Rewards activity</SectionTitle>
            <div className="oz-tx-list">
              {tx.map(t => (
                <div key={t.id} className="oz-tx-row">
                  <span className="oz-tx-icon" style={{ color: t.points > 0 ? "#34d399" : "#f5b945" }}><Icon name={t.points > 0 ? "plus" : "gift"} size={14} /></span>
                  <div className="oz-tx-body"><span>{t.reason}</span><span className="dim oz-tiny">{fmtDate(t.at)} · {t.by}</span></div>
                  <span className="oz-tx-amt mono" style={{ color: t.points > 0 ? "#34d399" : "#f87171" }}>{t.points > 0 ? "+" : ""}{t.points}</span>
                </div>
              ))}
              {tx.length === 0 && <p className="oz-muted-sm" style={{ padding: "6px 0" }}>No rewards activity.</p>}
            </div>
          </Card>
          <Card>
            <SectionTitle>Notes</SectionTitle>
            <div className="oz-note-compose"><Input value={note} onChange={setNote} placeholder="Add a customer note…" /><Button icon="plus" onClick={addNote}>Add</Button></div>
            <div className="oz-notes">
              {c._notes.length === 0 && <p className="oz-muted-sm" style={{ padding: "6px 0" }}>No notes yet.</p>}
              {c._notes.map((n, i) => (
                <div key={i} className="oz-note"><Avatar name={n.author} size={26} tone="#6f5cff" /><div className="oz-note-body"><div className="oz-note-meta"><strong>{n.author}</strong><span className="dim">{ago(n.at)}</span></div><p>{n.body}</p></div></div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Products, Customers, CustomerDetail });
