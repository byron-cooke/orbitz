// ORBITZ Shop — product detail modal

function PotencyBars({ p }) {
  if (p.category === "accessory") return null;
  const unit = p.category === "edible" ? "mg" : "%";
  const thcMax = p.category === "edible" ? 100 : 100;
  const rows = [];
  if (p.thc != null) rows.push({ lb: "THC", val: p.thc, unit, pct: Math.min(100, (p.thc / thcMax) * 100), color: "linear-gradient(90deg,var(--p2),var(--p))" });
  if (p.cbd != null) rows.push({ lb: "CBD", val: p.cbd, unit, pct: Math.min(100, (p.cbd / (p.category === "edible" ? 50 : 20)) * 100), color: "linear-gradient(90deg,#22c55e,var(--grn))" });
  return (
    <div className="potbars">
      {rows.map(r => (
        <div className="potbar-row" key={r.lb}>
          <span className="potbar-lb">{r.lb}</span>
          <span className="potbar-track"><span className="potbar-fill" style={{ width: r.pct + "%", background: r.color }} /></span>
          <span className="potbar-val">{r.val}{r.unit}</span>
        </div>
      ))}
    </div>
  );
}

function ReviewAggregate({ p }) {
  // distribution skewed toward 5★ for a deterministic feel
  const dist = [0,0,0,0,0];
  p.reviews.forEach(r => dist[r.rating - 1]++);
  const total = p.reviews.length;
  return (
    <div className="rev-aggregate">
      <div style={{ textAlign: "center" }}>
        <div className="rev-big">{p.rating}</div>
        <Stars rating={p.rating} size={13} />
        <div style={{ fontSize: 11, color: "var(--t3)", marginTop: 4 }}>{p.reviewCount} reviews</div>
      </div>
      <div className="rev-bars">
        {[5,4,3,2,1].map(star => (
          <div className="rev-bar-row" key={star}>
            <span className="n">{star}</span>
            <Icon name="star" size={10} fill="var(--gold)" stroke={0} style={{ color: "var(--gold)" }} />
            <span className="rev-bar-track"><span className="rev-bar-fill" style={{ width: total ? (dist[star-1]/total)*100 + "%" : (star === 5 ? "82%" : star === 4 ? "13%" : "3%") }} /></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductModal({ p, fav, onFav, onAdd, onClose, onOpen }) {
  const [qty, setQty] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);
  const [added, setAdded] = useState(false);
  const isGear = p.category === "accessory";

  useEffect(() => { setQty(1); setActiveThumb(0); setAdded(false); }, [p.id]);
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  const related = (p.related || []).map(productById).filter(Boolean);
  const add = () => { onAdd(p, qty); setAdded(true); setTimeout(() => setAdded(false), 1200); };
  const save = p.origPrice ? Math.round((1 - p.price / p.origPrice) * 100) : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close"><Icon name="x" size={18} stroke={2.4} /></button>

        <div className="modal-grid">
          {/* gallery */}
          <div className="modal-gallery">
            <div className="modal-hero"><ProductShot tone={p.tone} category={p.category} /></div>
            <div className="modal-thumbs">
              {[0,1,2,3].map(i => (
                <button key={i} className={"modal-thumb" + (activeThumb === i ? " on" : "")} onClick={() => setActiveThumb(i)} aria-label={"View angle " + (i+1)}>
                  <ProductShot tone={p.tone} category={p.category} compact ring={i === 0} />
                </button>
              ))}
            </div>
          </div>

          {/* info */}
          <div className="modal-info">
            <div className="modal-brand">{p.brand}</div>
            <h2 className="modal-name">{p.name}</h2>

            <div className="modal-rating">
              {p.deal ? <span className="scard-deal" style={{ position: "static" }}>Deal</span> : <StrainBadge strain={p.strain} inline />}
              {!isGear && <><Stars rating={p.rating} /><span className="modal-rating-txt"><b>{p.rating}</b> · {p.reviewCount} reviews</span></>}
              {isGear && <span className="modal-rating-txt"><b>{p.rating}</b> · {p.reviewCount} reviews</span>}
            </div>

            <div className="modal-price">
              <span className="now">{fmtMoney0(p.price)}</span>
              {p.origPrice && <span className="was">{fmtMoney0(p.origPrice)}</span>}
              {save > 0 && <span className="save">Save {save}%</span>}
              {!isGear && <span className="scard-size" style={{ fontSize: 13 }}>· {p.size}</span>}
            </div>

            {!isGear && (
              <div className="modal-sec">
                <div className="modal-sec-title">Potency</div>
                <PotencyBars p={p} />
              </div>
            )}

            {p.effects && p.effects.length > 0 && (
              <div className="modal-sec">
                <div className="modal-sec-title">Effects</div>
                <div className="chip-row">
                  {p.effects.map(e => <span key={e} className="effect-chip"><span className="dot" />{e}</span>)}
                </div>
              </div>
            )}

            {p.terpenes && p.terpenes.length > 0 && (
              <div className="modal-sec">
                <div className="modal-sec-title">Terpenes</div>
                <div className="terp-list">
                  {p.terpenes.map(t => {
                    const max = Math.max(...p.terpenes.map(x => x.pct));
                    return (
                      <div className="terp-row" key={t.name}>
                        <span className="terp-name">{t.name}</span>
                        <span className="terp-track"><span className="terp-fill" style={{ width: (t.pct / max) * 100 + "%" }} /></span>
                        <span className="terp-pct">{t.pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="modal-sec">
              <div className="modal-sec-title">Description</div>
              <p className="modal-desc">{p.description}</p>
            </div>

            {/* buy */}
            <div className="modal-buy">
              <div className="qty-stepper">
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Decrease"><Icon name="minus" size={16} stroke={2.6} /></button>
                <span className="qty-val">{qty}</span>
                <button className="qty-btn" onClick={() => setQty(q => Math.min(99, q + 1))} aria-label="Increase"><Icon name="plus" size={16} stroke={2.6} /></button>
              </div>
              <button className={"btn-add" + (added ? " added" : "")} onClick={add}>
                {added ? <><Icon name="check" size={18} stroke={3} />Added to cart</> : <><Icon name="bag" size={17} />Add {qty} · {fmtMoney0(p.price * qty)}</>}
              </button>
              <button className={"scard-fav" + (fav ? " on" : "")} style={{ position: "static", width: 50, height: 50, borderRadius: 13, flexShrink: 0 }}
                onClick={() => onFav(p.id)} aria-label={fav ? "Remove favorite" : "Add favorite"} aria-pressed={fav}>
                <Icon name="heart" size={20} fill={fav ? "currentColor" : "none"} stroke={2} />
              </button>
            </div>
          </div>
        </div>

        {/* reviews + related — full width */}
        <div style={{ padding: "4px 30px 30px" }}>
          {!isGear || p.reviews.length ? (
            <div className="modal-sec" style={{ borderTop: "1px solid rgba(255,255,255,.07)" }}>
              <div className="modal-sec-title">Reviews</div>
              <ReviewAggregate p={p} />
              <div className="rev-list">
                {p.reviews.map((r, i) => (
                  <div className="rev-card" key={i}>
                    <div className="rev-card-top">
                      <span className="rev-av" style={{ background: `linear-gradient(135deg, ${p.tone}, ${p.tone}66)` }}>{initials(r.author)}</span>
                      <div>
                        <div className="rev-author">{r.author}</div>
                        <div className="rev-meta">{r.loc} · {daysAgoLabel(r.daysAgo)}{r.verified && <> · <span className="rev-verified">✓ Verified</span></>}</div>
                      </div>
                      <span className="rev-stars-sm">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                    </div>
                    <p className="rev-body">{r.body}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {related.length > 0 && (
            <div className="modal-sec">
              <div className="modal-sec-title">You might also like</div>
              <div className="related-rail">
                {related.map(rp => (
                  <button key={rp.id} className="related-card" onClick={() => onOpen(rp)}>
                    <div className="related-img"><ProductShot tone={rp.tone} category={rp.category} compact /></div>
                    <div className="related-body">
                      <div className="related-name">{rp.name}</div>
                      <div className="related-price">{fmtMoney0(rp.price)}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ProductModal });
