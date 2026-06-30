
// ORBITZ Checkout — STEP 4 · Payment (mock only)

// Cash App / Venmo: pay the Orbitz handle, then upload a screenshot of the transfer.
function HandlePay({ method, totals, proof, onProof, toast }) {
  const m = payMethodById(method);
  const handle = payHandle(method);
  return (
    <div className="pay-detail form-stack">
      <div className="card pad" style={{ background: "var(--card-2)" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <span className="sel-ic"><Icon name={method} size={20} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Send {fmtMoney(totals.total)} on {m.label}</div>
            <div style={{ fontSize: 12.5, color: "var(--t3)", marginTop: 3, lineHeight: 1.6 }}>
              Pay the Orbitz {m.label} handle below, then upload a screenshot of the completed payment. Your order confirms once we match it.
            </div>
            <div className="crypto-addr">{handle}</div>
          </div>
        </div>
      </div>

      <div className="wallet-row">
        <button className="wallet-chip" onClick={() => toast({ msg: m.label + " handle copied", icon: "copy" })}>
          <Icon name="copy" size={16} style={{ color: "var(--p)" }} />Copy handle
        </button>
        <button className="wallet-chip" onClick={() => toast({ msg: "Opening " + m.label + "…", icon: method })}>
          <Icon name={method} size={16} style={{ color: "var(--p)" }} />Open {m.label}
        </button>
      </div>

      <div>
        <label className="fld-label">Proof of payment</label>
        <div className="upl-grid" style={{ gridTemplateColumns: "1fr" }}>
          <UploadCard done={proof} onChange={onProof} icon="upload"
            title="Upload payment screenshot" sub="Add a screenshot showing the completed transfer" />
        </div>
      </div>

      {!proof && (
        <div className="pay-secure-note"><Icon name="info" size={15} />Upload your payment proof to continue to review.</div>
      )}
    </div>
  );
}

function StepPayment({ cart, co, setCheckout, totals, next, back, toast }) {
  const pay = co.payment;
  const setP = (patch) => setCheckout(c => ({ ...c, payment: { ...c.payment, ...patch } }));
  const pick = (m) => setP({ method: m });

  const ready = payNeedsProof(pay.method) ? !!pay.proof : true; // cash + crypto always ready

  const continueCta = (
    <button className="btn btn-primary btn-full btn-lg" disabled={!ready} onClick={next}>
      Review Order <Icon name="arrowR" size={18} />
    </button>
  );

  return (
    <div className="co-grid">
      <div className="co-col">
        <div className="co-stephead">
          <h1>How would you like to pay?</h1>
          <p>Choose your method. Nothing is charged until your courier confirms delivery.</p>
        </div>

        <div className="card pad">
          <div className="card-title">Payment method</div>
          <div className="pay-methods">
            {CO_PAY_METHODS.map(m => (
              <button key={m.id} className={"pay-m" + (pay.method === m.id ? " on" : "")} onClick={() => pick(m.id)}>
                <span className="pay-m-ic"><Icon name={m.icon} size={22} /></span>
                <span className="pay-m-main">
                  <span className="t">{m.label}</span>
                  <span className="s">{m.sub}</span>
                </span>
              </button>
            ))}
          </div>

          {/* CASH */}
          {pay.method === "cash" && (
            <div className="pay-detail">
              <div className="card pad" style={{ background: "var(--card-2)", display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span className="sel-ic"><Icon name="cash" size={20} /></span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Cash on delivery</div>
                  <div style={{ fontSize: 13, color: "var(--t2)", lineHeight: 1.6 }}>Have <b style={{ color: "#fff" }}>{fmtMoney(totals.total)}</b> ready for your courier. Exact change is appreciated — couriers carry limited change.</div>
                </div>
              </div>
            </div>
          )}

          {/* CASH APP / VENMO */}
          {payNeedsProof(pay.method) && (
            <HandlePay method={pay.method} totals={totals} proof={pay.proof}
              onProof={x => setP({ proof: x })} toast={toast} />
          )}

          {/* CRYPTO */}
          {pay.method === "crypto" && (
            <div className="pay-detail">
              <div className="crypto-box">
                <div className="crypto-qr"><div className="crypto-qr-grid" /><Icon name="crypto" size={30} style={{ position: "absolute", color: "var(--p)" }} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>Pay {fmtMoney(totals.total)} in USDC</div>
                  <div style={{ fontSize: 12.5, color: "var(--t3)", marginTop: 3 }}>Send to the Orbitz wallet (Polygon · USDC). Order confirms once the transfer clears.</div>
                  <div className="crypto-addr">{CO_CRYPTO_WALLET}</div>
                </div>
              </div>
              <div className="wallet-row">
                <button className="wallet-chip" onClick={() => toast({ msg: "Wallet address copied", icon: "copy" })}><Icon name="copy" size={16} style={{ color: "var(--p)" }} />Copy address</button>
                <button className="wallet-chip" onClick={() => toast({ msg: "Connecting wallet…", icon: "crypto" })}><Icon name="crypto" size={16} style={{ color: "var(--p)" }} />Connect wallet</button>
              </div>
            </div>
          )}
        </div>

        <div className="co-nav">
          <button className="co-back" onClick={back}><Icon name="chevL" size={16} />Back</button>
          <button className="btn btn-primary" disabled={!ready} onClick={next}>Review Order <Icon name="arrowR" size={18} /></button>
        </div>
      </div>

      <aside className="co-side">
        <OrderSummary cart={cart} co={co} setCheckout={setCheckout} totals={totals} cta={continueCta} />
      </aside>
    </div>
  );
}
Object.assign(window, { StepPayment, HandlePay });
