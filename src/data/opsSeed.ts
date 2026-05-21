import { JOB_KITS, PRODUCTS } from "./catalog";
import type { Order } from "../types";

function lineTotal(items: { productId: string; qty: number }[]): number {
  return items.reduce((sum, i) => {
    const p = PRODUCTS.find((x) => x.id === i.productId);
    return sum + (p?.price ?? 0) * i.qty;
  }, 0);
}

/** In-flight orders shown in Ops before the contractor places any order */
export function createOpsSeedOrders(): Order[] {
  const bathroomItems = JOB_KITS.bathroom.slice(0, 4);
  const pvcItems = JOB_KITS.pvc_repair.slice(0, 3);

  return [
    {
      id: "ORD-D78201",
      jobId: "job-1",
      items: bathroomItems,
      total: lineTotal(bathroomItems),
      etaMinutes: 28,
      status: "picking",
      placedAt: new Date(Date.now() - 11 * 60 * 1000),
      jobNameEn: "2BHK Bathroom renovation",
      jobNameHi: "2BHK बाथरूम रेनोवेशन",
      siteId: "site-1",
    },
    {
      id: "ORD-D78202",
      jobId: "job-2",
      items: pvcItems,
      total: lineTotal(pvcItems),
      etaMinutes: 28,
      status: "confirmed",
      placedAt: new Date(Date.now() - 3 * 60 * 1000),
      jobNameEn: "PVC repair",
      jobNameHi: "PVC रिपेयर",
      siteId: "site-2",
    },
  ];
}
