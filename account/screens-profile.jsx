// ORBITZ Account — Profile & Address + ID Verification
function ProfileRow({ icon, tone = "#b07cff", title, sub, right, onClick, danger }) {
  return (
    <button className="ac-row" style={{ padding: "13px 15px", width: "100%", background: "none", border: "none", cursor: "pointer", color: danger ? "#fb9a9a" : "var(--text)" }} onClick={onClick}>
      <span className="ac-quick-ic" style={{ width: 36, height: 36, background: tone + "22", borderColor: tone + "55", color: tone }}><Icon name={icon} size={17} /></span>
      <div className="ac-row-main">
        <span className="ac-row-title" style={danger ? { color: "#fb9a9a" } : null}>{title}</span>
        {sub && <span className="ac-row-sub">{sub}</span>}
      </div>
      {right || <Icon name="chevR" size={18} style={{ color: "var(--muted)" }} />}
    </button>
  );
}

function Profile({ go, toast, onSignOut }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(ME.name);
  const [email, setEmail] = useState(ME.email);
  const [phone, setPhone] = useState(ME.phone);
  const [addresses, setAddresses] = useState(ME.addresses);
  const idv = ME.idVerification;

  const save = () => {
    ME.name = name; ME.email = email; ME.phone = phone;
    setEditing(false);
    toast({ msg: "Profile updated", icon: "check" });
  };
  const setPrimary = (id) => {
    const next = addresses.map(a => ({ ...a, primary: a.id === id }));
    setAddresses(next); ME.addresses = next;
    toast({ msg: "Primary address updated", icon: "pin", tone: "#5b8cff" });
  };

  return (
    <div className="ac-screen">
      {/* Hero */}
      <Card pad={18} className="span-all">
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar name={ME.name} size={58} tone={ME.avatarTone} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 19, fontWeight: 600 }}>{name}</div>
            <div style={{ fontSize: 12.5, color: "var(--muted)" }}>Member since {fmtDate(ME.joined)}</div>
            <div style={{ display: "flex", gap: 7, marginTop: 7 }}>
              <Pill color="#b07cff">{ME.tier}</Pill>
              <Pill color="#34d399">ID Verified</Pill>
            </div>
          </div>
        </div>
      </Card>

      {/* Contact */}
      <Card pad={16}>
        <SectionTitle right={
          editing
            ? <button className="oz-link" onClick={save}>Save</button>
            : <button className="oz-link" onClick={() => setEditing(true)}>Edit</button>
        }>Contact info</SectionTitle>
        <div style={{ marginTop: 14 }}>
          {editing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Field label="Full name"><Input icon="user" value={name} onChange={setName} /></Field>
              <Field label="Email"><Input icon="mail" value={email} onChange={setEmail} type="email" /></Field>
              <Field label="Phone"><Input icon="phone" value={phone} onChange={setPhone} type="tel" /></Field>
            </div>
          ) : (
            <div className="ac-kv-stack">
              <KV icon="mail" label="Email" value={email} />
              <KV icon="phone" label="Phone" value={phone} />
            </div>
          )}
        </div>
      </Card>

      {/* Addresses */}
      <Card pad={16}>
        <SectionTitle right={<button className="oz-link" onClick={() => toast({ msg: "Add-address form opens here", icon: "pin", tone: "#5b8cff" })}>+ Add</button>}>Delivery addresses</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
          {addresses.map(a => (
            <div key={a.id} style={{ display: "flex", gap: 12, padding: 13, borderRadius: 13, background: a.primary ? "rgba(176,124,255,.08)" : "rgba(0,0,0,.2)", border: "1px solid " + (a.primary ? "rgba(176,124,255,.34)" : "var(--line)") }}>
              <Icon name="pin" size={18} style={{ color: a.primary ? "var(--primary)" : "var(--muted)", flexShrink: 0, marginTop: 2 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 13.5 }}>{a.label}</span>
                  {a.primary && <span style={{ fontSize: 10, fontWeight: 800, color: "var(--primary)", letterSpacing: ".05em" }}>PRIMARY</span>}
                </div>
                <div style={{ fontSize: 12.5, color: "var(--text-2)", marginTop: 2 }}>{a.line1}{a.line2 ? ", " + a.line2 : ""}</div>
                <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{a.city}, {a.state} {a.zip}</div>
                {!a.primary && <button className="oz-link" style={{ marginTop: 7 }} onClick={() => setPrimary(a.id)}>Set as primary</button>}
              </div>
              <button className="ac-back" style={{ width: 32, height: 32, borderRadius: 9 }} onClick={() => toast({ msg: "Editing " + a.label + " address", icon: "edit", tone: "#b07cff" })} aria-label="Edit"><Icon name="edit" size={15} /></button>
            </div>
          ))}
        </div>
      </Card>

      {/* ID verification status banner */}
      <Card pad={16} hover onClick={() => go("idverify")}>
        <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
          <span className="ac-quick-ic" style={{ width: 44, height: 44, background: "rgba(52,211,153,.16)", borderColor: "rgba(52,211,153,.45)", color: "var(--green)" }}><Icon name="shieldCheck" size={22} /></span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>ID Verified</div>
            <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{idv.method} · expires {fmtDate(idv.expiresAt)}</div>
          </div>
          <Icon name="chevR" size={18} style={{ color: "var(--muted)" }} />
        </div>
      </Card>

      {/* Settings list */}
      <Card pad={0}>
        <ProfileRow icon="card" tone="#5b8cff" title="Payment methods" sub={ME.payment.methods.find(m => m.id === ME.payment.preferred)?.label + " · preferred"} onClick={() => go("pay")} />
        <hr className="ac-divider" />
        <ProfileRow icon="heart" tone="#fb7185" title="Favorites" sub={ME.favorites.length + " saved products"} onClick={() => go("favorites")} />
        <hr className="ac-divider" />
        <ProfileRow icon="shield" tone="#b07cff" title="ID verification" sub="Verified" onClick={() => go("idverify")} />
        <hr className="ac-divider" />
        <ProfileRow icon="msg" tone="#34d399" title="Contact support" sub="Chat, text, or call" onClick={() => go("support")} />
      </Card>

      <Button variant="danger" full icon="logout" onClick={onSignOut}>Sign out</Button>
      <div style={{ textAlign: "center", fontSize: 11, color: "var(--muted)", paddingBottom: 4 }}>ORBITZ · v1.0 · 21+ only · DC · MD · VA</div>
    </div>
  );
}

