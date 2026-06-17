// ORBITZ Account — Track Delivery
function TrackDelivery({ params, go, toast }) {
  const o = orderById(params?.id) || activeOrder();
  if (!o) return <Empty icon="truck" label="No active delivery to track." />;
  const addr = ME.addresses.find(a => a.id === o.addressId) || ME.addresses[0];
  const d = o.driver || DRIVER;
  const idx = ORBITZ_FLOW.indexOf(o.status);
  const pct = Math.round(((idx + 1) / ORBITZ_FLOW.length) * 100);
  const steps = ORBITZ_FLOW.map(s => {
    const hit = o.timeline.find(t => t.status === s);
    return { status: s, label: STEP_COPY[s], time: hit ? fmtTime(hit.at) : null };
  });

  return (
    <div className="ac-screen">
      {/* ETA hero */}
      <div className="ac-hero" style={{ textAlign: "center" }}>
        <div className="ac-hero-glow" />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 12.5, color: "var(--text-2)", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase" }}>Arriving in</div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 46, fontWeight: 600, lineHeight: 1.05, margin: "4px 0 2px" }}>{fromNow(o.eta)}</div>
          <StatusBadge status={o.status} />
        </div>
      </div>

      {/* Map */}
      <div className="ac-map">
        <div className="ac-map-grid" />
        <div className="ac-map-route" />
        <div className="ac-map-home" style={{ right: "13%", top: "16%" }}>🏠</div>
        <div className="ac-map-ship" style={{ left: "16%", bottom: "16%" }}>{d.avatar}</div>
        <div className="ac-pulse" style={{ left: "calc(16% + 4px)", bottom: "calc(16% + 6px)" }} />
        <div style={{ position: "absolute", left: 12, bottom: 12, display: "flex", gap: 8 }}>
          <span className="oz-pill" style={{ color: "var(--green)", background: "rgba(52,211,153,.16)", borderColor: "rgba(52,211,153,.4)" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 8px var(--green)" }} /> Live
          </span>
        </div>
        <div style={{ position: "absolute", right: 12, top: 12, fontSize: 10.5, fontFamily: "'JetBrains Mono',monospace", color: "var(--muted)", background: "rgba(0,0,0,.4)", padding: "4px 8px", borderRadius: 7, border: "1px solid var(--line)" }}>
          2.4 mi away
        </div>
      </div>

      {/* progress */}
      <Card pad={16}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>{o.number}</span>
          <span className="mono" style={{ fontSize: 12.5, color: "var(--primary)", fontWeight: 600 }}>{pct}%</span>
        </div>
        <div className="ac-prog"><div className="ac-prog-fill" style={{ width: pct + "%" }} /></div>
      </Card>

      {/* Driver card */}
      <Card pad={16}>
        <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
          <div style={{ width: 50, height: 50, borderRadius: 15, display: "grid", placeItems: "center", fontSize: 26, background: "rgba(176,124,255,.14)", border: "1px solid rgba(176,124,255,.34)" }}>{d.avatar}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{d.name}</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{d.vehicle}</div>
            <div style={{ fontSize: 12, color: "var(--amber)", fontWeight: 700, marginTop: 2 }}>★ {d.rating} · Certified courier</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button className="ac-back" onClick={() => toast({ msg: "Calling " + d.short + "…", icon: "phone", tone: "#34d399" })} aria-label="Call driver"><Icon name="phone" size={18} /></button>
            <button className="ac-back" onClick={() => toast({ msg: "Opening chat with " + d.short, icon: "msg", tone: "#5b8cff" })} aria-label="Message driver"><Icon name="msg" size={18} /></button>
          </div>
        </div>
      </Card>

      {/* Drop-off */}
      <Card pad={16}>
        <SectionTitle>Dropping off at</SectionTitle>
        <div className="ac-kv-stack" style={{ marginTop: 14 }}>
          <KV icon="pin" label={addr.label} value={`${addr.line1}${addr.line2 ? ", " + addr.line2 : ""}, ${addr.city} ${addr.state} ${addr.zip}`} />
          {addr.note && <KV icon="msg" label="Note for courier" value={addr.note} />}
        </div>
      </Card>

      {/* Steps */}
      <Card pad={16}>
        <SectionTitle>Live progress</SectionTitle>
        <div style={{ marginTop: 16 }}><Timeline steps={steps} current={o.status} /></div>
      </Card>

      <Button variant="ghost" full icon="receipt" onClick={() => go("order", { id: o.id })}>View order details</Button>
    </div>
  );
}

Object.assign(window, { TrackDelivery });
