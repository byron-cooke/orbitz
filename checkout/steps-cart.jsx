// ORBITZ Checkout — STEP 1 · Cart Review
function StepCart({ cart, setCart, co, setCheckout, totals, next, toast }) {
  const setQty = (id, qty) => {
    if (qty <= 0) { setCart(c => c.filter(l => l.id !== id)); return; }
    setCart(c => c.map(l => l.id === id ? { ...l, qty: Math.min(99, qty) } : l));
  };
  const remove = (id) => { const p = productById(id); setCart(c => c.filter(l => l.id !== id)); toast({ msg: `${p?.name || "Item"} removed`, icon: "trash" }); };

  if (totals.lines.length === 0) {
    return (
      <div className="co-grid solo">
        <div className="co-col">
          <div className="card pad">
            <div className="co-empty">
              <div className="co-empty-ring"><Icon name="bag" size={34} /></div>
              <h3>Your cart is empty</h3>
              <p>Add some top-shelf products and they’ll show up here, ready for lift-off.</p>
              <a href="../shop/index.html" className="btn btn-primary"><Icon name="rocket" size={18} />Browse the menu</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const continueCta = (
    <button className="btn btn-primary btn-full btn-lg" onClick={next}>
      Continue to Delivery <Icon name="arrowR" size={18} />
    </button>
  );

  return (
    <div className="co-grid">
      <div className="co-col">
        <div className="co-stephead">
          <h1>Review your cart</h1>
          <p>Check quantities and items before lift-off. You can edit anything here.</p>
        </div>

        <div className="card-stack">
          {totals.lines.map(({ id, qty, p }) => (
            <div className="co-cartline" key={id}>
              <div className="co-cl-img"><ProductShot tone={p.tone} category={p.category} size="sm" /></div>
              <div className="co-cl-main">
                <div className="co-cl-brand">{p.brand}</div>
                <div className="co-cl-name">{p.name}</div>
                <div className="co-cl-sub">{strainLine(p)}</div>
                <div className="co-cl-row">
                  <div className="co-qty">
                    <button onClick={() => setQty(id, qty - 1)} aria-label="Decrease"><Icon name="minus" size={14} stroke={2.6} /></button>
                    <span>{qty}</span>
                    <button onClick={() => setQty(id, qty + 1)} aria-label="Increase"><Icon name="plus" size={14} stroke={2.6} /></button>
                  </div>
                  <div className="co-cl-pricewrap">
                    <span className="co-cl-unit">{fmtMoney(p.price)} ea</span>
                    <span className="co-cl-price">{fmtMoney(p.price * qty)}</span>
                    <button className="co-cl-rm" onClick={() => remove(id)} aria-label={"Remove " + p.name}><Icon name="trash" size={17} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <a href="../shop/index.html" className="co-back" style={{ marginTop: 22, display: "inline-flex" }}>
          <Icon name="chevL" size={16} />Add more items
        </a>
      </div>

      <aside className="co-side">
        <OrderSummary cart={cart} co={co} setCheckout={setCheckout} totals={totals} cta={continueCta} />
      </aside>
    </div>
  );
}
Object.assign(window, { StepCart });
