import { PRODUCTS, PRODUCT_ALIASES, JOB_KITS } from "../data";
import { getProduct } from "../data";
import { getChecklistGaps } from "./checklist";
import type { Job, JobType, Locale } from "../types";
import { productName } from "../i18n/labels";

export interface ParsedOrderItem {
  productId: string;
  qty: number;
}

export interface CopilotParseResult {
  intent: "add" | "kit" | "remaining" | "help" | "unknown";
  items: ParsedOrderItem[];
  unmatched: string[];
  replyEn: string;
  replyHi: string;
}

const HI_NUMBERS: Record<string, number> = {
  "एक": 1, "दो": 2, "तीन": 3, "teen": 3,
  "चार": 4, "char": 4, "पांच": 5, "पाँच": 5, "छह": 6, "सात": 7, "आठ": 8,
  "नौ": 9, "दस": 10,
};

const EN_NUMBERS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  a: 1, an: 1,
};

interface ProductIndexEntry {
  productId: string;
  terms: string[];
}

let productIndex: ProductIndexEntry[] | null = null;

function buildIndex(): ProductIndexEntry[] {
  return PRODUCTS.map((p) => {
    const aliases = PRODUCT_ALIASES[p.id] ?? [];
    const terms = [
      p.id.replace(/-/g, " "),
      p.nameEn.toLowerCase(),
      p.nameHi,
      ...aliases.map((a) => a.toLowerCase()),
    ];
    return { productId: p.id, terms };
  });
}

