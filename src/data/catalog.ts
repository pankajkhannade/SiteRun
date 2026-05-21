import type { JobType, Product } from "../types";

export const PRODUCTS: Product[] = [
  // PVC 4" drainage
  { id: "pvc-4-elbow", nameEn: "PVC Elbow 4\"", nameHi: "PVC एल्बो 4\"", category: "plumbing", price: 28, unit: "pc", emoji: "🔧" },
  { id: "pvc-4-coupling", nameEn: "PVC Coupling 4\"", nameHi: "PVC कपलिंग 4\"", category: "plumbing", price: 32, unit: "pc", emoji: "🔧" },
  { id: "pvc-4-tee", nameEn: "PVC Tee 4\"", nameHi: "PVC टी 4\"", category: "plumbing", price: 45, unit: "pc", emoji: "🔧" },
  { id: "pvc-4-union", nameEn: "PVC Union 4\"", nameHi: "PVC यूनियन 4\"", category: "plumbing", price: 52, unit: "pc", emoji: "🔧" },
  { id: "pvc-4-reducer", nameEn: "PVC Reducer 4\"×2\"", nameHi: "PVC रिड्यूसर 4×2\"", category: "plumbing", price: 38, unit: "pc", emoji: "🔧" },
  { id: "pvc-pipe-4", nameEn: "PVC Pipe 4\" (3m)", nameHi: "PVC पाइप 4\" (3m)", category: "plumbing", price: 420, unit: "pc", emoji: "📏" },
  { id: "pvc-pipe-4-6m", nameEn: "PVC Pipe 4\" (6m)", nameHi: "PVC पाइप 4\" (6m)", category: "plumbing", price: 780, unit: "pc", emoji: "📏" },
  { id: "pvc-solvent", nameEn: "PVC Solvent Cement 1L", nameHi: "PVC सॉल्वेंट 1L", category: "plumbing", price: 145, unit: "tin", emoji: "🧴" },
  { id: "pvc-primer", nameEn: "PVC Primer 1L", nameHi: "PVC प्राइमर 1L", category: "plumbing", price: 120, unit: "tin", emoji: "🧴" },
  // PVC 2" / 3"
  { id: "pvc-2-elbow", nameEn: "PVC Elbow 2\"", nameHi: "PVC एल्बो 2\"", category: "plumbing", price: 15, unit: "pc", emoji: "🔧" },
  { id: "pvc-2-pipe", nameEn: "PVC Pipe 2\" (3m)", nameHi: "PVC पाइप 2\" (3m)", category: "plumbing", price: 180, unit: "pc", emoji: "📏" },
  { id: "pvc-3-elbow", nameEn: "PVC Elbow 3\"", nameHi: "PVC एल्बो 3\"", category: "plumbing", price: 22, unit: "pc", emoji: "🔧" },
  // CPVC / UPVC water
  { id: "cpvc-elbow", nameEn: "CPVC Elbow 1\"", nameHi: "CPVC एल्बो 1\"", category: "plumbing", price: 18, unit: "pc", emoji: "🔧" },
  { id: "cpvc-tee", nameEn: "CPVC Tee 1\"", nameHi: "CPVC टी 1\"", category: "plumbing", price: 24, unit: "pc", emoji: "🔧" },
  { id: "cpvc-pipe-1", nameEn: "CPVC Pipe 1\" (3m)", nameHi: "CPVC पाइप 1\" (3m)", category: "plumbing", price: 210, unit: "pc", emoji: "📏" },
  { id: "cpvc-solvent", nameEn: "CPVC Solvent 500ml", nameHi: "CPVC सॉल्वेंट 500ml", category: "plumbing", price: 95, unit: "tin", emoji: "🧴" },
  { id: "upvc-elbow-1", nameEn: "UPVC Elbow 1\"", nameHi: "UPVC एल्बो 1\"", category: "plumbing", price: 16, unit: "pc", emoji: "🔧" },
  { id: "upvc-pipe-1", nameEn: "UPVC Pipe 1\" (3m)", nameHi: "UPVC पाइप 1\" (3m)", category: "plumbing", price: 195, unit: "pc", emoji: "📏" },
  // Valves
  { id: "ball-valve", nameEn: "Ball Valve 1\"", nameHi: "बॉल वाल्व 1\"", category: "plumbing", price: 285, unit: "pc", emoji: "⚙️" },
  { id: "ball-valve-15", nameEn: "Ball Valve 1.5\"", nameHi: "बॉल वाल्व 1.5\"", category: "plumbing", price: 420, unit: "pc", emoji: "⚙️" },
  { id: "gate-valve-1", nameEn: "Gate Valve 1\"", nameHi: "गेट वाल्व 1\"", category: "plumbing", price: 350, unit: "pc", emoji: "⚙️" },
  { id: "nrv-1", nameEn: "Non-return Valve 1\"", nameHi: "NRV वाल्व 1\"", category: "plumbing", price: 310, unit: "pc", emoji: "⚙️" },
  // Bathroom / sanitary
  { id: "trap-jali", nameEn: "Floor Trap Jali 4\"", nameHi: "फ्लोर ट्रैप जाली 4\"", category: "plumbing", price: 95, unit: "pc", emoji: "🕳️" },
  { id: "bottle-trap", nameEn: "Bottle Trap (sink)", nameHi: "बॉटल ट्रैप", category: "plumbing", price: 165, unit: "pc", emoji: "🕳️" },
  { id: "sink-waste", nameEn: "Sink Waste Coupling", nameHi: "सिंक वेस्ट", category: "plumbing", price: 85, unit: "pc", emoji: "🚿" },
  { id: "health-faucet", nameEn: "Health Faucet (jet spray)", nameHi: "हेल्थ फॉसेट", category: "plumbing", price: 240, unit: "pc", emoji: "🚿" },
  { id: "angle-cock", nameEn: "Angle Cock 1/2\"", nameHi: "एंगल कॉक", category: "plumbing", price: 195, unit: "pc", emoji: "🚿" },
  { id: "pillar-cock", nameEn: "Pillar Cock", nameHi: "पिलर कॉक", category: "plumbing", price: 420, unit: "pc", emoji: "🚿" },
  { id: "shower-arm", nameEn: "Shower Arm 6\"", nameHi: "शावर आर्म", category: "plumbing", price: 280, unit: "pc", emoji: "🚿" },
  { id: "diverter", nameEn: "Diverter 3-in-1", nameHi: "डाइवर्टर", category: "plumbing", price: 890, unit: "pc", emoji: "🚿" },
  { id: "flush-valve", nameEn: "Flush Valve (WC)", nameHi: "फ्लश वाल्व", category: "plumbing", price: 650, unit: "pc", emoji: "🚽" },
  { id: "wc-connector", nameEn: "WC Connector Pipe", nameHi: "WC कनेक्टर", category: "plumbing", price: 120, unit: "pc", emoji: "🚽" },
  // Sealants & consumables
  { id: "teflon-tape", nameEn: "Teflon Tape Roll", nameHi: "टेफ्लॉन टेप", category: "plumbing", price: 35, unit: "roll", emoji: "📦" },
  { id: "washer-set", nameEn: "Rubber Washer Set", nameHi: "रबर वॉशर सेट", category: "plumbing", price: 55, unit: "pack", emoji: "⭕" },
  { id: "silicone", nameEn: "Silicone Sealant White", nameHi: "सिलिकॉन सीलेंट", category: "plumbing", price: 220, unit: "tube", emoji: "🧴" },
  { id: "epoxy-putty", nameEn: "Epoxy Putty Stick", nameHi: "एपॉक्सी पुट्टी", category: "plumbing", price: 85, unit: "pc", emoji: "🧴" },
  { id: "thread-seal", nameEn: "Thread Seal Liquid", nameHi: "थ्रेड सील", category: "plumbing", price: 75, unit: "bottle", emoji: "🧴" },
  // GI / hoses
  { id: "gi-nipple-1", nameEn: "GI Nipple 1\" × 6\"", nameHi: "GI निप्पल 1\"", category: "plumbing", price: 45, unit: "pc", emoji: "🔩" },
  { id: "gi-elbow-1", nameEn: "GI Elbow 1\"", nameHi: "GI एल्बो 1\"", category: "plumbing", price: 52, unit: "pc", emoji: "🔩" },
  { id: "flex-hose-24", nameEn: "Flexible Hose 24\"", nameHi: "फ्लेक्स होस 24\"", category: "plumbing", price: 180, unit: "pc", emoji: "🔗" },
  { id: "flex-hose-18", nameEn: "Flexible Hose 18\"", nameHi: "फ्लेक्स होस 18\"", category: "plumbing", price: 150, unit: "pc", emoji: "🔗" },
  { id: "hose-pipe-30m", nameEn: "Garden Hose 30m", nameHi: "होज पाइप 30m", category: "plumbing", price: 890, unit: "roll", emoji: "🔗" },
  // Hardware / tools
  { id: "tape-measure", nameEn: "Steel Tape 5m", nameHi: "स्टील टेप 5m", category: "hardware", price: 180, unit: "pc", emoji: "📐" },
  { id: "pipe-wrench", nameEn: "Pipe Wrench 14\"", nameHi: "पाइप रिंच 14\"", category: "hardware", price: 650, unit: "pc", emoji: "🔩" },
  { id: "basin-wrench", nameEn: "Basin Wrench", nameHi: "बेसिन रिंच", category: "hardware", price: 320, unit: "pc", emoji: "🔩" },
  { id: "hacksaw", nameEn: "Hacksaw Frame", nameHi: "हैक्सॉ", category: "hardware", price: 145, unit: "pc", emoji: "🪚" },
  { id: "plunger", nameEn: "Plunger (suction)", nameHi: "प्लंजर", category: "hardware", price: 95, unit: "pc", emoji: "🪠" },
];