// ---------- ID Verification ----------
function IDVerification({ go, toast }) {
  const idv = ME.idVerification;
  const [uploaded, setUploaded] = useState(true);
  const statusMap = {
    verified: { color: "var(--green)", icon: "shieldCheck", label: "Verified", sub: "Your ID is approved. You're cleared for delivery." },
    pending:  { color: "var(--amber)", icon: "clock",       label: "Under review", sub: "We're reviewing your ID — usually under an hour." },
    none:     { color: "var(--muted)", icon: "shield",      label: "Not verified", sub: "Upload a government ID to start ordering." },
  };
  const st = statusMap[idv.status];
  return (
    <div className="ac-screen">
      {/* status hero */}
      <div className="oz-card span-all" style={{ padding: 22, textAlign: "center", borderColor: st.color + "55", background: st.color + "12" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", display: "grid", placeItems: "center", margin: "0 auto 14px", background: st.color + "22", border: "1px solid " + st.color + "55", color: st.color }}>
          <Icon name={st.icon} size={32} />
        </div>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 600, color: st.color }}>{st.label}</div>
        <div style={{ fontSize: 13, color: "var(--text-2)", marginTop: 6, maxWidth: 280, marginInline: "auto" }}>{st.sub}</div>
      </div>

      {/* document on file */}
      <Card pad={16}>
        <SectionTitle right={idv.status === "verified" ? <Pill color="#34d399">On file</Pill> : null}>Your document</SectionTitle>
        <div style={{ marginTop: 14 }}>
          <FilePlaceholder filename="drivers_license.jpg" caption={uploaded ? "Uploaded " + fmtDate(idv.uploadedAt) : "No document uploaded"} height={160} uploaded={uploaded} />
        </div>
        <div className="ac-kv-stack" style={{ marginTop: 16 }}>
          <KV icon="card" label="Document type" value={idv.method} />
          <KV icon="clock" label="Expires" value={fmtDate(idv.expiresAt)} />
        </div>
      </Card>

      {/* upload new */}
      <Card pad={16}>
        <SectionTitle>Replace document</SectionTitle>
        <div style={{ marginTop: 14 }}>
          <div className="ac-drop" onClick={() => { setUploaded(true); toast({ msg: "new_id.jpg uploaded · pending review", icon: "upload", tone: "#b07cff" }); }}>
            <span className="ac-quick-ic" style={{ background: "rgba(176,124,255,.14)", borderColor: "rgba(176,124,255,.4)", color: "var(--primary)" }}><Icon name="upload" size={20} /></span>
            <span className="ac-drop-title">Upload a new ID</span>
            <span className="ac-drop-sub">JPG or PNG · front of a government-issued ID</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 9, marginTop: 14, padding: 12, borderRadius: 12, background: "rgba(91,140,255,.08)", border: "1px solid rgba(91,140,255,.25)" }}>
          <Icon name="shield" size={16} style={{ color: "var(--blue)", flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.5 }}>Your ID is encrypted and only used to confirm you're 21+. We never share it.</span>
        </div>
      </Card>
    </div>
  );
}

Object.assign(window, { Profile, IDVerification, ProfileRow });
