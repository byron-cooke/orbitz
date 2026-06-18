// ╔══════════════════════════════════════════════════════════════════════╗
// ║  ORBITZ SHOP — MOCK CATALOG STORE                                      ║
// ║  THE ONLY FILE WITH FAKE DATA. Mock only — no backend, no Supabase.    ║
// ║  Product shape is a superset of /account + /admin so a future          ║
// ║  Supabase swap stays 1:1. Imagery uses labeled placeholders.           ║
// ╚══════════════════════════════════════════════════════════════════════╝

// ───────────────────────── taxonomy ─────────────────────────
const CATEGORIES = [
  { id: "all",         label: "All",          icon: "grid" },
  { id: "flower",      label: "Flower",       icon: "leaf" },
  { id: "preroll",     label: "Pre-Rolls",    icon: "bolt" },
  { id: "edible",      label: "Edibles",      icon: "gift" },
  { id: "vape",        label: "Vapes",        icon: "sparkle" },
  { id: "concentrate", label: "Concentrates", icon: "info" },
  { id: "accessory",   label: "Accessories",  icon: "sliders" },
  { id: "deals",       label: "Deals",        icon: "star" },
];

const STRAINS = [
  { id: "indica", label: "Indica" },
  { id: "sativa", label: "Sativa" },
  { id: "hybrid", label: "Hybrid" },
  { id: "cbd",    label: "CBD" },
];

const STRAIN_META = {
  indica: { label: "Indica", cls: "badge-indica" },
  sativa: { label: "Sativa", cls: "badge-sativa" },
  hybrid: { label: "Hybrid", cls: "badge-hybrid" },
  cbd:    { label: "CBD",    cls: "badge-cbd" },
};

const BRANDS = [
  "Orbitz Reserve", "Lunar Labs", "Stardust Co.", "Cosmo Farms",
  "Nebula Extracts", "Voyager Goods", "Eclipse",
];

// ───────────────────────── helpers ─────────────────────────
const fmtMoney  = (n) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtMoney0 = (n) => "$" + Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 });
const initials  = (name) => name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
const daysAgoLabel = (d) => {
  if (d <= 0) return "today";
  if (d === 1) return "yesterday";
  if (d < 7) return d + " days ago";
  if (d < 14) return "1 week ago";
  if (d < 30) return Math.round(d / 7) + " weeks ago";
  if (d < 60) return "1 month ago";
  return Math.round(d / 30) + " months ago";
};

const REWARDS_PER_DOLLAR = 10; // Orbitz Rewards: 10 pts per $1 — estimate shown in cart

