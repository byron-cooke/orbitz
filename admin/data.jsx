// ╔══════════════════════════════════════════════════════════════════════╗
// ║  ORBITZ ADMIN — MOCK DATA STORE                                        ║
// ║  ------------------------------------------------------------------    ║
// ║  THIS IS THE ONLY FILE CONTAINING FAKE / DEMO DATA.                    ║
// ║  Everything the dashboard renders (orders, customers, products,        ║
// ║  drivers, rewards, zones) is hard-coded below as plain JS arrays.      ║
// ║                                                                        ║
// ║  To go live: replace the arrays in this file with calls to your        ║
// ║  Supabase client (see README.md → "Connecting to Supabase").           ║
// ║  No other file needs to change — screens read from these exports.      ║
// ╚══════════════════════════════════════════════════════════════════════╝
// Design tokens + helpers also live here and are exposed on window.

const ORBITZ_STATUS = {
  new:               { label: "New",             color: "#9aa6c4", glow: "rgba(154,166,196,.18)" },
  confirmed:         { label: "Confirmed",       color: "#5b8cff", glow: "rgba(91,140,255,.20)" },
  payment_verified:  { label: "Payment Verified",color: "#22d3ee", glow: "rgba(34,211,238,.18)" },
  packed:            { label: "Packed",          color: "#f5b945", glow: "rgba(245,185,69,.18)" },
  out_for_delivery:  { label: "Out for Delivery",color: "#b07cff", glow: "rgba(176,124,255,.22)" },
  delivered:         { label: "Delivered",       color: "#34d399", glow: "rgba(52,211,153,.18)" },
  cancelled:         { label: "Cancelled",       color: "#f87171", glow: "rgba(248,113,113,.18)" },
};
const ORBITZ_FLOW = ["new","confirmed","payment_verified","packed","out_for_delivery","delivered"];

// ---------- helpers ----------
const fmtMoney = (n) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtMoney0 = (n) => "$" + Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 });
const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const fmtTime = (iso) => new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
const fmtDateTime = (iso) => fmtDate(iso) + " · " + fmtTime(iso);
const ago = (iso) => {
  const m = Math.round((Date.now() - new Date(iso)) / 60000);
  if (m < 60) return m + "m ago";
  const h = Math.round(m / 60); if (h < 24) return h + "h ago";
  return Math.round(h / 24) + "d ago";
};
const initials = (name) => name.split(" ").map(w => w[0]).slice(0,2).join("").toUpperCase();

// ---------- delivery zones ----------
const ZONES = [
  { id: "z1", name: "Washington, DC",        counties: ["DC"],                fee: 0,  eta: 30, active: true },
  { id: "z2", name: "Prince George's County",counties: ["MD"],                fee: 5,  eta: 45, active: true },
  { id: "z3", name: "Montgomery County",     counties: ["MD"],                fee: 5,  eta: 50, active: true },
  { id: "z4", name: "Northern Virginia",     counties: ["VA"],                fee: 10, eta: 60, active: false },
];

// ---------- drivers ----------
const DRIVERS = [
  { id: "d1", name: "Marcus Thorne",  phone: "(202) 555-0142", vehicle: "Tesla Model 3 · Silver",   available: true,  rating: 4.98 },
  { id: "d2", name: "Yuki Tanaka",    phone: "(240) 555-0188", vehicle: "Honda Civic · Black",       available: true,  rating: 4.92 },
  { id: "d3", name: "Andre Bishop",   phone: "(301) 555-0119", vehicle: "Toyota Prius · White",      available: false, rating: 4.87 },
  { id: "d4", name: "Lena Vasquez",   phone: "(703) 555-0177", vehicle: "Rivian R1S · Blue",         available: true,  rating: 4.95 },
];