/** Search aliases per product (en + hi transliterations) */
export const PRODUCT_ALIASES: Record<string, string[]> = {
  "pvc-4-elbow": ["elbow", "elb", "elbo", "एल्बो", "कोना", "4 inch", "4\"", "4 inch elbow"],
  "pvc-4-coupling": ["coupling", "coupl", "कपलिंग", "जोड़"],
  "pvc-4-tee": ["tee", "t joint", "टी", "ती"],
  "pvc-4-union": ["union", "यूनियन"],
  "pvc-4-reducer": ["reducer", "रिड्यूसर"],
  "pvc-pipe-4": ["pvc pipe 4", "pipe 4", "4 pipe", "पाइप 4", "नाली 4"],
  "pvc-pipe-4-6m": ["pvc pipe 6m", "6 meter pipe", "6m pipe", "long pipe", "लंबी पाइप", "लंबा पाइप"],
  "pvc-solvent": ["solvent", "cement", "सॉल्वेंट", "सीमेंट", "गोंद"],
  "pvc-primer": ["primer", "प्राइमर"],
  "pvc-2-elbow": ["elbow 2", "2 inch elbow", "एल्बो 2"],
  "pvc-2-pipe": ["pipe 2", "2 pipe", "पाइप 2"],
  "pvc-3-elbow": ["elbow 3", "3 inch", "एल्बो 3"],
  "cpvc-elbow": ["cpvc elbow", "cpvc", "सीपीवीसी"],
  "cpvc-tee": ["cpvc tee"],
  "cpvc-pipe-1": ["cpvc pipe", "cpvc pipe 1"],
  "cpvc-solvent": ["cpvc solvent"],
  "upvc-elbow-1": ["upvc elbow", "upvc"],
  "upvc-pipe-1": ["upvc pipe"],
  "ball-valve": ["ball valve", "valve", "वाल्व", "बॉल"],
  "ball-valve-15": ["ball valve 1.5", "1.5 valve", "डेढ़ इंच वाल्व"],
  "gate-valve-1": ["gate valve", "गेट", "गेट वाल्व"],
  "nrv-1": ["nrv", "non return", "check valve"],
  "trap-jali": ["trap", "jali", "floor trap", "जाली", "ट्रैप"],
  "bottle-trap": ["bottle trap", "बॉटल"],
  "sink-waste": ["sink waste", "waste", "वेस्ट", "सिंक", "kitchen sink", "किचन"],
  "health-faucet": ["health faucet", "jet", "हेल्थ", "स्प्रे"],
  "angle-cock": ["angle cock", "angle", "एंगल"],
  "pillar-cock": ["pillar cock", "pillar", "पिलर", "tap", "नल"],
  "shower-arm": ["shower arm", "shower", "शावर"],
  "diverter": ["diverter", "डाइवर्टर"],
  "flush-valve": ["flush", "flush valve", "फ्लश"],
  "wc-connector": ["wc", "connector", "toilet"],
  "teflon-tape": ["teflon", "tape", "टेफ्लॉन", "टेप"],
  "washer-set": ["washer", "वॉशर", "रबर"],
  "silicone": ["silicone", "sealant", "सिलिकॉन"],
  "epoxy-putty": ["epoxy", "putty", "पुट्टी"],
  "thread-seal": ["thread seal"],
  "gi-nipple-1": ["nipple", "gi nipple", "निप्पल"],
  "gi-elbow-1": ["gi elbow"],
  "flex-hose-24": ["flex hose 24", "flexible", "होस"],
  "flex-hose-18": ["flex hose 18"],
  "hose-pipe-30m": ["garden hose", "hose pipe", "hose", "garden"],
  "tape-measure": ["tape measure", "measure"],
  "pipe-wrench": ["pipe wrench", "wrench", "रिंच"],
  "basin-wrench": ["basin wrench"],
  "hacksaw": ["hacksaw", "हैक्सॉ"],
  "plunger": ["plunger", "प्लंजर", "जाम", "blockage"],
};

