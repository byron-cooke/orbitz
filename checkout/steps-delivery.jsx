// ORBITZ Checkout — STEP 2 · Delivery
function StepDelivery({ cart, co, setCheckout, totals, next, back }) {
  const d = co.delivery;
  const setD = (patch) => setCheckout(c => ({ ...c, delivery: { ...c.delivery, ...patch } }));
  const zone = zoneById(d.zone);
  const inZone = !!(zone && zone.live);

  const pickAddress = (a) => setD({ addressId: a.id, line1: a.line1, line2: a.line2, city: a.city, state: a.state, zip: a.zip, instructions: a.note || "" });

  const continueCta = (
    <button className="btn btn-primary btn-full btn-lg" disabled={!inZone} onClick={next}>
      Continue to Verification <Icon name="arrowR" size={18} />
    </button>
  );

  return (
    <div className="co-grid">
      <div className="co-col">
        <div className="co-stephead">
          <h1>Where are we landing?</h1>
          <p>Tell your courier exactly where to touch down across the DMV.</p>
        </div>

        <div className="card-stack">
          {/* Saved addresses */}
          <div className="card pad">
            <div className="card-title">Delivery address</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {CUSTOMER.addresses.map(a => (
                <button key={a.id} className={"sel-card" + (d.addressId === a.id ? " on" : "")} onClick={() => pickAddress(a)}>
                  <span className="sel-radio" />
                  <span className="sel-ic"><Icon name={a.label === "Work" ? "building" : "home"} size={19} /></span>
                  <span className="sel-main">
                    <span className="t">{a.label}{a.primary && <span className="sel-tag">Default</span>}</span>
                    <span className="s">{a.line1}{a.line2 ? ", " + a.line2 : ""}, {a.city} {a.state} {a.zip}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="form-stack" style={{ marginTop: 18 }}>
              <div className="fld">
                <label className="fld-label">Street address</label>
                <input value={d.line1} onChange={e => setD({ line1: e.target.value, addressId: null })} placeholder="1420 Columbia Rd NW" />
              </div>
              <div className="fld-row c2">
                <div className="fld">
                  <label className="fld-label">Apartment / unit <span className="opt">(optional)</span></label>
                  <input value={d.line2} onChange={e => setD({ line2: e.target.value })} placeholder="Apt 5B" />
                </div>
                <div className="fld">
                  <label className="fld-label">ZIP code</label>
                  <input value={d.zip} onChange={e => setD({ zip: e.target.value })} placeholder="20009" inputMode="numeric" maxLength={5} />
                </div>
              </div>
              <div className="fld-row c2">
                <div className="fld">
                  <label className="fld-label">City</label>
                  <input value={d.city} onChange={e => setD({ city: e.target.value })} placeholder="Washington" />
                </div>
                <div className="fld">
                  <label className="fld-label">State</label>
                  <select value={d.state} onChange={e => setD({ state: e.target.value })}>
                    <option>DC</option><option>MD</option><option>VA</option>
                  </select>
                </div>
              </div>
              <div className="fld">
                <label className="fld-label">Delivery instructions <span className="opt">(optional)</span></label>
                <textarea value={d.instructions} onChange={e => setD({ instructions: e.target.value })} placeholder="Gate code, buzzer, where to leave it, landmarks…" />
              </div>
            </div>
          </div>

          {/* Zone + map */}
          <div className="card pad">
            <div className="card-title">Delivery zone</div>
            <div className="fld">
              <select value={d.zone} onChange={e => setD({ zone: e.target.value })} aria-label="Delivery zone">
                {CO_ZONES.map(z => <option key={z.id} value={z.id}>{z.label}{z.live ? "" : " — Coming soon"}</option>)}
              </select>
            </div>

            {inZone ? (
              <span className="zone-badge ok"><Icon name="check" size={14} stroke={2.8} />In delivery zone · {zone.eta}</span>
            ) : (
              <span className="zone-badge warn"><Icon name="warn" size={14} />Outside current zone</span>
            )}

            <div className="co-map" style={{ marginTop: 16 }}>
              <div className="co-map-grid" />
              <div className="co-map-glow" />
              <div className="co-map-route" />
              <div className="co-map-hub">🛸</div>
              <div className="co-map-pin">
                <span className="co-map-pin-dot" />
                <span className="co-map-pin-lbl">{d.zip || "Your stop"}</span>
              </div>
              <div className="co-map-tag live"><span className="d" />Live route preview</div>
            </div>

            {!inZone && (
              <div className="zone-warn">
                <div className="zone-warn-ic"><Icon name="rocket" size={20} /></div>
                <div>
                  <h4>We’re not in orbit here — yet</h4>
                  <p>{zone ? zone.label : "This area"} isn’t live for delivery. We’re expanding fast across the DMV. Pick a live zone to continue, or join the waitlist and we’ll alert you the moment we launch.</p>
                </div>
              </div>
            )}
          </div>

          {/* Timing */}
          <div className="card pad">
            <div className="card-title">Preferred delivery window</div>
            <div className="seg">
              <button className={"seg-btn" + (d.timing === "asap" ? " on" : "")} onClick={() => setD({ timing: "asap" })}>
                <Icon name="bolt" size={16} />ASAP
              </button>
              <button className={"seg-btn" + (d.timing === "scheduled" ? " on" : "")} onClick={() => setD({ timing: "scheduled" })}>
                <Icon name="calendar" size={16} />Scheduled
              </button>
            </div>
            {d.timing === "asap" ? (
              <div className="rev-kv" style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 9, color: "var(--t2)" }}>
                <Icon name="clock" size={16} style={{ color: "var(--nb)" }} />
                Priority courier dispatched on order — arriving in <b style={{ color: "#fff", marginLeft: 4 }}>{zone?.eta || "25–40 min"}</b>
              </div>
            ) : (
              <div className="fld" style={{ marginTop: 14 }}>
                <label className="fld-label">Choose a window</label>
                <select value={d.window} onChange={e => setD({ window: e.target.value })}>
                  {CO_WINDOWS.map(w => <option key={w.id} value={w.id}>{w.label}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="co-nav">
          <button className="co-back" onClick={back}><Icon name="chevL" size={16} />Back</button>
          <button className="btn btn-primary" disabled={!inZone} onClick={next}>Continue to Verification <Icon name="arrowR" size={18} /></button>
        </div>
      </div>

      <aside className="co-side">
        <OrderSummary cart={cart} co={co} setCheckout={setCheckout} totals={totals} cta={continueCta} />
      </aside>
    </div>
  );
}
Object.assign(window, { StepDelivery });