// ---------- products ----------
const PRODUCTS = [
  { id: "p1", name: "Zashimi",        category: "flower",      strain: "hybrid", thc: 28, cbd: 0.4, price: 55, inv: 42, active: true,  tone: "#3b82f6", emoji: "🌊" },
  { id: "p2", name: "Zoap",          category: "flower",      strain: "hybrid", thc: 26, cbd: 0.2, price: 50, inv: 28, active: true,  tone: "#a78bfa", emoji: "🫧" },
  { id: "p3", name: "Dilsh",         category: "flower",      strain: "indica", thc: 31, cbd: 0.1, price: 48, inv: 9,  active: true,  tone: "#f472b6", emoji: "🍬" },
  { id: "p4", name: "Orbitz Gummies",category: "edible",      strain: "indica", thc: 10, cbd: 5,   price: 30, inv: 64, active: true,  tone: "#fb7185", emoji: "🍭" },
  { id: "p5", name: "Live Resin Cart",category: "vape",       strain: "sativa", thc: 85, cbd: 0,   price: 55, inv: 3,  active: true,  tone: "#38bdf8", emoji: "💎" },
  { id: "p6", name: "Lunar Pre-Roll", category: "preroll",    strain: "hybrid", thc: 24, cbd: 0.3, price: 18, inv: 120,active: true,  tone: "#c084fc", emoji: "🚀" },
  { id: "p7", name: "Nebula Shatter", category: "concentrate",strain: "indica", thc: 78, cbd: 0,   price: 65, inv: 14, active: true,  tone: "#818cf8", emoji: "✨" },
  { id: "p8", name: "Comet Kush",     category: "flower",     strain: "sativa", thc: 29, cbd: 0.2, price: 52, inv: 0,  active: false, tone: "#34d399", emoji: "☄️" },
];
const productById = (id) => PRODUCTS.find(p => p.id === id);

// ---------- customers ----------
const CUSTOMERS = [
  { id: "c1", name: "Kevin Mensah",   phone: "(202) 555-0163", email: "kevin.m@email.com",   address: "1420 Columbia Rd NW, Washington, DC 20009", points: 2840, status: "active",  joined: "2025-09-12" },
  { id: "c2", name: "Danielle Rivers",phone: "(703) 555-0124", email: "drivers@email.com",   address: "2200 Wilson Blvd, Arlington, VA 22201",     points: 1310, status: "active",  joined: "2025-11-03" },
  { id: "c3", name: "DeShawn Avery",  phone: "(301) 555-0190", email: "deshawn.a@email.com", address: "7500 Wisconsin Ave, Bethesda, MD 20814",     points: 980,  status: "active",  joined: "2026-01-22" },
  { id: "c4", name: "Priya Nadira",   phone: "(202) 555-0145", email: "priya.n@email.com",   address: "900 F St NW, Washington, DC 20004",          points: 4205, status: "active",  joined: "2025-06-08" },
  { id: "c5", name: "Marcus Webb",    phone: "(240) 555-0111", email: "m.webb@email.com",     address: "6100 Greenbelt Rd, College Park, MD 20740",  points: 240,  status: "flagged", joined: "2026-04-15" },
  { id: "c6", name: "Sofia Cruz",     phone: "(202) 555-0177", email: "sofia.c@email.com",   address: "1500 14th St NW, Washington, DC 20005",      points: 1620, status: "active",  joined: "2025-12-19" },
  { id: "c7", name: "Tariq Hassan",   phone: "(301) 555-0156", email: "tariq.h@email.com",   address: "8200 Wisconsin Ave, Silver Spring, MD 20910",points: 560,  status: "active",  joined: "2026-02-28" },
  { id: "c8", name: "Bianca Lowe",    phone: "(703) 555-0133", email: "bianca.l@email.com",  address: "4100 Fairfax Dr, Arlington, VA 22203",       points: 3090, status: "active",  joined: "2025-08-01" },
];
const customerById = (id) => CUSTOMERS.find(c => c.id === id);

