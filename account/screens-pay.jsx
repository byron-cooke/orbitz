// ORBITZ Account — Payments / Payment Proof
function Payments({ go, toast }) {
  const [preferred, setPreferred] = useState(ME.payment.preferred);
  const [proofUploaded, setProofUploaded] = useState(false);
  const active = activeOrder();
  const method = ME.payment.methods.find(m => m.id === preferred);

  const choose = (id) => {
    setPreferred(id); ME.payment.preferred = id;
    toast({ msg: ME.payment.methods.find(m => m.id === id).label + " set as preferred", icon: "check" });
  };

  return (
    <div className="ac-screen">
      <Card pad={16}>
        <SectionTitle right={<button className="oz-link" onClick={() => toast({ msg: "Add payment method form opens here", icon: "card", tone: "#5b8cff" })}>+ Add</button>}>Preferred payment</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 14 }}>
          {ME.payment.methods.map(m => {
            const on = preferred === m.id;
            return (
              <button key={m.id} onClick={() => choose(m.id)} className="ac-row"
                style={{ padding: 13, borderRadius: 13, cursor: "pointer", textAlign: "left", color: "var(--text)",
                  background: on ? "rgba(176,124,255,.1)" : "rgba(0,0,0,.2)", border: "1px solid " + (on ? "rgba(176,124,255,.45)" : "var(--line)") }}>
                <span style={{ width: 40, height: 40, borderRadius: 12, display: "grid", placeItems: "center", fontSize: 20, background: "var(--surface-2)", border: "1px solid var(--line)", flexShrink: 0 }}>{m.emoji}</span>
                <div className="ac-row-main">
                  <span className="ac-row-title">{m.label}</span>
                  <span className="ac-row-sub mono">{m.detail}</span>
                </div>
                <span style={{ width: 22, height: 22, borderRadius: "50%", border: "2px solid " + (on ? "var(--primary)" : "var(--line-2)"), display: "grid", placeItems: "center", flexShrink: 0 }}>
                  {on && <span style={{ width: 11, height: 11, borderRadius: "50%", background: "var(--primary)", boxShadow: "0 0 8px var(--primary)" }} />}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Payment proof for active order */}
      <Card pad={16}>
        <SectionTitle right={active ? <span className="mono" style={{ fontSize: 12, color: "var(--text-2)" }}>{active.number}</span> : null}>Payment proof</SectionTitle>
        {active ? (
          <>
            <div style={{ display: "flex", gap: 11, marginTop: 14, padding: 13, borderRadius: 13, background: "rgba(176,124,255,.07)", border: "1px solid rgba(176,124,255,.28)" }}>
              <span style={{ fontSize: 22 }}>{method.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, color: "var(--text-2)" }}>Send <strong style={{ color: "#fff" }}>{fmtMoney(active.total)}</strong> via {method.label} to</div>
                <div className="mono" style={{ fontSize: 14, fontWeight: 600, color: "var(--primary)", marginTop: 3, display: "flex", alignItems: "center", gap: 8 }}>
                  {method.id === "zelle" ? "pay@orbitz.delivery" : method.id === "cashapp" ? "$OrbitzDMV" : method.id === "crypto" ? "0x9c…ORBZ" : "Cash on delivery"}
                  <button className="ac-back" style={{ width: 26, height: 26, borderRadius: 7 }} onClick={() => toast({ msg: "Copied to clipboard", icon: "copy", tone: "#5b8cff" })} aria-label="Copy"><Icon name="copy" size={13} /></button>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              {proofUploaded
                ? <FilePlaceholder filename="payment_proof.png" caption={method.label + " · pending review"} height={150} uploaded />
                : (
                  <div className="ac-drop" onClick={() => { setProofUploaded(true); toast({ msg: "Proof uploaded · pending review", icon: "upload", tone: "#b07cff" }); }}>
                    <span className="ac-quick-ic" style={{ background: "rgba(176,124,255,.14)", borderColor: "rgba(176,124,255,.4)", color: "var(--primary)" }}><Icon name="upload" size={20} /></span>
                    <span className="ac-drop-title">Upload payment screenshot</span>
                    <span className="ac-drop-sub">Snap your {method.label} confirmation</span>
                  </div>
                )}
            </div>
            {proofUploaded && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, fontSize: 12.5, color: "var(--amber)", fontWeight: 600 }}>
                <Icon name="clock" size={15} /> Pending review · we'll verify within minutes
              </div>
            )}
          </>
        ) : (
          <div style={{ marginTop: 8 }}><Empty icon="card" label="No order awaiting payment proof." /></div>
        )}
      </Card>

      <div style={{ display: "flex", gap: 9, padding: 13, borderRadius: 13, background: "rgba(52,211,153,.07)", border: "1px solid rgba(52,211,153,.22)" }}>
        <Icon name="shieldCheck" size={17} style={{ color: "var(--green)", flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.5 }}>ORBITZ never stores card numbers. You pay your courier directly and upload proof — fast, private, and secure.</span>
      </div>
    </div>
  );
}

Object.assign(window, { Payments });
