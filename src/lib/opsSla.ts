import type { Order } from "../types";

export type SlaLevel = "ok" | "warning" | "critical";

export function slaSecondsRemaining(order: Order, now = Date.now()): number {
  const deadline = order.placedAt.getTime() + order.etaMinutes * 60 * 1000;
  return Math.max(0, Math.floor((deadline - now) / 1000));
}

export function slaLevel(order: Order, now = Date.now()): SlaLevel {
  const remaining = slaSecondsRemaining(order, now);
  const total = order.etaMinutes * 60;
  if (remaining <= total * 0.15) return "critical";
  if (remaining <= total * 0.35) return "warning";
  return "ok";
}

export function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function orderLineCount(order: Order): number {
  return order.items.reduce((sum, i) => sum + i.qty, 0);
}

export function sortOrdersBySlaUrgency(orders: Order[], now = Date.now()): Order[] {
  return [...orders].sort(
    (a, b) => slaSecondsRemaining(a, now) - slaSecondsRemaining(b, now)
  );
}