function getIndex() {
  if (!productIndex) productIndex = buildIndex();
  return productIndex;
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/["'']/g, '"')
    .replace(/×/g, "x")
    .replace(/\s+/g, " ")
    .trim();
}

function extractQuantity(segment: string): { qty: number; rest: string } {
  let qty = 1;
  let rest = segment;

  const xMatch = segment.match(/(\d+)\s*(?:x|×|\*|pcs?|pieces?|pc|nos?|units?|टुकड़े|नंबर)\b/i);
  if (xMatch) {
    qty = parseInt(xMatch[1], 10);
    rest = segment.replace(xMatch[0], " ").trim();
  }

  const tailNum = segment.match(/(\d+)\s*$/);
  if (tailNum && !xMatch) {
    qty = parseInt(tailNum[1], 10);
    rest = segment.replace(tailNum[0], " ").trim();
  }

  const leadNum = segment.match(/^(\d+)\s+/);
  if (leadNum && !xMatch && !tailNum) {
    qty = parseInt(leadNum[1], 10);
    rest = segment.slice(leadNum[0].length).trim();
  }

  for (const [word, n] of Object.entries({ ...EN_NUMBERS, ...HI_NUMBERS })) {
    const re = new RegExp(`\\b${word}\\b`, "i");
    if (re.test(rest)) {
      qty = n;
      rest = rest.replace(re, " ").trim();
      break;
    }
  }

  return { qty: Math.min(Math.max(qty, 1), 99), rest };
}

function scoreMatch(segment: string, entry: ProductIndexEntry): number {
  const seg = normalizeText(segment);
  if (seg.length < 2) return 0;
  let best = 0;
  for (const term of entry.terms) {
    const t = term.toLowerCase();
    if (seg === t) return 100;
    if (seg.includes(t) && t.length >= 3) best = Math.max(best, 10 + t.length);
    if (t.includes(seg) && seg.length >= 4) best = Math.max(best, 8 + seg.length);
    const segWords = seg.split(/\s+/).filter((w) => w.length > 2);
    const matchedWords = segWords.filter((w) => t.includes(w));
    if (matchedWords.length >= 2) best = Math.max(best, 6 * matchedWords.length);
  }
  return best;
}

function matchProduct(segment: string): { productId: string; score: number } | null {
  const index = getIndex();
  let best: { productId: string; score: number } | null = null;
  for (const entry of index) {
    const score = scoreMatch(segment, entry);
    if (score > 0 && (!best || score > best.score)) {
      best = { productId: entry.productId, score };
    }
  }
  if (best && best.score >= 8) return best;
  return null;
}

function splitSegments(text: string): string[] {
  return normalizeText(text)
    .split(/\s*(?:,|\+|&| and | aur | और | तथा | plus )\s*/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 1);
}

function isKitIntent(text: string): boolean {
  return /\b(kit|full job|job kit|bathroom kit|kitchen kit|पूरी किट|किट|सब सामान|complete kit|poori kit|job ka saman)\b/i.test(text);
}

function isRemainingIntent(text: string): boolean {
  return /\b(remaining|pending|checklist|left on job|baaki|बाकी|बचा|बचे|चेकलिस्ट|list pending|order remaining|bacha hua)\b/i.test(
    text
  );
}

function isHelpIntent(text: string): boolean {
  return /^(help|madad|सहायता|what can|kya kar|क्या कर|how|kaise|कैसे)\b/i.test(text.trim());
}

export function parseOrderMessage(
  text: string,
  jobType: JobType | null,
  activeJob: Job | null = null,
  cart: { productId: string; qty: number }[] = []
): CopilotParseResult {
  const raw = text.trim();
  if (!raw) {
    return {
      intent: "unknown",
      items: [],
      unmatched: [],
      replyEn: "Say what you need — e.g. “4 inch elbow 4 pcs, solvent 1 tin”",
      replyHi: "बताएं क्या चाहिए — जैसे “4 inch elbow 4, solvent 1”",
    };
  }

  if (isHelpIntent(raw)) {
    return {
      intent: "help",
      items: [],
      unmatched: [],
      replyEn: "Try: “elbow 4 inch x6”, “ball valve 2”, “full job kit”, or tap the mic.",
      replyHi: "लिखें: “elbow 4 inch 6”, “ball valve 2”, “पूरी किट”, या माइक दबाएं।",
    };
  }

  if (isKitIntent(raw) && jobType) {
    return {
      intent: "kit",
      items: JOB_KITS[jobType],
      unmatched: [],
      replyEn: `Added full ${jobType.replace("_", " ")} kit to cart.`,
      replyHi: "पूरी जॉब किट कार्ट में जोड़ दी।",
    };
  }

  if (isRemainingIntent(raw) && activeJob) {
    const gaps = getChecklistGaps(activeJob, cart);
    if (gaps.length === 0) {
      return {
        intent: "remaining",
        items: [],
        unmatched: [],
        replyEn: "Checklist is covered — nothing pending for this job.",
        replyHi: "चेकलिस्ट पूरी है — इस जॉब के लिए कुछ बाकी नहीं।",
      };
    }
    const items = gaps.map((g) => ({ productId: g.productId, qty: g.qty }));
    return {
      intent: "remaining",
      items,
      unmatched: [],
      replyEn: `Added ${items.length} pending checklist item(s) still needed on site.`,
      replyHi: `${items.length} बाकी चेकलिस्ट आइटम कार्ट में जोड़े।`,
    };
  }

  const segments = splitSegments(raw);
  const items: ParsedOrderItem[] = [];
  const unmatched: string[] = [];

  for (const seg of segments) {
    const { qty, rest } = extractQuantity(seg);
    const query = rest || seg;
    const match = matchProduct(query);
    if (match) {
      const existing = items.find((i) => i.productId === match.productId);
      if (existing) existing.qty += qty;
      else items.push({ productId: match.productId, qty });
    } else if (query.length > 2) {
      unmatched.push(seg);
    }
  }

  if (items.length === 0 && unmatched.length === 0) {
    const single = matchProduct(raw);
    if (single) {
      const { qty } = extractQuantity(raw);
      items.push({ productId: single.productId, qty });
    }
  }

  if (items.length > 0) {
    const linesEn = items.map((i) => {
      const p = getProduct(i.productId);
      return p ? `${p.nameEn} ×${i.qty}` : i.productId;
    });
    const linesHi = items.map((i) => {
      const p = getProduct(i.productId);
      return p ? `${p.nameHi} ×${i.qty}` : i.productId;
    });
    const extra =
      unmatched.length > 0
        ? ` Couldn't match: ${unmatched.join(", ")}.`
        : "";
    const extraHi =
      unmatched.length > 0 ? ` नहीं मिला: ${unmatched.join(", ")}।` : "";
    return {
      intent: "add",
      items,
      unmatched,
      replyEn: `Added: ${linesEn.join(", ")}.${extra}`,
      replyHi: `जोड़ा: ${linesHi.join(", ")}।${extraHi}`,
    };
  }

  return {
    intent: "unknown",
    items: [],
    unmatched,
    replyEn: "I didn't recognise those items. Try product names like elbow, coupling, ball valve, solvent.",
    replyHi: "समझ नहीं आया। elbow, coupling, valve, solvent जैसे नाम लिखें।",
  };
}

export function formatItemList(items: ParsedOrderItem[], locale: Locale): string {
  return items
    .map((i) => {
      const p = getProduct(i.productId);
      if (!p) return "";
      return `${productName(p, locale)} ×${i.qty}`;
    })
    .filter(Boolean)
    .join(", ");
}

export const COPILOT_EXAMPLES: Record<Locale, string[]> = {
  en: [
    "order remaining checklist",
    "4 inch elbow 6, solvent 1",
    "full job kit",
  ],
  hi: [
    "बाकी चेकलिस्ट",
    "elbow 4 inch 6, solvent 1",
    "पूरी किट",
  ],
};

/** After adding elbow — suggest common pairs */
export function suggestComplements(productIds: string[]): ParsedOrderItem[] {
  const set = new Set(productIds);
  const out: ParsedOrderItem[] = [];
  if (set.has("pvc-4-elbow") && !set.has("pvc-4-coupling")) {
    out.push({ productId: "pvc-4-coupling", qty: 4 });
  }
  if ((set.has("pvc-4-elbow") || set.has("pvc-4-coupling")) && !set.has("pvc-solvent")) {
    out.push({ productId: "pvc-solvent", qty: 1 });
  }
  return out;
}