// ---------- orders ----------
// helper to build an order
let _ordSeq = 2041;
function mkOrder(o) {
  const items = o.items.map(([pid, qty]) => {
    const p = productById(pid);
    return { productId: pid, qty, unitPrice: p.price, lineTotal: p.price * qty };
  });
  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const zone = ZONES.find(z => z.id === o.zoneId);
  const deliveryFee = zone ? zone.fee : 0;
  const tax = +(subtotal * 0.06).toFixed(2);
  const total = +(subtotal + tax + deliveryFee).toFixed(2);
  return {
    id: o.id, number: "ORB-" + (_ordSeq++),
    customerId: o.customerId, status: o.status, zoneId: o.zoneId,
    driverId: o.driverId || null, paymentMethod: o.payment,
    items, subtotal, tax, deliveryFee, total,
    createdAt: o.createdAt, updatedAt: o.updatedAt || o.createdAt,
    address: customerById(o.customerId).address,
    proof: o.proof || null, // {method, verified}
    notes: o.notes || [],
    timeline: o.timeline || [],
  };
}

const NOW = new Date("2026-06-15T14:30:00");
const hrsAgo = (h) => new Date(NOW.getTime() - h * 3600000).toISOString();
const minAgo = (m) => new Date(NOW.getTime() - m * 60000).toISOString();

const ORDERS = [
  mkOrder({ id: "o1", customerId: "c1", status: "out_for_delivery", zoneId: "z1", driverId: "d1", payment: "card",
    items: [["p1",1],["p4",2]], createdAt: minAgo(95), updatedAt: minAgo(18),
    proof: { method: "Zelle", verified: true },
    notes: [{ author: "Yuki T.", body: "Customer asked for contactless drop at front desk.", at: minAgo(40) }],
    timeline: [["new",minAgo(95)],["confirmed",minAgo(82)],["payment_verified",minAgo(70)],["packed",minAgo(45)],["out_for_delivery",minAgo(18)]] }),
  mkOrder({ id: "o2", customerId: "c4", status: "payment_verified", zoneId: "z1", payment: "crypto",
    items: [["p5",1],["p7",1]], createdAt: minAgo(52), updatedAt: minAgo(12),
    proof: { method: "USDC", verified: true },
    timeline: [["new",minAgo(52)],["confirmed",minAgo(38)],["payment_verified",minAgo(12)]] }),
  mkOrder({ id: "o3", customerId: "c2", status: "new", zoneId: "z4", payment: "cash",
    items: [["p6",4]], createdAt: minAgo(22),
    proof: null,
    timeline: [["new",minAgo(22)]] }),
  mkOrder({ id: "o4", customerId: "c3", status: "confirmed", zoneId: "z3", payment: "card",
    items: [["p2",2],["p3",1]], createdAt: minAgo(64), updatedAt: minAgo(30),
    proof: { method: "CashApp", verified: false },
    timeline: [["new",minAgo(64)],["confirmed",minAgo(30)]] }),
  mkOrder({ id: "o5", customerId: "c6", status: "packed", zoneId: "z1", driverId: null, payment: "card",
    items: [["p4",3],["p1",1]], createdAt: minAgo(110), updatedAt: minAgo(25),
    proof: { method: "Zelle", verified: true },
    timeline: [["new",minAgo(110)],["confirmed",minAgo(95)],["payment_verified",minAgo(60)],["packed",minAgo(25)]] }),
  mkOrder({ id: "o6", customerId: "c8", status: "delivered", zoneId: "z4", driverId: "d4", payment: "card",
    items: [["p7",1],["p6",2]], createdAt: hrsAgo(5), updatedAt: hrsAgo(3),
    proof: { method: "Zelle", verified: true },
    timeline: [["new",hrsAgo(5)],["confirmed",hrsAgo(4.7)],["payment_verified",hrsAgo(4.4)],["packed",hrsAgo(4)],["out_for_delivery",hrsAgo(3.6)],["delivered",hrsAgo(3)]] }),
  mkOrder({ id: "o7", customerId: "c7", status: "delivered", zoneId: "z3", driverId: "d2", payment: "cash",
    items: [["p3",2]], createdAt: hrsAgo(7), updatedAt: hrsAgo(5),
    proof: { method: "Cash on delivery", verified: true },
    timeline: [["new",hrsAgo(7)],["confirmed",hrsAgo(6.6)],["payment_verified",hrsAgo(6)],["packed",hrsAgo(5.6)],["out_for_delivery",hrsAgo(5.4)],["delivered",hrsAgo(5)]] }),
  mkOrder({ id: "o8", customerId: "c5", status: "cancelled", zoneId: "z2", payment: "card",
    items: [["p5",2]], createdAt: hrsAgo(9), updatedAt: hrsAgo(8),
    proof: { method: "CashApp", verified: false },
    notes: [{ author: "Andre B.", body: "Payment proof did not match order total. Customer unresponsive — cancelled.", at: hrsAgo(8) }],
    timeline: [["new",hrsAgo(9)],["confirmed",hrsAgo(8.6)],["cancelled",hrsAgo(8)]] }),
  mkOrder({ id: "o9", customerId: "c1", status: "delivered", zoneId: "z1", driverId: "d1", payment: "card",
    items: [["p1",2],["p4",1]], createdAt: hrsAgo(28), updatedAt: hrsAgo(26),
    proof: { method: "Zelle", verified: true },
    timeline: [["delivered",hrsAgo(26)]] }),
  mkOrder({ id: "o10", customerId: "c6", status: "new", zoneId: "z1", payment: "crypto",
    items: [["p2",1]], createdAt: minAgo(8),
    proof: { method: "USDC", verified: false },
    timeline: [["new",minAgo(8)]] }),
  mkOrder({ id: "o11", customerId: "c8", status: "out_for_delivery", zoneId: "z4", driverId: "d4", payment: "card",
    items: [["p6",6]], createdAt: minAgo(130), updatedAt: minAgo(35),
    proof: { method: "Zelle", verified: true },
    timeline: [["new",minAgo(130)],["confirmed",minAgo(118)],["payment_verified",minAgo(100)],["packed",minAgo(60)],["out_for_delivery",minAgo(35)]] }),
  mkOrder({ id: "o12", customerId: "c3", status: "confirmed", zoneId: "z3", payment: "card",
    items: [["p7",1],["p1",1]], createdAt: minAgo(44), updatedAt: minAgo(20),
    proof: { method: "CashApp", verified: false },
    timeline: [["new",minAgo(44)],["confirmed",minAgo(20)]] }),
];
const orderById = (id) => ORDERS.find(o => o.id === id);

