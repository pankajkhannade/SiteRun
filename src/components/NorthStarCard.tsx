import type { ReactNode } from "react";
import { Clock, TrendingUp, Truck } from "lucide-react";
import type { ContractorWeeklyMetrics } from "../lib/contractorMetrics";
import { useTranslation } from "../i18n";

export function NorthStarCard({ metrics }: { metrics: ContractorWeeklyMetrics }) {
  const { t } = useTranslation();

  return (
    <section className="mx-4 mb-4 p-4 rounded-2xl bg-gradient-to-br from-siterun-navy to-slate-800 text-white shadow-lg">
      <p className="text-[10px] uppercase tracking-wider text-siterun-amber font-semibold">
        {t("northStarLabel")}
      </p>
      <p className="text-sm text-white/80 mt-0.5">{t("northStarSubtitle")}</p>
      <div className="flex items-end gap-2 mt-3">
        <p className="text-4xl font-bold tabular-nums leading-none">{metrics.hoursSaved}</p>
        <p className="text-lg font-semibold text-siterun-amber pb-0.5">{t("hoursSavedUnit")}</p>
      </div>
      <p className="text-xs text-white/70 mt-1">{t("hoursSavedHint")}</p>
      <div className="grid grid-cols-3 gap-2 mt-4">
        <Stat icon={<Truck size={14} />} value={String(metrics.ordersThisWeek)} label={t("metricOrders")} />
        <Stat
          icon={<Clock size={14} />}
          value={`${metrics.avgDeliveryMinutes}m`}
          label={t("metricAvgEta")}
        />
        <Stat
          icon={<TrendingUp size={14} />}
          value={String(metrics.tripsAvoided)}
          label={t("metricTripsSaved")}
        />
      </div>
    </section>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl bg-white/10 px-2 py-2 text-center">
      <div className="flex justify-center text-siterun-amber mb-0.5">{icon}</div>
      <p className="text-sm font-bold tabular-nums">{value}</p>
      <p className="text-[9px] text-white/60 leading-tight mt-0.5">{label}</p>
    </div>
  );
}