// ───────────────────────── canned reviews ─────────────────────────
// deterministic pool; each product draws a small, on-brand set
const REVIEW_POOL = [
  { author: "Kevin Mensah", loc: "Washington, DC",  rating: 5, daysAgo: 4,  verified: true,  body: "Exactly as described. Fast delivery and the quality is consistently top tier — my new go-to." },
  { author: "Danielle Reyes", loc: "Arlington, VA", rating: 5, daysAgo: 11, verified: true,  body: "Smooth, clean, and the effects are dialed in just right. Reorder incoming." },
  { author: "DeShawn Riley", loc: "Bethesda, MD",   rating: 4, daysAgo: 19, verified: true,  body: "Really solid. Only knocked a star because I wish the pack was bigger — that good." },
  { author: "Aisha Karim", loc: "Silver Spring, MD", rating: 5, daysAgo: 7,  verified: true,  body: "Onset is so consistent. Couriers are always on time and discreet. 10/10." },
  { author: "Marcus Thorne", loc: "Washington, DC", rating: 5, daysAgo: 3,  verified: true,  body: "Frosty, gassy, perfectly balanced. Tastes like the strain, not like filler." },
  { author: "Priya Anand", loc: "Alexandria, VA",   rating: 4, daysAgo: 26, verified: true,  body: "Great value and even better vibe. Packaging is premium and lab results were right there." },
  { author: "Tomas Lind", loc: "Hyattsville, MD",   rating: 5, daysAgo: 9,  verified: false, body: "Did what it promised. Will be ordering again next drop." },
];
// product-specific lead reviews for flagship SKUs
const REVIEW_LEAD = {
  f1: { author: "Marcus Thorne", loc: "Washington, DC", rating: 5, daysAgo: 5, verified: true, body: "Zashimi is the wave. Frosted buds, gassy nose, balanced cerebral lift. Easily my favorite this month." },
  e1: { author: "Aisha Karim", loc: "Silver Spring, MD", rating: 5, daysAgo: 6, verified: true, body: "Best gummies in the DMV. 10mg is my perfect evening dose and the onset never surprises me." },
  v1: { author: "Tomas Lind", loc: "Alexandria, VA", rating: 5, daysAgo: 3, verified: true, body: "Live resin done right — full flavor, true to strain, none of that cart aftertaste." },
};
function buildReviews(p, i) {
  const lead = REVIEW_LEAD[p.id];
  const a = REVIEW_POOL[i % REVIEW_POOL.length];
  const b = REVIEW_POOL[(i + 3) % REVIEW_POOL.length];
  const base = [a, b].filter(r => !lead || r.author !== lead.author);
  return (lead ? [lead, ...base] : [a, b, REVIEW_POOL[(i + 5) % REVIEW_POOL.length]]).slice(0, 3);
}