// rewards transactions (derived sample)
const REWARDS_TX = [
  { id: "rt1", customerId: "c1", orderId: "o9",  points: 119, reason: "Order ORB-2049 — earned", by: "system", at: hrsAgo(26) },
  { id: "rt2", customerId: "c1", orderId: null,  points: 250, reason: "Birthday bonus",          by: "Admin",  at: hrsAgo(48) },
  { id: "rt3", customerId: "c4", orderId: null,  points: -500,reason: "Redeemed — free eighth",  by: "Admin",  at: hrsAgo(72) },
  { id: "rt4", customerId: "c8", orderId: "o6",  points: 95,  reason: "Order ORB-2046 — earned", by: "system", at: hrsAgo(3) },
  { id: "rt5", customerId: "c5", orderId: null,  points: -200,reason: "Manual adjustment — dispute", by: "Admin", at: hrsAgo(80) },
];

// ---------- derived overview metrics ----------
function overviewStats() {
  const todays = ORDERS.filter(o => (NOW - new Date(o.createdAt)) < 24*3600000);
  const pending = ORDERS.filter(o => ["new","confirmed","payment_verified","packed"].includes(o.status));
  const outForDelivery = ORDERS.filter(o => o.status === "out_for_delivery");
  const revenue = ORDERS.filter(o => o.status !== "cancelled").reduce((s,o)=>s+o.total,0);
  const newCustomers = CUSTOMERS.filter(c => (NOW - new Date(c.joined)) < 30*24*3600000).length;
  return { todays: todays.length, pending: pending.length, revenue, outForDelivery: outForDelivery.length, newCustomers };
}
const pendingCount = () => ORDERS.filter(o => ["new","confirmed","payment_verified","packed"].includes(o.status)).length;

Object.assign(window, {
  ORBITZ_STATUS, ORBITZ_FLOW, ZONES, DRIVERS, PRODUCTS, CUSTOMERS, ORDERS, REWARDS_TX,
  productById, customerById, orderById, overviewStats, pendingCount,
  fmtMoney, fmtMoney0, fmtDate, fmtTime, fmtDateTime, ago, initials, NOW,
});
