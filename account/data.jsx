// ╔══════════════════════════════════════════════════════════════════════╗
// ║  ORBITZ ACCOUNT — MOCK DATA STORE (customer-facing)                    ║
// ║  THE ONLY FILE WITH FAKE DATA. Signed in as Kevin Mensah (c1).         ║
// ║  Shapes mirror the admin store so a future Supabase swap is 1:1.       ║
// ╚══════════════════════════════════════════════════════════════════════╝

const ORBITZ_STATUS = {
  new:               { label: "Order Placed",     color: "#9aa6c4", glow: "rgba(154,166,196,.18)" },
  confirmed:         { label: "Confirmed",        color: "#5b8cff", glow: "rgba(91,140,255,.20)" },
  payment_verified:  { label: "Payment Verified", color: "#22d3ee", glow: "rgba(34,211,238,.18)" },
  packed:            { label: "Packed",           color: "#f5b945", glow: "rgba(245,185,69,.18)" },
  out_for_delivery:  { label: "Out for Delivery", color: "#b07cff", glow: "rgba(176,124,255,.22)" },
  delivered:         { label: "Delivered",        color: "#34d399", glow: "rgba(52,211,153,.18)" },
  cancelled:         { label: "Cancelled",        color: "#f87171", glow: "rgba(248,113,113,.18)" },
};
const ORBITZ_FLOW = ["new","confirmed","payment_verified","packed","out_for_delivery","delivered"];
const STEP_COPY = {
  new:              "We received your order",
  confirmed:        "ORBITZ confirmed your order",
  payment_verified: "Your payment was verified",
  packed:           "Your order is packed for launch",
  out_for_delivery: "Your courier is on the way",
  delivered:        "Delivered — enjoy the ride",
};