// ───────────────────────── catalog ─────────────────────────
// fields: id, name, brand, category, strain, thc, cbd, price, origPrice?, size,
//         tone, rating, reviewCount, effects[], terpenes[{name,pct}], description,
//         featured?, related[]   →  deal + reviews are derived below
const RAW_PRODUCTS = [
  // ── FLOWER ──
  { id: "f1", name: "Zashimi", brand: "Orbitz Reserve", category: "flower", strain: "hybrid",
    thc: 29, cbd: 0.1, price: 55, size: "3.5g", tone: "#5b8cff", rating: 4.9, reviewCount: 214, featured: true,
    effects: ["Euphoric", "Relaxed", "Creative", "Happy"],
    terpenes: [{ name: "Caryophyllene", pct: 0.82 }, { name: "Limonene", pct: 0.64 }, { name: "Myrcene", pct: 0.41 }],
    description: "A top-shelf hybrid with a wave of citrus and gas. Dense, frosted buds bred for a balanced, cerebral lift that settles into full-body calm.",
    related: ["f2", "f3", "v1"] },
  { id: "f2", name: "Zoap", brand: "Lunar Labs", category: "flower", strain: "hybrid",
    thc: 26, cbd: 0.2, price: 50, size: "3.5g", tone: "#a78bfa", rating: 4.8, reviewCount: 168,
    effects: ["Giggly", "Uplifted", "Relaxed", "Social"],
    terpenes: [{ name: "Limonene", pct: 0.71 }, { name: "Linalool", pct: 0.5 }, { name: "Caryophyllene", pct: 0.39 }],
    description: "Soapy-sweet and effervescent. Zoap delivers a bubbly, social high that's perfect for a sunny afternoon without the couch-lock.",
    related: ["f1", "f3", "e1"] },
  { id: "f3", name: "Dlish", brand: "Cosmo Farms", category: "flower", strain: "indica",
    thc: 31, cbd: 0.1, price: 48, size: "3.5g", tone: "#f472b6", rating: 4.7, reviewCount: 142,
    effects: ["Sleepy", "Relaxed", "Hungry", "Calm"],
    terpenes: [{ name: "Myrcene", pct: 0.9 }, { name: "Caryophyllene", pct: 0.55 }, { name: "Pinene", pct: 0.3 }],
    description: "A dessert-grade indica with notes of vanilla and berry. Heavy-hitting and deeply sedative — a nightcap in flower form.",
    related: ["f1", "f2", "e2"] },
  { id: "f4", name: "Solar Flare", brand: "Stardust Co.", category: "flower", strain: "sativa",
    thc: 27, cbd: 0.0, price: 52, size: "3.5g", tone: "#fbbf24", rating: 4.8, reviewCount: 97, featured: true,
    effects: ["Energetic", "Focused", "Uplifted", "Creative"],
    terpenes: [{ name: "Terpinolene", pct: 0.78 }, { name: "Limonene", pct: 0.6 }, { name: "Ocimene", pct: 0.34 }],
    description: "A blazing daytime sativa. Bright tangerine terps fuel a clean, motivated head-high built for getting things done.",
    related: ["f1", "f5", "p1"] },
  { id: "f5", name: "Midnight OG", brand: "Orbitz Reserve", category: "flower", strain: "indica",
    thc: 30, cbd: 0.3, price: 58, size: "3.5g", tone: "#818cf8", rating: 4.9, reviewCount: 256, featured: true,
    effects: ["Sleepy", "Euphoric", "Relaxed", "Pain Relief"],
    terpenes: [{ name: "Myrcene", pct: 0.95 }, { name: "Linalool", pct: 0.62 }, { name: "Caryophyllene", pct: 0.48 }],
    description: "A legendary OG phenotype. Earthy pine and diesel give way to a weighty, blissful stone. Reserve-tier cure.",
    related: ["f3", "f1", "c1"] },

  // ── PRE-ROLLS ──
  { id: "p1", name: "Lunar Pre-Roll", brand: "Lunar Labs", category: "preroll", strain: "hybrid",
    thc: 24, cbd: 0.1, price: 18, size: "1g", tone: "#c084fc", rating: 4.6, reviewCount: 88,
    effects: ["Relaxed", "Happy", "Euphoric"],
    terpenes: [{ name: "Caryophyllene", pct: 0.6 }, { name: "Limonene", pct: 0.5 }],
    description: "A perfectly packed single of premium hybrid flower in an unbleached cone. Smooth, slow-burning, and ready for liftoff.",
    related: ["p2", "p3", "f1"] },
  { id: "p2", name: "Infused Diamond Roll", brand: "Nebula Extracts", category: "preroll", strain: "indica",
    thc: 42, cbd: 0.2, price: 28, size: "1g", tone: "#818cf8", rating: 4.8, reviewCount: 134, featured: true,
    effects: ["Sedated", "Euphoric", "Relaxed", "Tingly"],
    terpenes: [{ name: "Myrcene", pct: 0.7 }, { name: "Caryophyllene", pct: 0.52 }],
    description: "Flower dusted in THCA diamonds and coated in live resin. A high-potency roll for experienced explorers only.",
    related: ["p1", "c1", "c2"] },
  { id: "p3", name: "Sunrise 5-Pack", brand: "Stardust Co.", category: "preroll", strain: "sativa",
    thc: 22, cbd: 0.0, price: 45, origPrice: 55, size: "5 × 0.5g", tone: "#fbbf24", rating: 4.7, reviewCount: 76,
    effects: ["Energetic", "Uplifted", "Focused"],
    terpenes: [{ name: "Terpinolene", pct: 0.66 }, { name: "Limonene", pct: 0.55 }],
    description: "Five half-gram dogwalkers of bright sativa. Your daily-driver pack for errands, hikes, and creative sprints.",
    related: ["p1", "f4", "p2"] },

  // ── EDIBLES ──
  { id: "e1", name: "Orbitz Gummies", brand: "Voyager Goods", category: "edible", strain: "indica",
    thc: 10, cbd: 0, price: 30, size: "10 pk · 100mg", tone: "#fb7185", rating: 4.9, reviewCount: 312, featured: true,
    effects: ["Relaxed", "Happy", "Calm", "Sleepy"],
    terpenes: [{ name: "Linalool", pct: 0.4 }],
    description: "Our flagship gummy — 10mg per piece, ten per pack. Cosmic mixed-berry flavor with a clean, consistent onset.",
    related: ["e2", "e3", "f3"] },
  { id: "e2", name: "Galaxy Chocolate", brand: "Voyager Goods", category: "edible", strain: "hybrid",
    thc: 10, cbd: 0, price: 26, size: "10 pc · 100mg", tone: "#c084fc", rating: 4.7, reviewCount: 145,
    effects: ["Euphoric", "Relaxed", "Happy"],
    terpenes: [{ name: "Caryophyllene", pct: 0.3 }],
    description: "Single-origin dark chocolate squares, 10mg each. Rich, smooth, and precisely dosed for a mellow evening.",
    related: ["e1", "e3", "e4"] },
  { id: "e3", name: "Nebula Nano Drink", brand: "Voyager Goods", category: "edible", strain: "sativa",
    thc: 5, cbd: 0, price: 12, size: "12oz · 5mg", tone: "#38bdf8", rating: 4.5, reviewCount: 64,
    effects: ["Uplifted", "Social", "Energetic"],
    terpenes: [{ name: "Limonene", pct: 0.35 }],
    description: "Fast-acting nano-emulsified sparkling drink. Feels social and bright in 15 minutes — microdose-friendly at 5mg.",
    related: ["e1", "e2", "e4"] },
  { id: "e4", name: "Comet CBD Chews", brand: "Eclipse", category: "edible", strain: "cbd",
    thc: 2, cbd: 25, price: 34, size: "30 pk · CBD", tone: "#34d399", rating: 4.6, reviewCount: 81,
    effects: ["Calm", "Pain Relief", "Clear-Headed"],
    terpenes: [{ name: "Linalool", pct: 0.5 }, { name: "Pinene", pct: 0.3 }],
    description: "High-CBD, low-THC chews for daytime calm and recovery. No haze — just steady, grounded relief.",
    related: ["e1", "e2", "a3"] },

  // ── VAPES ──
  { id: "v1", name: "Live Resin Cart", brand: "Nebula Extracts", category: "vape", strain: "sativa",
    thc: 85, cbd: 0.2, price: 55, size: "1g", tone: "#38bdf8", rating: 4.8, reviewCount: 198, featured: true,
    effects: ["Energetic", "Euphoric", "Creative", "Focused"],
    terpenes: [{ name: "Terpinolene", pct: 1.2 }, { name: "Limonene", pct: 0.9 }, { name: "Ocimene", pct: 0.5 }],
    description: "Full-spectrum live resin in a 510 cart. Cold-cured to preserve terpenes — flavorful, potent, and true-to-strain.",
    related: ["v2", "v3", "c1"] },
  { id: "v2", name: "Stardust Disposable", brand: "Stardust Co.", category: "vape", strain: "hybrid",
    thc: 88, cbd: 0.1, price: 45, size: "1g", tone: "#c084fc", rating: 4.7, reviewCount: 156,
    effects: ["Relaxed", "Happy", "Euphoric"],
    terpenes: [{ name: "Caryophyllene", pct: 1.0 }, { name: "Limonene", pct: 0.7 }],
    description: "All-in-one rechargeable disposable. Ceramic coil, no fillers, draw-activated. Grab and go.",
    related: ["v1", "v3", "p1"] },
  { id: "v3", name: "Pod Battery Kit", brand: "Lunar Labs", category: "vape", strain: "hybrid",
    thc: 0, cbd: 0, price: 25, size: "Device", tone: "#a78bfa", rating: 4.6, reviewCount: 52,
    effects: [],
    terpenes: [],
    description: "Sleek 510-thread battery with adjustable voltage and USB-C fast charge. Pairs with any Orbitz cart.",
    related: ["v1", "v2", "a1"] },

  // ── CONCENTRATES ──
  { id: "c1", name: "Nebula Shatter", brand: "Nebula Extracts", category: "concentrate", strain: "indica",
    thc: 78, cbd: 0.4, price: 65, size: "1g", tone: "#818cf8", rating: 4.8, reviewCount: 109,
    effects: ["Euphoric", "Sedated", "Relaxed"],
    terpenes: [{ name: "Myrcene", pct: 1.1 }, { name: "Caryophyllene", pct: 0.8 }],
    description: "Glass-clear, snap-and-pull shatter. Solvent-purged to perfection for a clean, potent dab experience.",
    related: ["c2", "v1", "p2"] },
  { id: "c2", name: "Live Rosin Badder", brand: "Orbitz Reserve", category: "concentrate", strain: "hybrid",
    thc: 74, cbd: 0.6, price: 80, origPrice: 95, size: "1g", tone: "#a78bfa", rating: 4.9, reviewCount: 88, featured: true,
    effects: ["Euphoric", "Creative", "Relaxed", "Happy"],
    terpenes: [{ name: "Limonene", pct: 1.3 }, { name: "Caryophyllene", pct: 0.9 }, { name: "Linalool", pct: 0.4 }],
    description: "Solventless live rosin pressed from fresh-frozen flower. Whipped to a creamy badder — terpene-forward and full-flavored.",
    related: ["c1", "v1", "f5"] },

  // ── ACCESSORIES ──
  { id: "a1", name: "Borosilicate Spoon Pipe", brand: "Eclipse", category: "accessory", strain: null,
    thc: 0, cbd: 0, price: 35, size: "4in", tone: "#5b8cff", rating: 4.7, reviewCount: 41,
    effects: [],
    terpenes: [],
    description: "Hand-blown borosilicate glass with a galaxy fume finish. Deep bowl, comfortable carb, built to last.",
    related: ["a2", "a3", "v3"] },
  { id: "a2", name: "Orbitz Grinder", brand: "Eclipse", category: "accessory", strain: null,
    thc: 0, cbd: 0, price: 28, size: "4-piece", tone: "#a78bfa", rating: 4.8, reviewCount: 73,
    effects: [],
    terpenes: [],
    description: "Aircraft-grade aluminum 4-piece grinder with a kief catcher and diamond-cut teeth. Smooth magnetic lid.",
    related: ["a1", "a3", "p1"] },
  { id: "a3", name: "Rolling Kit", brand: "Voyager Goods", category: "accessory", strain: null,
    thc: 0, cbd: 0, price: 16, size: "Kit", tone: "#34d399", rating: 4.5, reviewCount: 38,
    effects: [],
    terpenes: [],
    description: "Everything for the perfect roll: organic hemp papers, filter tips, packing tool, and a discreet tin.",
    related: ["a1", "a2", "p1"] },
];

// derive deal flag + attach reviews
const PRODUCTS = RAW_PRODUCTS.map((p, i) => ({
  ...p,
  deal: !!p.origPrice,
  reviews: buildReviews(p, i),
}));

// ───────────────────────── derived helpers ─────────────────────────
const productById = (id) => PRODUCTS.find((p) => p.id === id);
const isDeal = (p) => !!p.deal;

const PRICE_MIN = 10;
const PRICE_MAX = Math.ceil(Math.max(...PRODUCTS.map(p => p.price)) / 10) * 10; // 80

function inCategory(p, catId) {
  if (catId === "all") return true;
  if (catId === "deals") return isDeal(p);
  return p.category === catId;
}
const categoryCount = (catId) => PRODUCTS.filter(p => inCategory(p, catId)).length;
const brandCount = (brand) => PRODUCTS.filter(p => p.brand === brand).length;

Object.assign(window, {
  CATEGORIES, STRAINS, STRAIN_META, BRANDS, PRODUCTS,
  productById, inCategory, categoryCount, brandCount, isDeal,
  PRICE_MIN, PRICE_MAX, REWARDS_PER_DOLLAR,
  fmtMoney, fmtMoney0, initials, daysAgoLabel,
});
