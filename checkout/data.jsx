// ╔══════════════════════════════════════════════════════════════════════╗
// ║  ORBITZ CHECKOUT — shared state model + mock data                      ║
// ║  Front-end only. Reads the live cart (orbitz_cart) written by /shop,   ║
// ║  persists a single `orbitz_checkout` object, and on place-order writes ║
// ║  `orbitz_order` (+ orbitz_orders[]) — the contract a backend replaces. ║
// ║  Product catalog + money helpers come from ../shop/data.jsx (loaded    ║
// ║  first), so cart lookups are identical to the shop.                    ║
// ╚══════════════════════════════════════════════════════════════════════╝

// ───────── localStorage keys ─────────
const CO_LS_CART     = "orbitz_cart";        // [{id, qty}]  — shared with /shop
const CO_LS_CHECKOUT = "orbitz_checkout";    // in-progress checkout object
const CO_LS_ORDER    = "orbitz_order";       // latest placed order
const CO_LS_ORDERS   = "orbitz_orders";      // all placed orders
const CO_LS_AUTH     = "orbitz_acct_authed"; // shared auth flag

// ───────── economics ─────────
const CO_TAX_RATE       = 0.06;              // DC cannabis tax (mock)
const CO_FREE_SHIP_OVER = 75;                // free delivery threshold
const CO_DELIVERY_FEE   = 5.99;              // standard delivery
const CO_PRIORITY_FEE   = 4.00;              // ASAP priority surcharge
const CO_POINTS_VALUE   = 0.01;              // 1 pt = $0.01 (100 pts = $1)
const CO_MAX_REWARD_PTS = 1500;              // cap redeemable per order

// ───────── the signed-in customer (Kevin Mensah — mirrors /account) ─────────
const CUSTOMER = {
  id: "c1", name: "Kevin Mensah", firstName: "Kevin",
  email: "kevin.m@email.com", phone: "(202) 555-0163",
  points: 2840, tier: "Voyager", avatarTone: "#6f5cff",
  addresses: [
    { id: "a1", label: "Home", line1: "1420 Columbia Rd NW", line2: "Apt 5B",
      city: "Washington", state: "DC", zip: "20009", note: "Buzz #5B, leave at front desk", primary: true },
    { id: "a2", label: "Work", line1: "900 F St NW", line2: "Floor 3",
      city: "Washington", state: "DC", zip: "20004", note: "Ask for reception", primary: false },
  ],
};

// ───────── delivery zones ─────────
const CO_ZONES = [
  { id: "dc", label: "Washington, DC",        live: true,  eta: "25–40 min" },
  { id: "pg", label: "Prince George's County, MD", live: true,  eta: "35–55 min" },
  { id: "mc", label: "Montgomery County, MD",  live: true,  eta: "35–55 min" },
  { id: "nva", label: "Northern Virginia",     live: false, eta: null },
];
const zoneById = (id) => CO_ZONES.find(z => z.id === id);

// ───────── scheduled delivery windows ─────────
const CO_WINDOWS = [
  { id: "w1", label: "Today · 4:00 – 5:00 PM" },
  { id: "w2", label: "Today · 6:00 – 7:00 PM" },
  { id: "w3", label: "Today · 8:00 – 9:00 PM" },
  { id: "w4", label: "Tomorrow · 12:00 – 1:00 PM" },
  { id: "w5", label: "Tomorrow · 3:00 – 4:00 PM" },
];

// ───────── payment methods ─────────
const CO_PAY_METHODS = [
  { id: "card",   label: "Credit / Debit Card", sub: "Visa, Mastercard, Amex", icon: "card" },
  { id: "apple",  label: "Apple Pay",           sub: "Touch / Face ID",        icon: "apple" },
  { id: "google", label: "Google Pay",          sub: "Pay with Google",        icon: "google" },
  { id: "cash",   label: "Cash on Delivery",    sub: "Exact change appreciated",icon: "cash" },
  { id: "crypto", label: "Crypto · USDC",       sub: "Pay from your wallet",    icon: "crypto" },
];
const payMethodById = (id) => CO_PAY_METHODS.find(m => m.id === id);
const CO_CRYPTO_WALLET = "0x9c4F…b1Ee21ORBZ"; // mock receiving address

