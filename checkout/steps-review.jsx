// ORBITZ Checkout — STEP 5 · Review Order
function ReviewSection({ icon, title, stepIndex, goStep, children }) {
  return (
    <div className="rev-sec">
      <div className="rev-sec-head">
        <h3><Icon name={icon} size={15} />{title}</h3>
        {stepIndex != null && <button className="rev-edit" onClick={() => goStep(stepIndex)}><Icon name="edit" size={13} />Edit</button>}
      </div>
      {children}
    </div>
  );
}

function StepReview({ cart, co, setCheckout, totals, goStep, back, onPlace, placing }) {
  const d = co.delivery;
  const pm = payMethodById(co.payment.method);
  const last4 = co.payment.method === "card" && co.payment.card.number ? co.payment.card.number.replace(/\s/g, "").slice(-4) : null;
  const addrStr = `${d.line1}${d.line2 ? ", " + d.line2 : ""}, ${d.city} ${d.state} ${d.zip}`;

  const placeBtn = (full) => (
    <button className={"btn btn-primary btn-lg" + (full ? " btn-full" : "")} disabled={placing} onClick={onPlace}>
      {placing ? <><span className="btn-spin" />Placing your order…</> : <><Icon name="rocket" size={19} />Place Order · {fmtMoney(totals.total)}</>}
    </button>
  );

  return (
    <div className="co-grid">
      <div className="co-col">
        <div className="co-stephead">
          <h1>Review &amp; launch</h1>
          <p>One last look before your order enters orbit. Edit anything that needs a tweak.</p>
        </div>

        <div className="card">
          <ReviewSection icon="bag" title={`Items (${totals.itemCount})`} stepIndex={0} goStep={goStep}>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {totals.lines.map(({ id, qty, p }) => (
                <div className="co-sum-item" key={id}>
                  <div className="co-sum-item-img"><span className="co-sum-item-qty">{qty}</span><ProductShot tone={p.tone} size="xs" /></div>
                  <div className="co-sum-item-main">
                    <div className="co-sum-item-name">{p.name}</div>
                    <div className="co-sum-item-sub">{strainLine(p)}</div>
                  </div>
                  <span className="co-sum-item-price">{fmtMoney(p.price * qty)}</span>
                </div>
              ))}
            </div>
          </ReviewSection>

          <ReviewSection icon="pin" title="Delivery address" stepIndex={1} goStep={goStep}>
            <div className="rev-kv">
              <div style={{ fontWeight: 700 }}>{CUSTOMER.name}</div>
              <div>{addrStr}</div>
              <div className="muted" style={{ marginTop: 2 }}>{zoneById(d.zone)?.label}</div>
            </div>
          </ReviewSection>

          {d.instructions && (
            <ReviewSection icon="info" title="Delivery instructions" stepIndex={1} goStep={goStep}>
              <div className="rev-kv">{d.instructions}</div>
            </ReviewSection>
          )}

          <ReviewSection icon="clock" title="Delivery window" stepIndex={1} goStep={goStep}>
            <div className="rev-kv">
              {d.timing === "asap"
                ? <><b>ASAP · Priority</b> <span className="muted">— arriving in {etaLabel(co)}</span></>
                : <><b>Scheduled</b> <span className="muted">— {etaLabel(co)}</span></>}
            </div>
          </ReviewSection>

          <ReviewSection icon="shield" title="Identity" stepIndex={2} goStep={goStep}>
            <span className="rev-pill" style={{ color: "var(--grn)", borderColor: "rgba(74,222,128,.26)", background: "rgba(74,222,128,.06)" }}>
              <Icon name="check" size={15} stroke={2.8} />ID &amp; selfie verified · 21+
            </span>
          </ReviewSection>

          <ReviewSection icon={pm.icon} title="Payment" stepIndex={3} goStep={goStep}>
            <span className="rev-pill"><span className="em"><Icon name={pm.icon} size={18} style={{ color: "var(--p)" }} /></span>{pm.label}{last4 ? ` ·••••  ${last4}` : ""}</span>
          </ReviewSection>

          <ReviewSection icon="sparkle" title="Order total" goStep={goStep}>
            <div className="co-totals" style={{ padding: 0, border: "none" }}>
              <div className="co-trow"><span>Subtotal</span><span className="v">{fmtMoney(totals.subtotal)}</span></div>
              {totals.discount > 0 && <div className="co-trow discount"><span>Discount{totals.promo ? ` (${totals.promo.code})` : ""}</span><span className="v">−{fmtMoney(totals.discount)}</span></div>}
              <div className={"co-trow" + (totals.freeShip ? " free" : "")}><span>Delivery{d.timing === "asap" ? " · Priority" : ""}</span><span className="v">{totals.freeShip ? "FREE" : fmtMoney(totals.deliveryFee)}</span></div>
              <div className="co-trow"><span>Taxes (6%)</span><span className="v">{fmtMoney(totals.tax)}</span></div>
              {totals.rewardValue > 0 && <div className="co-trow discount"><span>Rewards ({totals.rewardPts.toLocaleString()} pts)</span><span className="v">−{fmtMoney(totals.rewardValue)}</span></div>}
              <div className="co-trow grand"><span>Total</span><span className="v">{fmtMoney(totals.total)}</span></div>
            </div>
          </ReviewSection>
        </div>

        <div className="co-nav">
          <button className="co-back" onClick={back} disabled={placing}><Icon name="chevL" size={16} />Back</button>
          {placeBtn(false)}
        </div>
        <p style={{ fontSize: 11.5, color: "var(--t4)", textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
          By placing your order you confirm you’re 21+ and agree to Orbitz’s Terms &amp; delivery requirements. Valid ID required at the door.
        </p>
      </div>

      <aside className="co-side">
        <OrderSummary cart={cart} co={co} setCheckout={setCheckout} totals={totals} showControls={false}
          cta={placeBtn(true)} />
      </aside>
    </div>
  );
}
Object.assign(window, { StepReview, ReviewSection });
