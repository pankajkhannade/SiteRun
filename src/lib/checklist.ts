import { cartTotal } from "../data";
import type { CartItem, ChecklistItem, Job } from "../types";

export interface ChecklistGap {
  checklistId: string;
  productId: string;
  qty: number;
}

/** Pending checklist lines not fully covered in cart */
export function getChecklistGaps(job: Job, cart: CartItem[]): ChecklistGap[] {
  const gaps: ChecklistGap[] = [];
  for (const item of job.checklist) {
    if (item.done) continue;
    const inCart = cart.find((c) => c.productId === item.productId);
    const short = item.qty - (inCart?.qty ?? 0);
    if (short > 0) {
      gaps.push({
        checklistId: item.id,
        productId: item.productId,
        qty: short,
      });
    }
  }
  return gaps;
}

export function gapLineCount(gaps: ChecklistGap[]): number {
  return gaps.reduce((s, g) => s + g.qty, 0);
}

export function gapCartTotal(gaps: ChecklistGap[]): number {
  return cartTotal(gaps.map((g) => ({ productId: g.productId, qty: g.qty })));
}

export function pendingChecklistCount(job: Job): number {
  return job.checklist.filter((c) => !c.done).length;
}

/** Mark checklist rows done when those SKUs were ordered */
export function markChecklistOrdered(
  checklist: ChecklistItem[],
  orderedProductIds: Set<string>
): ChecklistItem[] {
  return checklist.map((c) =>
    orderedProductIds.has(c.productId) ? { ...c, done: true } : c
  );
}

export function checklistProgress(job: Job): { done: number; total: number } {
  const total = job.checklist.length;
  const done = job.checklist.filter((c) => c.done).length;
  return { done, total };
}

export function progressPercent(job: Job): number {
  const { done, total } = checklistProgress(job);
  return total === 0 ? 0 : Math.round((done / total) * 100);
}