// ───────── promo codes ─────────
const CO_PROMOS = {
  ORBIT10:   { kind: "pct",  value: 0.10, label: "10% off your order" },
  LIFTOFF15: { kind: "flat", value: 15,   label: "$15 off" },
  FREESHIP:  { kind: "ship", value: 0,    label: "Free delivery" },
  WELCOME20: { kind: "pct",  value: 0.20, label: "20% off — first order" },
};

// ───────── driver placeholder ─────────
const CO_DRIVER = { name: "Marcus Thorne", short: "Marcus T.", vehicle: "Tesla Model 3 · Silver",
  plate: "DMV·4920", rating: 4.98, avatar: "🧑‍🚀" };

// ═══════════════════ helpers ═══════════════════
function coLoad(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch (e) { return fallback; }
}
function coSave(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }

// read the live cart; seed a believable demo cart the first time if empty
function loadCart() {
  let cart = coLoad(CO_LS_CART, null);
  if (!Array.isArray(cart) || cart.length === 0) {
    cart = [{ id: "f1", qty: 1 }, { id: "e1", qty: 2 }, { id: "v1", qty: 1 }];
    coSave(CO_LS_CART, cart);
  }
  // drop any ids not in the catalog
  return cart.filter(l => productById(l.id));
}

// resolve cart lines → product-joined rows
function cartLines(cart) {
  return cart.map(l => ({ ...l, p: productById(l.id) })).filter(x => x.p);
}

// default in-progress checkout state
function defaultCheckout() {
  const home = CUSTOMER.addresses.find(a => a.primary) || CUSTOMER.addresses[0];
  return {
    delivery: {
      addressId: home.id,
      line1: home.line1, line2: home.line2, city: home.city, state: home.state, zip: home.zip,
      instructions: home.note || "",
      zone: "dc",
      timing: "asap",          // 'asap' | 'scheduled'
      window: "w1",
    },
    verification: { idFront: false, idBack: false, selfie: false, acknowledged: false },
    payment: {
      method: "card",
      card: { number: "", exp: "", cvv: "", zip: "", save: true },
    },
    promo: "",                 // applied code (uppercased) or ""
    rewardsApplied: false,
  };
}

function loadCheckout() {
  const saved = coLoad(CO_LS_CHECKOUT, null);
  const base = defaultCheckout();
  if (!saved) return base;
  // shallow-merge to tolerate older shapes
  return {
    ...base, ...saved,
    delivery: { ...base.delivery, ...(saved.delivery || {}) },
    verification: { ...base.verification, ...(saved.verification || {}) },
    payment: { ...base.payment, ...(saved.payment || {}), card: { ...base.payment.card, ...((saved.payment || {}).card || {}) } },
  };
}

// ═══════════════════ money math ═══════════════════
function computeTotals(cart, co) {
  const lines = cartLines(cart);
  const subtotal = lines.reduce((s, x) => s + x.p.price * x.qty, 0);

  // delivery
  let deliveryFee = subtotal >= CO_FREE_SHIP_OVER ? 0 : CO_DELIVERY_FEE;
  if (co.delivery.timing === "asap" && deliveryFee >= 0) deliveryFee += CO_PRIORITY_FEE;

  // promo
  const promo = co.promo && CO_PROMOS[co.promo] ? { code: co.promo, ...CO_PROMOS[co.promo] } : null;
  let discount = 0;
  if (promo) {
    if (promo.kind === "pct")  discount = subtotal * promo.value;
    if (promo.kind === "flat") discount = Math.min(promo.value, subtotal);
    if (promo.kind === "ship") { discount = 0; deliveryFee = 0; }
  }

  // rewards redemption
  const rewardPts = co.rewardsApplied ? Math.min(CO_MAX_REWARD_PTS, CUSTOMER.points) : 0;
  const rewardValue = rewardPts * CO_POINTS_VALUE;

  const taxableBase = Math.max(0, subtotal - discount);
  const tax = +(taxableBase * CO_TAX_RATE).toFixed(2);

  const total = Math.max(0, +(subtotal - discount + deliveryFee + tax - rewardValue).toFixed(2));
  const pointsEarned = Math.round(Math.max(0, subtotal - discount) * REWARDS_PER_DOLLAR);
  const itemCount = lines.reduce((s, x) => s + x.qty, 0);

  return { lines, itemCount, subtotal, deliveryFee, discount, promo, rewardPts, rewardValue, tax, total, pointsEarned,
    freeShip: deliveryFee === 0 };
}

