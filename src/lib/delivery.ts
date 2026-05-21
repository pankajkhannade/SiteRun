import type { DeliveryWindow, Order, OrderStatus } from "../types";

export const ETA_BY_WINDOW: Record<DeliveryWindow, number> = {
  asap: 28,
  flex: 45,
};

export function etaMinutesForWindow(window: DeliveryWindow): number {
  return ETA_BY_WINDOW[window];
}

/** Minutes left for contractor tracking UI */
export function deliveryMinutesRemaining(
  order: Order,
  now = Date.now()
): number {
  const statusProgress: Record<OrderStatus, number> = {
    confirmed: 0,
    picking: 7,
    out_for_delivery: 14,
    delivered: order.etaMinutes,
  };
  const elapsed = (now - order.placedAt.getTime()) / 60000;
  const floor = statusProgress[order.status] ?? 0;
  return Math.max(0, Math.round(order.etaMinutes - Math.max(elapsed, floor)));
}

export function deliverySecondsRemaining(
  order: Order,
  now = Date.now()
): number {
  return deliveryMinutesRemaining(order, now) * 60;
}

export function isDeliveryUrgent(order: Order, now = Date.now()): boolean {
  return deliveryMinutesRemaining(order, now) <= 12;
}
