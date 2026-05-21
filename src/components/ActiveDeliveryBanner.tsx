import { useEffect, useState } from "react";
import { ChevronRight, Package, Plus } from "lucide-react";
import { useApp } from "../context";
import { useTranslation } from "../i18n";
import { deliveryMinutesRemaining, isDeliveryUrgent } from "../lib/delivery";

export function ActiveDeliveryBanner() {
  const { activeOrder, liveOrders, trackOrder, setScreen, locale } = useApp();
  const { t } = useTranslation();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 30000);
    return () => clearInterval(id);
  }, []);

  void tick;

  if (!activeOrder) return null;

  const mins = deliveryMinutesRemaining(activeOrder);
  const urgent = isDeliveryUrgent(activeOrder);
  const jobName =
    locale === "hi" ? activeOrder.jobNameHi : activeOrder.jobNameEn;

  return (
    <div className="mx-4 mb-4">
      <button
        type="button"
        onClick={() => trackOrder(activeOrder.id)}
        className={`w-full p-4 rounded-2xl border-2 text-left transition-colors ${
          urgent
            ? "border-siterun-orange bg-siterun-orange-light"
            : "border-siterun-green bg-siterun-green-light"
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Package size={20} className={urgent ? "text-siterun-orange" : "text-siterun-green"} />
            <span className="text-xs font-bold uppercase text-siterun-navy">
              {t("deliveryOnWay")}
            </span>
          </div>
          <span
            className={`text-2xl font-bold tabular-nums ${
              urgent ? "text-siterun-orange" : "text-siterun-green"
            }`}
          >
            {mins}
            <span className="text-sm font-semibold ml-0.5">{t("minShort")}</span>
          </span>
        </div>
        <p className="text-sm font-semibold text-siterun-navy mt-2 line-clamp-1">{jobName}</p>
        <p className="text-xs text-siterun-slate mt-0.5 font-mono">{activeOrder.id}</p>
        {liveOrders.length > 1 && (
          <p className="text-xs text-siterun-slate mt-2">
            {t("moreOrdersInFlight", { n: liveOrders.length - 1 })}
          </p>
        )}
        <p className="text-sm text-siterun-green font-medium mt-2 flex items-center gap-1">
          {t("track")} <ChevronRight size={16} />
        </p>
      </button>
      <button
        type="button"
        onClick={() => setScreen("catalog")}
        className="w-full mt-2 py-2.5 rounded-xl border border-siterun-navy/20 bg-white text-sm font-semibold text-siterun-navy flex items-center justify-center gap-2"
      >
        <Plus size={16} />
        {t("addToActiveJob")}
      </button>
    </div>
  );
}