// estimated arrival string for a checkout
function etaLabel(co) {
  if (co.delivery.timing === "scheduled") {
    const w = CO_WINDOWS.find(x => x.id === co.delivery.window);
    return w ? w.label : "Scheduled";
  }
  const z = zoneById(co.delivery.zone);
  return z && z.eta ? z.eta : "25–40 min";
}

// ═══════════════════ place order ═══════════════════
function genOrderNumber() {
  // continue the ORB-20xx series used across the MVP
  const prev = coLoad(CO_LS_ORDERS, []);
  const base = 2070 + prev.length;
  return "ORB-" + base;
}

function buildOrder(cart, co) {
  const t = computeTotals(cart, co);
  const number = genOrderNumber();
  const now = Date.now();
  const addr = co.delivery;
  return {
    id: "o_" + now,
    number,
    status: "new",
    placedAt: new Date(now).toISOString(),
    eta: etaLabel(co),
    items: t.lines.map(x => ({ productId: x.id, name: x.p.name, qty: x.qty, unitPrice: x.p.price, lineTotal: x.p.price * x.qty })),
    subtotal: t.subtotal, deliveryFee: t.deliveryFee, discount: t.discount,
    promo: t.promo ? t.promo.code : null, rewardsRedeemed: t.rewardPts, rewardValue: t.rewardValue,
    tax: t.tax, total: t.total, pointsEarned: t.pointsEarned,
    delivery: {
      address: `${addr.line1}${addr.line2 ? ", " + addr.line2 : ""}, ${addr.city} ${addr.state} ${addr.zip}`,
      instructions: addr.instructions, zone: zoneById(addr.zone)?.label || addr.zone,
      timing: addr.timing, window: addr.timing === "scheduled" ? (CO_WINDOWS.find(w => w.id === addr.window)?.label) : "ASAP",
    },
    payment: { method: co.payment.method, label: payMethodById(co.payment.method)?.label,
      last4: co.payment.method === "card" && co.payment.card.number ? co.payment.card.number.replace(/\s/g, "").slice(-4) : null },
    customer: { name: CUSTOMER.name, phone: CUSTOMER.phone, email: CUSTOMER.email },
    driver: CO_DRIVER,
  };
}

function placeOrder(cart, co) {
  const order = buildOrder(cart, co);
  coSave(CO_LS_ORDER, order);
  const all = coLoad(CO_LS_ORDERS, []);
  all.unshift(order);
  coSave(CO_LS_ORDERS, all);
  // clear the in-progress checkout + the live cart — the order is committed
  coSave(CO_LS_CART, []);
  localStorage.removeItem(CO_LS_CHECKOUT);
  return order;
}

Object.assign(window, {
  CO_LS_CART, CO_LS_CHECKOUT, CO_LS_ORDER, CO_LS_ORDERS, CO_LS_AUTH,
  CO_TAX_RATE, CO_FREE_SHIP_OVER, CO_DELIVERY_FEE, CO_PRIORITY_FEE, CO_POINTS_VALUE, CO_MAX_REWARD_PTS,
  CUSTOMER, CO_ZONES, zoneById, CO_WINDOWS, CO_PAY_METHODS, payMethodById, CO_CRYPTO_WALLET, CO_PROMOS, CO_DRIVER,
  coLoad, coSave, loadCart, cartLines, defaultCheckout, loadCheckout, computeTotals, etaLabel,
  genOrderNumber, buildOrder, placeOrder,
});
