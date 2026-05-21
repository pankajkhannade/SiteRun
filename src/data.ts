import type { PastOrder, Product } from "./types";
import { PRODUCTS, LAST_ORDER } from "./data/catalog";

export {
  PRODUCTS,
  BATHROOM_KIT,
  LAST_ORDER,
  JOB_KITS,
  JOB_TYPE_PRODUCT_IDS,
  PRODUCT_ALIASES,
} from "./data/catalog";

export const CONTRACTOR = {
  nameEn: "Raju Kumar",
  nameHi: "राजू कुमार",
  tradeEn: "Plumber",
  tradeHi: "प्लंबर",
  phone: "+91 98XXX XXXXX",
};

export const CATEGORIES = [
  { id: "plumbing" as const, labelEn: "Plumbing", labelHi: "प्लंबिंग", emoji: "🚿" },
  { id: "electrical" as const, labelEn: "Electrical", labelHi: "इलेक्ट्रिक", emoji: "⚡" },
  { id: "hardware" as const, labelEn: "Hardware", labelHi: "हार्डवेयर", emoji: "🔩" },
  { id: "paint" as const, labelEn: "Paint", labelHi: "पेंट", emoji: "🎨" },
];

export const REPEAT_CHIPS = [
  { id: "bathroom-kit", labelEn: "Job kit", labelHi: "जॉब किट", emoji: "🛁" },
  { id: "pvc-4", labelEn: "PVC 4\"", labelHi: "PVC 4\"", emoji: "🔧" },
  { id: "last-order", labelEn: "Last Tuesday", labelHi: "पिछला मंगल", emoji: "↩️" },
];

export const JOB_SITES = [
  { id: "site-1", labelEn: "Koramangala 4th Block, Whitefield", labelHi: "कोरमंगला 4थ ब्लॉक, व्हाइटफील्ड" },
  { id: "site-2", labelEn: "HSR Layout Sector 2", labelHi: "HSR लेआउट सेक्टर 2" },
  { id: "site-3", labelEn: "Marathahalli Bridge site", labelHi: "मराठाहल्ली ब्रिज साइट" },
];

export const PAST_ORDERS: PastOrder[] = [
  {
    id: "ORD-882104",
    dateEn: "Tue 12 Mar",
    dateHi: "मंगल 12 मार्च",
    jobId: "job-1",
    jobType: "bathroom",
    jobNameEn: "Bathroom fittings",
    jobNameHi: "बाथरूम फिटिंग",
    items: LAST_ORDER,
    total: 801,
    status: "delivered",
  },
  {
    id: "ORD-879912",
    dateEn: "Fri 8 Mar",
    dateHi: "शुक्र 8 मार्च",
    jobId: "job-2",
    jobType: "pvc_repair",
    jobNameEn: "PVC repair — Bellandur",
    jobNameHi: "PVC रिपेयर — बेलंदूर",
    items: [
      { productId: "pvc-4-elbow", qty: 6 },
      { productId: "pvc-4-coupling", qty: 4 },
      { productId: "pvc-solvent", qty: 1 },
      { productId: "epoxy-putty", qty: 2 },
    ],
    total: 611,
    status: "delivered",
  },
];

export const DEMO_PHONE = "9876543210";
export const DEMO_OTP = "123456";

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function cartTotal(items: { productId: string; qty: number }[]): number {
  return items.reduce((sum, item) => {
    const p = getProduct(item.productId);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
}
