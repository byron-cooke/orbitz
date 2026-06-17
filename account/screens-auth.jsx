// ORBITZ Account — Login
function Login({ onAuth }) {
  const [email, setEmail] = useState("kevin.m@email.com");
  const [pw, setPw] = useState("••••••••••");
  const [phone, setPhone] = useState("");
  const [mode, setMode] = useState("email"); // email | phone
  const [loading, setLoading] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onAuth(); }, 750);
  };
  return (
    <div className="ac-content" style={{ paddingTop: 10 }}>
      <div className="ac-screen" style={{ gap: 0, minHeight: "100%", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 22 }}>
          <div style={{ position: "relative", marginBottom: 6 }}>
            <div style={{ position: "absolute", inset: -18, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(176,124,255,.5), transparent 68%)", filter: "blur(4px)" }} />
            <img src="assets/spaceman.png" alt="" style={{ position: "relative", width: 132, height: 132, objectFit: "contain",
              filter: "drop-shadow(0 14px 30px rgba(111,92,255,.5))" }} />
          </div>
          <img src="assets/logo_wordmark.png" alt="ORBITZ" style={{ height: 30, marginBottom: 16,
            filter: "drop-shadow(0 2px 12px rgba(176,124,255,.4))" }} />
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 26, fontWeight: 600, letterSpacing: "-.01em" }}>
            Welcome back, explorer
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 6, maxWidth: 300 }}>
            Sign in to track deliveries, reorder favorites, and bank your rewards.
          </p>
        </div>

        <div className="ac-seg" style={{ marginBottom: 18 }}>
          <button className={"ac-seg-btn" + (mode === "email" ? " active" : "")} onClick={() => setMode("email")}>Email</button>
          <button className={"ac-seg-btn" + (mode === "phone" ? " active" : "")} onClick={() => setMode("phone")}>Phone</button>
        </div>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "email" ? (
            <>
              <Field label="Email">
                <Input icon="mail" value={email} onChange={setEmail} placeholder="you@email.com" type="email" />
              </Field>
              <Field label="Password">
                <Input icon="shield" type="password" value={pw} onChange={setPw} placeholder="••••••••" />
              </Field>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -4 }}>
                <button type="button" className="oz-link">Forgot password?</button>
              </div>
            </>
          ) : (
            <>
              <Field label="Mobile number" hint="We'll text you a 6-digit launch code.">
                <Input icon="phone" value={phone} onChange={setPhone} placeholder="(202) 555-0163" type="tel" inputMode="tel" />
              </Field>
            </>
          )}
          <Button type="submit" size="lg" full iconRight={loading ? null : "rocket"}>
            {loading ? "Launching…" : (mode === "email" ? "Sign in" : "Send code")}
          </Button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0 16px", color: "var(--muted)", fontSize: 12 }}>
          <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
          new to orbitz?
          <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
        </div>
        <Button variant="ghost" size="lg" full onClick={onAuth}>Create an account</Button>

        <p style={{ textAlign: "center", fontSize: 11.5, color: "var(--muted)", marginTop: 18, lineHeight: 1.6 }}>
          21+ only · Valid ID required on delivery<br />DC · MD · VA
        </p>
      </div>
    </div>
  );
}

Object.assign(window, { Login });
