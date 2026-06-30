// ORBITZ Checkout — app root: stepper state machine, hash routing, persistence, place-order
const CO_STEPS = [
  { id: "cart",         name: "Cart" },
  { id: "delivery",     name: "Delivery" },
  { id: "verify",       name: "Verification" },
  { id: "payment",      name: "Payment" },
  { id: "review",       name: "Review" },
  { id: "confirmation", name: "Confirmation" },
];
const hashToStep = () => {
  const h = (location.hash || "").replace("#", "");
  const i = CO_STEPS.findIndex(s => s.id === h);
  return i < 0 ? 0 : i;
};

function CheckoutApp() {
  // rehydrate a completed order if we reload on the confirmation screen
  const existingOrder = coLoad(CO_LS_ORDER, null);
  const startConfirmed = hashToStep() === 5 && !!existingOrder;

  const [cart, setCart] = useState(() => startConfirmed ? [] : loadCart());
  const [co, setCheckout] = useState(() => loadCheckout());
  const [placed, setPlaced] = useState(startConfirmed);
  const [order, setOrder] = useState(startConfirmed ? existingOrder : null);
  const [placing, setPlacing] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const placedRef = useRef(startConfirmed); // synchronous guard for the hash listener

  const initialStep = startConfirmed ? 5 : (() => { const s = hashToStep(); return s >= 5 ? 0 : s; })();
  const [step, setStepRaw] = useState(initialStep);
  const [maxReached, setMaxReached] = useState(initialStep);

  // ---- persistence ----
  useEffect(() => { if (!placed) coSave(CO_LS_CART, cart); }, [cart, placed]);
  useEffect(() => { if (!placed) coSave(CO_LS_CHECKOUT, co); }, [co, placed]);

  // ---- totals ----
  const totals = useMemo(() => computeTotals(cart, co), [cart, co]);

  // ---- routing ----
  const setStep = useCallback((i) => {
    const clamped = Math.max(0, Math.min(i, CO_STEPS.length - 1));
    setStepRaw(clamped);
    setMaxReached(m => Math.max(m, clamped));
    const id = CO_STEPS[clamped].id;
    if (location.hash.replace("#", "") !== id) location.hash = id;
  }, []);

  useEffect(() => {
    const onHash = () => {
      if (placedRef.current) return; // locked on confirmation
      const s = hashToStep();
      if (s >= 5) { setStep(4); return; } // can't reach confirmation without placing
      setStepRaw(s);
      setMaxReached(m => Math.max(m, s));
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [placed, setStep]);

  // sync hash on first paint
  useEffect(() => { if (location.hash.replace("#", "") !== CO_STEPS[step].id) location.hash = CO_STEPS[step].id; }, []); // eslint-disable-line

  // scroll to top on step change
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);

  // ---- toast ----
  const showToast = useCallback((opts) => {
    setToast(opts);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  // ---- nav ----
  const next = () => setStep(step + 1);
  const back = () => setStep(step - 1);
  const goStep = (i) => setStep(i);

  // ---- place order ----
  const onPlace = () => {
    if (placing) return;
    setPlacing(true);
    setTimeout(() => {
      const o = placeOrder(cart, co);
      placedRef.current = true; // guard the hash listener BEFORE we change the hash
      setOrder(o);
      setPlaced(true);
      setPlacing(false);
      setStepRaw(5);
      setMaxReached(5);
      if (location.hash.replace("#", "") !== "confirmation") location.hash = "confirmation";
    }, 1700);
  };

  // ---- render current step ----
  const stepProps = { cart, setCart, co, setCheckout, totals, next, back, goStep, toast: showToast };
  let body;
  if (placed && step === 5) body = <StepConfirm order={order} />;
  else if (step === 0) body = <StepCart {...stepProps} />;
  else if (step === 1) body = <StepDelivery {...stepProps} />;
  else if (step === 2) body = <StepVerify {...stepProps} />;
  else if (step === 3) body = <StepPayment {...stepProps} />;
  else if (step === 4) body = <StepReview {...stepProps} onPlace={onPlace} placing={placing} />;
  else body = <StepCart {...stepProps} />;

  return (
    <>
      <header className="co-head">
        <a className="co-head-brand" href="../index.html" aria-label="Orbitz home">
          <img src="../logo_wordmark.png" alt="Orbitz" />
          <span className="co-head-tag">CHECKOUT</span>
        </a>
        <div className="co-head-spacer" />
        <div className="co-head-secure"><Icon name="lock" size={14} /><span>Secure checkout</span></div>
        <a className="co-head-close" href="../shop/index.html" aria-label="Close checkout"><Icon name="x" size={18} stroke={2.2} /></a>
      </header>

      {!placed && <Stepper steps={CO_STEPS} current={step} maxReached={maxReached} onJump={goStep} />}

      <main className="co-main">
        {body}
      </main>

      <Toast toast={toast} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<CheckoutApp />);
