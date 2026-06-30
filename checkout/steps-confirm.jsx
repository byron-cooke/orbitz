// ORBITZ Checkout — STEP 6 · Confirmation
const CO_TIMELINE = [
  { id: "preparing", t: "Preparing", s: "Your order is being prepped" },
  { id: "packed", t: "Packed", s: "Sealed and ready for launch" },
  { id: "assigned", t: "Driver Assigned", s: "A courier is taking your order" },
  { id: "enroute", t: "En Route", s: "On the way to your door" },
  { id: "delivered", t: "Delivered", s: "Enjoy the ride" },
];

function goToAccount(screen) {
  try { localStorage.setItem("orbitz_acct_route", JSON.stringify([{ screen, params: {} }])); } catch (e) {}
  window.location.href = "../account/index.html";
}

function StepConfirm({ order }) {
  const [assigning, setAssigning] = useState(true);
  const [cur, setCur] = useState(1); // Packed active, Preparing done
  useEffect(() => {
    const a = setTimeout(() => { setAssigning(false); setCur(2); }, 2300);
    return () => clearTimeout(a);
  }, []);

  if (!order) return null;
  const d = CO_DRIVER;

  return (
    <div className="co-grid solo">
      <div className="co-col">
        <div className="cf-wrap">
          {/* Orbit success animation */}
          <div className="cf-anim">
            <div className="cf-orbit cf-spin"><span className="cf-orbit-dot" /></div>
            <div className="cf-orbit o2" />
            <div className="cf-ring-burst" />
            <div className="cf-core"><span className="cf-check"><Icon name="check" size={40} stroke={2.6} /></span></div>
          </div>

          <h1 className="cf-title">Your order has <span>entered orbit.</span></h1>
          <p className="cf-sub">We’ve received your order and a courier is being assigned. You’ll get live updates the whole way to your door.</p>

          {/* Meta */}
          <div className="cf-meta">
            <div className="cf-meta-card">
              <div className="cf-meta-lbl">Order number</div>
              <div className="cf-meta-val mono">{order.number}</div>
            </div>
            <div className="cf-meta-card">
              <div className="cf-meta-lbl">Estimated arrival</div>
              <div className="cf-meta-val">{order.eta}</div>
            </div>
            <div className="cf-meta-card">
              <div className="cf-meta-lbl">Order total</div>
              <div className="cf-meta-val">{fmtMoney(order.total)}</div>
            </div>
          </div>

          {/* Driver placeholder */}
          <div className="cf-driver">
            <div className={"cf-driver-av" + (assigning ? " assigning" : "")}>{assigning ? <span className="btn-spin" style={{ borderColor: "rgba(184,106,255,.3)", borderTopColor: "var(--p)" }} /> : d.avatar}</div>
            <div className="cf-driver-main">
              {assigning ? (
                <>
                  <div className="t">Assigning your courier…</div>
                  <div className="s">Matching you with the nearest certified Orbitz courier</div>
                </>
              ) : (
                <>
                  <div className="t">{d.name}</div>
                  <div className="s">{d.vehicle} · {d.plate}</div>
                </>
              )}
            </div>
            {!assigning && (
              <div className="cf-driver-rating">
                <div className="n">{d.rating}</div>
                <div className="st">★★★★★</div>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="card cf-timeline">
            <div className="card-title" style={{ marginBottom: 18 }}>Order timeline</div>
            {CO_TIMELINE.map((s, i) => {
              const state = i < cur ? "done" : i === cur ? "active" : "todo";
              return (
                <div className={"tl-row " + state} key={s.id}>
                  <div className="tl-rail">
                    <div className="tl-node">{i < cur ? <Icon name="check" size={15} stroke={3} /> : i === cur ? <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} /> : i + 1}</div>
                    {i < CO_TIMELINE.length - 1 && <div className="tl-line" />}
                  </div>
                  <div className="tl-body">
                    <div className="tl-t">{s.t}{i === cur && <span className="tl-now">Now</span>}</div>
                    <div className="tl-s">{s.s}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="cf-actions">
            <button className="btn btn-primary btn-full btn-lg" onClick={() => goToAccount("track")}>
              <Icon name="truck" size={19} />Track Delivery
            </button>
            <div className="cf-actions-row">
              <a href="../shop/index.html" className="btn btn-ghost"><Icon name="bag" size={17} />Continue Shopping</a>
              <button className="btn btn-ghost" onClick={() => goToAccount("orders")}><Icon name="info" size={17} />View Orders</button>
            </div>
          </div>

          <p style={{ fontSize: 12, color: "var(--t4)", textAlign: "center", marginTop: 22 }}>
            A receipt was sent to <b style={{ color: "var(--t3)" }}>{order.customer.email}</b>. Have your ID ready for the courier.
          </p>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { StepConfirm, goToAccount, CO_TIMELINE });
