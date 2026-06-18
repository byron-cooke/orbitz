// ORBITZ Shop — cart drawer

function CartLine({ line, p, setQty, remove }) {
  const isGear = p.category === "accessory";
  return (
    <div className="cart-line">
      <div className="cart-line-img"><ProductShot tone={p.tone} category={p.category} compact ring={false} /></div>
      <div className="cart-line-main">
        <div className="cart-line-brand">{p.brand}</div>
        <div className="cart-line-name">{p.name}</div>
        <div className="cart-line-sub">{isGear ? p.size : `${p.size} · THC ${p.thc}${p.category === "edible" ? "mg" : "%"}`}</div>
        <div className="cart-line-bottom">
          <div className="cart-qty">
            <button onClick={() => setQty(p.id, line.qty - 1)} aria-label="Decrease"><Icon name="minus" size={14} stroke={2.6} /></button>
            <span>{line.qty}</span>
            <button onClick={() => setQty(p.id, line.qty + 1)} aria-label="Increase"><Icon name="plus" size={14} stroke={2.6} /></button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="cart-line-price">{fmtMoney(p.price * line.qty)}</span>
            <button className="cart-line-rm" onClick={() => remove(p.id)} aria-label={"Remove " + p.name}><Icon name="trash" size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ open, onClose, cart, setQty, remove, onBrowse }) {
  useEffect(() => {
    if (!open) return;
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  const lines = cart.map(l => ({ line: l, p: productById(l.id) })).filter(x => x.p);
  const itemCount = cart.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, x) => s + x.p.price * x.line.qty, 0);
  const points = Math.round(subtotal * REWARDS_PER_DOLLAR);

  return (
    <>
      <div className={"cart-overlay" + (open ? " open" : "")} onClick={onClose} />
      <aside className={"cart-drawer" + (open ? " open" : "")} role="dialog" aria-label="Shopping cart" aria-hidden={!open}>
        <div className="cart-head">
          <Icon name="bag" size={20} style={{ color: "var(--p)" }} />
          <h2>Your Cart</h2>
          {itemCount > 0 && <span className="cc">{itemCount} {itemCount === 1 ? "item" : "items"}</span>}
          <button className="cart-close" onClick={onClose} aria-label="Close cart"><Icon name="x" size={18} stroke={2.4} /></button>
        </div>

        {lines.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-ring"><Icon name="bag" size={34} /></div>
            <h3>Your cart is empty</h3>
            <p>Add some top-shelf products and they'll show up here, ready for lift-off.</p>
            <button className="cart-checkout" style={{ height: 48, width: "auto", padding: "0 26px" }} onClick={onBrowse}>
              <Icon name="rocket" size={17} />Browse the menu
            </button>
          </div>
        ) : (
          <>
            <div className="cart-body">
              {lines.map(({ line, p }) => (
                <CartLine key={p.id} line={line} p={p} setQty={setQty} remove={remove} />
              ))}
            </div>

            <div className="cart-foot">
              <div className="cart-rewards">
                <span className="cart-rewards-ic"><Icon name="sparkle" size={18} /></span>
                <span className="cart-rewards-txt">You'll earn <b>{points.toLocaleString()} points</b> on this order with Orbitz Rewards.</span>
                <span className="cart-rewards-pts">+{points.toLocaleString()}</span>
              </div>

              <div className="cart-totals">
                <div className="cart-trow sub"><span>Subtotal</span><b>{fmtMoney(subtotal)}</b></div>
                <div className="cart-trow"><span>Delivery</span><span style={{ color: "var(--grn)", fontWeight: 700 }}>Calculated at checkout</span></div>
                <div className="cart-trow"><span>Taxes</span><span style={{ color: "var(--t3)" }}>Calculated at checkout</span></div>
                <div className="cart-trow grand"><span>Estimated total</span><b>{fmtMoney(subtotal)}</b></div>
              </div>

              <button className="cart-checkout" disabled aria-disabled="true">
                <Icon name="lock" size={17} />Proceed to Checkout
              </button>
              <div className="cart-checkout-note"><Icon name="rocket" size={13} style={{ color: "var(--p)" }} />Checkout launches soon — payments are coming in a later phase.</div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

Object.assign(window, { CartDrawer, CartLine });
