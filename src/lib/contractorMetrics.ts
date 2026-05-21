import type { Order, PastOrder } from "../types";

/** Demo north-star metrics — time back on tools, not waiting or running to market */
export interface ContractorWeeklyMetrics {
  /** Hours not lost to market runs / waiting (modelled) */
  hoursSaved: number;
  ordersThisWeek: number;
  avgDeliveryMinutes: number;
  /** Fewer emergency hardware runs mid-job */
  tripsAvoided: number;
  /** Streak of weeks using the app (demo metric) */
  weekStreak: number;
}

const BASELINE_TRIP_MINUTES = 75;
const FIXXLY_DELIVERY_MINUTES = 28;

export function computeWeeklyMetrics(
  pastOrders: PastOrder[],
  liveOrders: Order[]
): ContractorWeeklyMetrics {
  const allCount = pastOrders.length + liveOrders.length;
  const ordersThisWeek = Math.min(Math.max(allCount, 2), 8);
  const tripsAvoided = Math.max(ordersThisWeek - 1, 1);
  const hoursSaved = Math.round(tripsAvoided * (BASELINE_TRIP_MINUTES / 60) * 10) / 10;
  const deliveredEtas = pastOrders.map(() => FIXXLY_DELIVERY_MINUTES);
  const liveEtas = liveOrders.map((o) => o.etaMinutes);
  const etas = [...deliveredEtas, ...liveEtas];
  const avgDeliveryMinutes =
    etas.length > 0
      ? Math.round(etas.reduce((a, b) => a + b, 0) / etas.length)
      : FIXXLY_DELIVERY_MINUTES;

  return {
    hoursSaved,
    ordersThisWeek,
    avgDeliveryMinutes,
    tripsAvoided,
    weekStreak: 3,
  };
}