/**
 * Job kits: first 6 lines drive the on-job checklist (see lib/jobs.ts).
 * Mapped to typical Indian site work — supply (CPVC), sanitary, drainage (PVC), consumables.
 */
export const JOB_KITS: Record<JobType, { productId: string; qty: number }[]> = {
  // Full wet-room reno: supply lines + fittings + 4" drain roughing + traps
  bathroom: [
    { productId: "trap-jali", qty: 2 },
    { productId: "diverter", qty: 1 },
    { productId: "cpvc-pipe-1", qty: 2 },
    { productId: "pvc-4-elbow", qty: 6 },
    { productId: "angle-cock", qty: 2 },
    { productId: "ball-valve", qty: 2 },
    { productId: "bottle-trap", qty: 1 },
    { productId: "shower-arm", qty: 1 },
    { productId: "health-faucet", qty: 1 },
    { productId: "cpvc-elbow", qty: 8 },
    { productId: "cpvc-tee", qty: 2 },
    { productId: "cpvc-solvent", qty: 1 },
    { productId: "pvc-pipe-4", qty: 2 },
    { productId: "pvc-4-coupling", qty: 4 },
    { productId: "pvc-4-tee", qty: 2 },
    { productId: "pvc-solvent", qty: 1 },
    { productId: "pvc-primer", qty: 1 },
    { productId: "silicone", qty: 2 },
    { productId: "teflon-tape", qty: 3 },
    { productId: "flex-hose-24", qty: 2 },
  ],
  // Broken soil / drain pipe — fittings + solvent, not taps or CPVC
  pvc_repair: [
    { productId: "pvc-4-elbow", qty: 8 },
    { productId: "pvc-4-coupling", qty: 6 },
    { productId: "pvc-solvent", qty: 2 },
    { productId: "pvc-pipe-4", qty: 1 },
    { productId: "epoxy-putty", qty: 2 },
    { productId: "pvc-4-union", qty: 3 },
    { productId: "pvc-4-reducer", qty: 2 },
    { productId: "pvc-primer", qty: 1 },
    { productId: "teflon-tape", qty: 2 },
  ],
  // New tap / machine point off riser — CPVC branch + isolation
  new_connection: [
    { productId: "ball-valve", qty: 1 },
    { productId: "cpvc-pipe-1", qty: 2 },
    { productId: "cpvc-elbow", qty: 8 },
    { productId: "angle-cock", qty: 1 },
    { productId: "cpvc-tee", qty: 2 },
    { productId: "teflon-tape", qty: 3 },
    { productId: "cpvc-solvent", qty: 1 },
    { productId: "gate-valve-1", qty: 1 },
    { productId: "flex-hose-18", qty: 1 },
    { productId: "gi-nipple-1", qty: 2 },
    { productId: "thread-seal", qty: 1 },
  ],
  // Sink / RO / dishwasher — waste + supply under counter
  kitchen: [
    { productId: "sink-waste", qty: 1 },
    { productId: "bottle-trap", qty: 1 },
    { productId: "angle-cock", qty: 2 },
    { productId: "pillar-cock", qty: 1 },
    { productId: "ball-valve", qty: 1 },
    { productId: "cpvc-elbow", qty: 6 },
    { productId: "flex-hose-18", qty: 2 },
    { productId: "cpvc-pipe-1", qty: 1 },
    { productId: "cpvc-tee", qty: 1 },
    { productId: "teflon-tape", qty: 2 },
    { productId: "washer-set", qty: 1 },
    { productId: "silicone", qty: 1 },
  ],
  // WC set — flush, connector, health faucet, no drain pipe bulk
  toilet_wc: [
    { productId: "flush-valve", qty: 1 },
    { productId: "wc-connector", qty: 1 },
    { productId: "angle-cock", qty: 1 },
    { productId: "health-faucet", qty: 1 },
    { productId: "flex-hose-18", qty: 1 },
    { productId: "teflon-tape", qty: 2 },
    { productId: "silicone", qty: 1 },
    { productId: "washer-set", qty: 1 },
    { productId: "thread-seal", qty: 1 },
  ],
  // OHT / loft tank inlet-outlet — valves, NRV, riser CPVC, GI adaptors
  water_tank: [
    { productId: "ball-valve", qty: 2 },
    { productId: "nrv-1", qty: 1 },
    { productId: "gate-valve-1", qty: 1 },
    { productId: "cpvc-pipe-1", qty: 3 },
    { productId: "cpvc-elbow", qty: 8 },
    { productId: "gi-nipple-1", qty: 6 },
    { productId: "ball-valve-15", qty: 1 },
    { productId: "cpvc-tee", qty: 3 },
    { productId: "flex-hose-24", qty: 2 },
    { productId: "teflon-tape", qty: 4 },
    { productId: "thread-seal", qty: 1 },
  ],
  // Geyser inlet/outlet — isolation, flex to heater, GI threads
  geyser: [
    { productId: "ball-valve", qty: 2 },
    { productId: "angle-cock", qty: 1 },
    { productId: "flex-hose-24", qty: 2 },
    { productId: "flex-hose-18", qty: 1 },
    { productId: "gi-nipple-1", qty: 4 },
    { productId: "teflon-tape", qty: 3 },
    { productId: "gi-elbow-1", qty: 2 },
    { productId: "cpvc-elbow", qty: 4 },
    { productId: "thread-seal", qty: 1 },
  ],
  // Dripping joints / burst hose — sealants + swap consumables, not full pipe run
  leakage_repair: [
    { productId: "epoxy-putty", qty: 3 },
    { productId: "teflon-tape", qty: 4 },
    { productId: "washer-set", qty: 2 },
    { productId: "thread-seal", qty: 2 },
    { productId: "ball-valve", qty: 1 },
    { productId: "flex-hose-18", qty: 1 },
    { productId: "silicone", qty: 2 },
    { productId: "flex-hose-24", qty: 1 },
    { productId: "gi-nipple-1", qty: 2 },
    { productId: "angle-cock", qty: 1 },
  ],
  // Choked drain — clear/replace trap, no solvent or new drain line
  drain_blockage: [
    { productId: "plunger", qty: 1 },
    { productId: "trap-jali", qty: 1 },
    { productId: "bottle-trap", qty: 1 },
    { productId: "basin-wrench", qty: 1 },
    { productId: "washer-set", qty: 1 },
    { productId: "epoxy-putty", qty: 1 },
  ],
  // Replace main drain run — pipe length + fittings + tools
  pipeline_upgrade: [
    { productId: "pvc-pipe-4", qty: 4 },
    { productId: "pvc-4-elbow", qty: 10 },
    { productId: "pvc-solvent", qty: 3 },
    { productId: "pvc-4-coupling", qty: 8 },
    { productId: "pvc-4-tee", qty: 4 },
    { productId: "pipe-wrench", qty: 1 },
    { productId: "pvc-pipe-4-6m", qty: 2 },
    { productId: "pvc-4-union", qty: 4 },
    { productId: "pvc-primer", qty: 2 },
    { productId: "hacksaw", qty: 1 },
  ],
  other: [
    { productId: "teflon-tape", qty: 2 },
    { productId: "washer-set", qty: 2 },
    { productId: "epoxy-putty", qty: 1 },
    { productId: "plunger", qty: 1 },
    { productId: "ball-valve", qty: 1 },
    { productId: "silicone", qty: 1 },
  ],
};

