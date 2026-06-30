// ORBITZ Checkout — STEP 3 · Identity Verification (mock UI only)
function UploadCard({ done, onChange, icon, title, sub, accept = "image/*", capture }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const timer = useRef(null);

  const onFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) { try { setPreview(URL.createObjectURL(f)); } catch (_) { setPreview("mock"); } }
    else setPreview("mock");
    setScanning(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { setScanning(false); onChange(true); }, 1500);
  };
  const remove = (e) => { e.stopPropagation(); setPreview(null); setScanning(false); onChange(false); };
  useEffect(() => () => timer.current && clearTimeout(timer.current), []);

  const hasShot = !!preview;
  return (
    <label className={"upl" + (done ? " done" : "")}>
      <input ref={inputRef} type="file" accept={accept} {...(capture ? { capture: "user" } : {})} onChange={onFile} />
      {hasShot && (
        <>
          <div className="upl-prev">
            {preview !== "mock" ? <img src={preview} alt="" /> : <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#1a1830,#0e0c1a)" }} />}
            {scanning && <div className="upl-scan" />}
          </div>
          {!scanning && <button className="upl-rm" onClick={remove} aria-label="Remove"><Icon name="x" size={15} stroke={2.4} /></button>}
          <div className="upl-badge">
            {scanning
              ? <><span className="btn-spin" style={{ width: 14, height: 14, borderColor: "rgba(184,106,255,.35)", borderTopColor: "var(--p)" }} /><span style={{ color: "var(--p)" }}>Scanning…</span></>
              : <><Icon name="check" size={15} stroke={2.8} />Captured</>}
          </div>
        </>
      )}
      {!hasShot && (
        <>
          <span className="upl-ic"><Icon name={icon} size={24} /></span>
          <span className="upl-t">{title}</span>
          <span className="upl-s">{sub}</span>
        </>
      )}
    </label>
  );
}

function StepVerify({ cart, co, setCheckout, totals, next, back }) {
  const v = co.verification;
  const setV = (patch) => setCheckout(c => ({ ...c, verification: { ...c.verification, ...patch } }));

  const checks = [
    { id: "age", label: "21 years or older", sub: "Confirmed from your government ID", done: v.idFront },
    { id: "id", label: "Valid government ID", sub: "Front and back captured", done: v.idFront && v.idBack },
    { id: "recipient", label: "Recipient present", sub: "Selfie matches ID photo", done: v.selfie },
  ];
  const ready = v.idFront && v.idBack && v.selfie && v.acknowledged;

  const continueCta = (
    <button className="btn btn-primary btn-full btn-lg" disabled={!ready} onClick={next}>
      Continue to Payment <Icon name="arrowR" size={18} />
    </button>
  );

  return (
    <div className="co-grid">
      <div className="co-col">
        <div className="co-stephead">
          <h1>Verify your identity</h1>
          <p>Cannabis delivery is 21+. A quick, encrypted check keeps everyone compliant — your courier confirms the same ID at the door.</p>
        </div>

        <div className="card-stack">
          {/* Government ID */}
          <div className="card pad">
            <div className="card-title">Government ID</div>
            <div className="upl-grid">
              <UploadCard done={v.idFront} onChange={x => setV({ idFront: x })} icon="idcard"
                title="Front of ID" sub="Driver’s license or state ID" />
              <UploadCard done={v.idBack} onChange={x => setV({ idBack: x })} icon="idcard"
                title="Back of ID" sub="Make sure the barcode is clear" />
            </div>
          </div>

          {/* Selfie */}
          <div className="card pad">
            <div className="card-title">Selfie verification</div>
            <div className="upl-grid" style={{ gridTemplateColumns: "1fr" }}>
              <UploadCard done={v.selfie} onChange={x => setV({ selfie: x })} icon="camera" capture
                title="Take a selfie" sub="Look straight at the camera in good lighting — we match it to your ID photo" />
            </div>
          </div>

          {/* Checklist */}
          <div className="card pad">
            <div className="card-title">Verification checklist</div>
            <div className="vchecks">
              {checks.map(c => (
                <div className={"vcheck" + (c.done ? " on" : "")} key={c.id}>
                  <span className="vcheck-box"><Icon name="check" size={15} stroke={3} /></span>
                  <div className="vcheck-main">
                    <div className="t">{c.label}</div>
                    <div className="s">{c.sub}</div>
                  </div>
                  <span className="vcheck-stat">{c.done ? "Verified" : "Pending"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Acknowledgment */}
          <button className={"ack" + (v.acknowledged ? " on" : "")} onClick={() => setV({ acknowledged: !v.acknowledged })}>
            <span className="ack-box"><Icon name="check" size={14} stroke={3} /></span>
            <p>I confirm I am 21 or older and will present a valid, matching government-issued ID to the courier on delivery. I understand orders cannot be released without it.</p>
          </button>
        </div>

        <div className="co-nav">
          <button className="co-back" onClick={back}><Icon name="chevL" size={16} />Back</button>
          <button className="btn btn-primary" disabled={!ready} onClick={next}>Continue to Payment <Icon name="arrowR" size={18} /></button>
        </div>
      </div>

      <aside className="co-side">
        <OrderSummary cart={cart} co={co} setCheckout={setCheckout} totals={totals} cta={continueCta} />
      </aside>
    </div>
  );
}
Object.assign(window, { StepVerify, UploadCard });