// ---------- helpers ----------
const fmtMoney = (n) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtMoney0 = (n) => "$" + Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 });
const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const fmtDateShort = (iso) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
const fmtTime = (iso) => new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
const fmtDateTime = (iso) => fmtDateShort(iso) + " · " + fmtTime(iso);
const ago = (iso) => {
  const m = Math.round((Date.now() - new Date(iso)) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return m + "m ago";
  const h = Math.round(m / 60); if (h < 24) return h + "h ago";
  return Math.round(h / 24) + "d ago";
};
const initials = (name) => name.split(" ").map(w => w[0]).slice(0,2).join("").toUpperCase();
const fromNow = (iso) => {
  const m = Math.round((new Date(iso) - Date.now()) / 60000);
  if (m <= 0) return "now";
  if (m < 60) return m + " min";
  const h = Math.floor(m / 60); return h + "h " + (m % 60) + "m";
};

// ---------- products (mirrors admin + landing menu) ----------
const PRODUCTS = [
  { id: "p1", name: "Zashimi",         category: "flower",      strain: "hybrid", thc: 28, size: "3.5g",   price: 55, tone: "#3b82f6", emoji: "🌊" },
  { id: "p2", name: "Zoap",            category: "flower",      strain: "hybrid", thc: 26, size: "3.5g",   price: 50, tone: "#a78bfa", emoji: "🫧" },
  { id: "p3", name: "Dlish",           category: "flower",      strain: "indica", thc: 31, size: "3.5g",   price: 48, tone: "#f472b6", emoji: "🍬" },
  { id: "p4", name: "Orbitz Gummies",  category: "edible",      strain: "indica", thc: 10, size: "10 pk",  price: 30, tone: "#fb7185", emoji: "🍭" },
  { id: "p5", name: "Live Resin Cart", category: "vape",        strain: "sativa", thc: 85, size: "1g",     price: 55, tone: "#38bdf8", emoji: "💎" },
  { id: "p6", name: "Lunar Pre-Roll",  category: "preroll",     strain: "hybrid", thc: 24, size: "1g",     price: 18, tone: "#c084fc", emoji: "🚀" },
  { id: "p7", name: "Nebula Shatter",  category: "concentrate", strain: "indica", thc: 78, size: "1g",     price: 65, tone: "#818cf8", emoji: "✨" },
];
const productById = (id) => PRODUCTS.find(p => p.id === id);

// ---------- the signed-in customer (Kevin Mensah, admin c1) ----------
const ME = {
  id: "c1",
  name: "Kevin Mensah",
  firstName: "Kevin",
  phone: "(202) 555-0163",
  email: "kevin.m@email.com",
  avatarTone: "#6f5cff",
  joined: "2025-09-12",
  points: 2840,
  tier: "Voyager",
  nextTier: "Cosmonaut",
  tierFloor: 2000,
  tierCeil: 3000,
  addresses: [
    { id: "a1", label: "Home",   line1: "1420 Columbia Rd NW", line2: "Apt 5B", city: "Washington", state: "DC", zip: "20009", note: "Buzz #5B, leave at front desk", primary: true },
    { id: "a2", label: "Work",   line1: "900 F St NW",         line2: "Floor 3", city: "Washington", state: "DC", zip: "20004", note: "Ask for reception", primary: false },
  ],
  idVerification: { status: "verified", method: "Driver's License", uploadedAt: "2025-09-12T10:20:00", expiresAt: "2029-04-02" },
  payment: {
    preferred: "zelle",
    methods: [
      { id: "zelle",  label: "Zelle",      detail: "kevin.m@email.com", emoji: "⚡" },
      { id: "cashapp",label: "Cash App",   detail: "$kevinm",           emoji: "💵" },
      { id: "crypto", label: "USDC",       detail: "0x7f…a91c",         emoji: "🪙" },
      { id: "cash",   label: "Cash on Delivery", detail: "Exact change appreciated", emoji: "💸" },
    ],
  },
  favorites: ["p1", "p4", "p5"],
  notifications: { drops: true, orderUpdates: true, rewards: true, marketing: false },
};

// ---------- helper to build an order ----------
const TAX_RATE = 0.06;
function mkOrder(o) {
  const items = o.items.map(([pid, qty]) => {
    const p = productById(pid);
    return { productId: pid, qty, unitPrice: p.price, lineTotal: p.price * qty };
  });
  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const deliveryFee = o.deliveryFee ?? 0;
  const tax = +(subtotal * TAX_RATE).toFixed(2);
  const total = +(subtotal + tax + deliveryFee).toFixed(2);
  return {
    id: o.id, number: o.number, status: o.status,
    items, subtotal, tax, deliveryFee, total,
    createdAt: o.createdAt, updatedAt: o.updatedAt || o.createdAt,
    eta: o.eta || null,
    addressId: o.addressId || "a1",
    paymentMethod: o.paymentMethod, proof: o.proof || null,
    driver: o.driver || null,
    zone: o.zone || "Washington, DC",
    timeline: (o.timeline || []).map(([s, t]) => ({ status: s, at: t })),
  };
}

const NOW = Date.now();
const minAgo = (m) => new Date(NOW - m * 60000).toISOString();
const minFromNow = (m) => new Date(NOW + m * 60000).toISOString();
const hrsAgo = (h) => new Date(NOW - h * 3600000).toISOString();
const daysAgo = (d) => new Date(NOW - d * 86400000).toISOString();

const DRIVER = { name: "Marcus Thorne", short: "Marcus T.", vehicle: "Tesla Model 3 · Silver", plate: "DMV·4920", rating: 4.98, phone: "(202) 555-0142", avatar: "👨‍🚀" };

const MY_ORDERS = [
  mkOrder({ id: "o1", number: "ORB-2061", status: "out_for_delivery", items: [["p1",1],["p4",2]],
    createdAt: minAgo(72), updatedAt: minAgo(14), eta: minFromNow(16), deliveryFee: 0,
    paymentMethod: "zelle", proof: { method: "Zelle", verified: true }, driver: DRIVER, zone: "Washington, DC",
    timeline: [["new",minAgo(72)],["confirmed",minAgo(64)],["payment_verified",minAgo(52)],["packed",minAgo(30)],["out_for_delivery",minAgo(14)]] }),
  mkOrder({ id: "o2", number: "ORB-2049", status: "delivered", items: [["p1",2],["p4",1]],
    createdAt: daysAgo(2), updatedAt: daysAgo(2), deliveryFee: 0,
    paymentMethod: "zelle", proof: { method: "Zelle", verified: true }, zone: "Washington, DC",
    timeline: [["new",daysAgo(2)],["confirmed",daysAgo(2)],["payment_verified",daysAgo(2)],["packed",daysAgo(2)],["out_for_delivery",daysAgo(2)],["delivered",daysAgo(2)]] }),
  mkOrder({ id: "o3", number: "ORB-2032", status: "delivered", items: [["p5",1],["p7",1]],
    createdAt: daysAgo(9), updatedAt: daysAgo(9), deliveryFee: 0,
    paymentMethod: "cashapp", proof: { method: "Cash App", verified: true }, zone: "Washington, DC",
    timeline: [["new",daysAgo(9)],["delivered",daysAgo(9)]] }),
  mkOrder({ id: "o4", number: "ORB-2018", status: "delivered", items: [["p6",2],["p3",1]],
    createdAt: daysAgo(18), updatedAt: daysAgo(18), deliveryFee: 0,
    paymentMethod: "zelle", proof: { method: "Zelle", verified: true }, zone: "Washington, DC",
    timeline: [["new",daysAgo(18)],["delivered",daysAgo(18)]] }),
  mkOrder({ id: "o5", number: "ORB-2005", status: "cancelled", items: [["p5",2]],
    createdAt: daysAgo(31), updatedAt: daysAgo(31), deliveryFee: 0,
    paymentMethod: "crypto", proof: { method: "USDC", verified: false }, zone: "Washington, DC",
    timeline: [["new",daysAgo(31)],["confirmed",daysAgo(31)],["cancelled",daysAgo(31)]] }),
];
const orderById = (id) => MY_ORDERS.find(o => o.id === id);
const activeOrder = () => MY_ORDERS.find(o => ["confirmed","payment_verified","packed","out_for_delivery"].includes(o.status));

// ---------- rewards ledger ----------
const REWARDS_TX = [
  { id: "rt1", points: 119,  reason: "Order ORB-2049 — earned",  at: daysAgo(2) },
  { id: "rt2", points: 250,  reason: "Birthday bonus",            at: daysAgo(6) },
  { id: "rt3", points: 95,   reason: "Order ORB-2032 — earned",  at: daysAgo(9) },
  { id: "rt4", points: -500, reason: "Redeemed — free eighth",    at: daysAgo(14) },
  { id: "rt5", points: 88,   reason: "Order ORB-2018 — earned",  at: daysAgo(18) },
  { id: "rt6", points: 50,   reason: "Referral — Danielle R.",    at: daysAgo(22) },
];
const REWARD_PERKS = [
  { id: "k1", cost: 500,  emoji: "🌿", title: "Free Eighth", sub: "3.5g house flower" },
  { id: "k2", cost: 300,  emoji: "🎁", title: "$15 Off",     sub: "Any order over $60" },
  { id: "k3", cost: 800,  emoji: "🚀", title: "Free Delivery x5", sub: "Five priority drops" },
  { id: "k4", cost: 1200, emoji: "💎", title: "Mystery Drop", sub: "Limited curated box" },
];

Object.assign(window, {
  ORBITZ_STATUS, ORBITZ_FLOW, STEP_COPY, PRODUCTS, ME, MY_ORDERS, REWARDS_TX, REWARD_PERKS, DRIVER,
  productById, orderById, activeOrder,
  fmtMoney, fmtMoney0, fmtDate, fmtDateShort, fmtTime, fmtDateTime, ago, fromNow, initials,
});
