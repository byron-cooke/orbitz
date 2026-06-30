// ORBITZ Checkout — STEP 4 · Payment (mock only)
const fmtCardNumber = (s) => s.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
const fmtExp = (s) => { const d = s.replace(/\D/g, "").slice(0, 4); return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d; };

function WalletAuth({ method, authorized, onAuth, toast }) {
  const [busy, setBusy] = useState(false);
  const isApple = method === "apple";
  const go = () => {
    setBusy(true);
    setTimeout(() => { setBusy(false); onAuth(method); toast({ msg: (isApple ? "Apple Pay" : "Google Pay") + " authorized", icon: "check" }); }, 1200);
  };
  return (
    <div className="applepay-mock">
      {authorized === method ? (
        <>
          <span className="sel-ic" style={{ width: 52, height: 52, background: "rgba(74,222,128,.14)", borderColor: "rgba(74,222,128,.34)", color: "var(--grn)" }}><Icon name="check" size={26} stroke={2.6} /></span>
          <div style={{ fontSize: 14.5, fontWeight: 700 }}>{isApple ? "Apple Pay" : "Google Pay"} ready</div>
          <div style={{ fontSize: 12.5, color: "var(--t3)" }}>You’ll confirm with {isApple ? "Face ID / Touch ID" : "your Google account"} when you place the order.</div>
        </>
      ) : (
        <>
          <div style={{ fontSize: 13, color: "var(--t3)", maxWidth: 280 }}>Authorize {isApple ? "Apple Pay" : "Google Pay"} to use it for this order.</div>
          <button className={"applepay-btn" + (isApple ? "" : " gpay")} onClick={go} disabled={busy}>
            {busy ? <span className="btn-spin" style={isApple ? {} : { borderColor: "rgba(0,0,0,.25)", borderTopColor: "#3c4043" }} />
              : <><Icon name={isApple ? "apple" : "google"} size={20} />{isApple ? "Pay" : "Google Pay"}</>}
          </button>
        </>
      )}
    </div>
  );
}

function StepPayment({ cart, co, setCheckout, totals, next, back, toast }) {
  const pay = co.payment;
  const setP = (patch) => setCheckout(c => ({ ...c, payment: { ...c.payment, ...patch } }));
  const setCard = (patch) => setCheckout(c => ({ ...c, payment: { ...c.payment, card: { ...c.payment.card, ...patch } } }));
  const pick = (m) => setP({ method: m });

  const card = pay.card;
  const cardReady = card.number.replace(/\s/g, "").length >= 15 && card.exp.length === 5 && card.cvv.length >= 3 && card.zip.length >= 5;
  const ready =
    pay.method === "card" ? cardReady :
    (pay.method === "apple" || pay.method === "google") ? pay.authorized === pay.method :
    true; // cash + crypto

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

          {/* CARD */}
          {pay.method === "card" && (
            <div className="pay-detail form-stack">
              <div className="fld">
                <label className="fld-label">Card number</label>
                <input value={card.number} onChange={e => setCard({ number: fmtCardNumber(e.target.value) })}
                  placeholder="4242 4242 4242 4242" inputMode="numeric" />
              </div>
              <div className="fld-row c3">
                <div className="fld">
                  <label className="fld-label">Expiration</label>
                  <input value={card.exp} onChange={e => setCard({ exp: fmtExp(e.target.value) })} placeholder="MM/YY" inputMode="numeric" maxLength={5} />
                </div>
                <div className="fld">
                  <label className="fld-label">CVV</label>
                  <input value={card.cvv} onChange={e => setCard({ cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })} placeholder="123" inputMode="numeric" maxLength={4} />
                </div>
                <div className="fld">
                  <label className="fld-label">Billing ZIP</label>
                  <input value={card.zip} onChange={e => setCard({ zip: e.target.value.replace(/\D/g, "").slice(0, 5) })} placeholder="20009" inputMode="numeric" maxLength={5} />
                </div>
              </div>
              <button className={"ack" + (card.save ? " on" : "")} onClick={() => setCard({ save: !card.save })} style={{ padding: "13px 15px" }}>
                <span className="ack-box"><Icon name="check" size={14} stroke={3} /></span>
                <p style={{ fontSize: 13 }}>Save this card securely for faster checkout next time.</p>
              </button>
              <div className="pay-secure-note"><Icon name="lock" size={15} />Encrypted end-to-end. Your full card number is never stored on your device.</div>
            </div>
          )}

          {/* APPLE / GOOGLE */}
          {(pay.method === "apple" || pay.method === "google") && (
            <div className="pay-detail">
              <WalletAuth method={pay.method} authorized={pay.authorized} onAuth={m => setP({ authorized: m })} toast={toast} />
            </div>
          )}

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
Object.assign(window, { StepPayment, WalletAuth });