/** Highlight in catalog browse for active job type */
export const JOB_TYPE_PRODUCT_IDS: Record<JobType, string[]> = {
  bathroom: [
    "trap-jali", "diverter", "shower-arm", "angle-cock", "cpvc-pipe-1", "cpvc-elbow",
    "pvc-4-elbow", "bottle-trap", "ball-valve", "silicone",
  ],
  pvc_repair: [
    "pvc-4-elbow", "pvc-4-coupling", "pvc-4-union", "pvc-4-reducer",
    "pvc-solvent", "pvc-pipe-4", "epoxy-putty",
  ],
  new_connection: [
    "ball-valve", "cpvc-pipe-1", "cpvc-elbow", "cpvc-tee", "angle-cock", "gate-valve-1",
  ],
  kitchen: [
    "sink-waste", "bottle-trap", "angle-cock", "pillar-cock", "cpvc-elbow", "ball-valve",
  ],
  toilet_wc: [
    "flush-valve", "wc-connector", "health-faucet", "angle-cock", "flex-hose-18", "silicone",
  ],
  water_tank: [
    "ball-valve", "nrv-1", "gate-valve-1", "cpvc-pipe-1", "cpvc-elbow", "gi-nipple-1",
  ],
  geyser: [
    "ball-valve", "angle-cock", "flex-hose-24", "flex-hose-18", "gi-nipple-1", "gi-elbow-1",
  ],
  leakage_repair: [
    "epoxy-putty", "teflon-tape", "thread-seal", "washer-set", "silicone", "flex-hose-18",
  ],
  drain_blockage: ["plunger", "trap-jali", "bottle-trap", "basin-wrench", "washer-set"],
  pipeline_upgrade: [
    "pvc-pipe-4", "pvc-pipe-4-6m", "pvc-4-elbow", "pvc-4-union", "pvc-solvent", "pipe-wrench",
  ],
  other: ["teflon-tape", "washer-set", "epoxy-putty", "plunger", "ball-valve"],
};

export const BATHROOM_KIT = JOB_KITS.bathroom;

export const LAST_ORDER: { productId: string; qty: number }[] = [
  { productId: "pvc-4-elbow", qty: 8 },
  { productId: "pvc-4-coupling", qty: 6 },
  { productId: "pvc-solvent", qty: 1 },
  { productId: "epoxy-putty", qty: 2 },
  { productId: "teflon-tape", qty: 2 },
];
