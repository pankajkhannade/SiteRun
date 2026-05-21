import { ChevronRight, MapPin, Plus, RotateCcw, WifiOff } from "lucide-react";
import { LAST_ORDER, REPEAT_CHIPS } from "../data";
import { gapCartTotal, gapLineCount, getChecklistGaps, progressPercent } from "../lib/checklist";
import { kitForJobType, jobTypeTitle } from "../lib/jobs";
import { lastOrderForJobType } from "../lib/reorder";
import { useApp } from "../context";
import { useTranslation } from "../i18n";
import {
  activeJobStarted,
  activeJobTitle,
  contractorName,
  contractorTrade,
  jobSiteLabel,
  repeatChipLabel,
} from "../i18n/labels";
import { ActiveDeliveryBanner } from "../components/ActiveDeliveryBanner";
import { Header } from "../components/Header";
import { NorthStarCard } from "../components/NorthStarCard";

export function HomeScreen() {
  const {
    setScreen,
    addKitToCart,
    cart,
    cartCount,
    locale,
    activeJob,
    activeJobs,
    activeOrder,
    jobSites,
    jobs,
    pastOrders,
    requireActiveJob,
    isOfflineMode,
    offlineQueueCount,
    weeklyMetrics,
    addChecklistGapsToCart,
  } = useApp();
  const { t } = useTranslation();

  const checklistGaps = activeJob ? getChecklistGaps(activeJob, cart) : [];
  const jobTypePast = activeJob
    ? lastOrderForJobType(pastOrders, jobs, activeJob.type)
    : null;

  const handleChip = (id: string) => {
    if (!requireActiveJob()) return;
    if (id === "bathroom-kit" && activeJob) addKitToCart(kitForJobType(activeJob.type));
    else if (id === "last-order") addKitToCart(LAST_ORDER);
    else if (id === "job-type-repeat" && jobTypePast) addKitToCart(jobTypePast.items);
    else
      addKitToCart([
        { productId: "pvc-4-elbow", qty: 6 },
        { productId: "pvc-4-coupling", qty: 4 },
      ]);
    setScreen("cart");
  };

  const orderMaterials = () => {
    if (requireActiveJob()) setScreen("catalog");
  };

  const chips = [
    ...REPEAT_CHIPS,
    ...(jobTypePast && activeJob
      ? [
          {
            id: "job-type-repeat",
            emoji: "↩️",
            labelEn: t("reorderSameJobType", {
              type: jobTypeTitle(activeJob.type, "en"),
            }),
            labelHi: t("reorderSameJobType", {
              type: jobTypeTitle(activeJob.type, "hi"),
            }),
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col h-full relative">
      <Header title={t("appName")} showCart />
      <div className="flex-1 overflow-y-auto">
        {(isOfflineMode || offlineQueueCount > 0) && (
          <div className="px-4 py-3 bg-amber-50 border-b border-amber-200 flex items-center gap-2 text-sm">
            <WifiOff size={16} className="text-amber-700 shrink-0" />
            <span className="text-amber-900 font-medium text-xs">
              {offlineQueueCount > 0
                ? `${offlineQueueCount} ${offlineQueueCount === 1 ? t("offlineQueued") : t("offlineQueuedPlural")}`
                : t("weakNetwork")}
            </span>
          </div>
        )}

        {!isOfflineMode && offlineQueueCount === 0 && (
          <div className="px-4 py-2 bg-siterun-orange-light border-b border-siterun-orange/20 flex items-center gap-2">
            <WifiOff size={14} className="text-siterun-slate shrink-0" />
            <span className="text-xs text-siterun-navy">{t("weakNetworkDetail")}</span>
          </div>
        )}

        <NorthStarCard metrics={weeklyMetrics} />

        <ActiveDeliveryBanner />

        <div className="px-4 pb-2">
          <p className="text-siterun-slate text-sm">{t("hello")}</p>
          <h1 className="text-xl font-bold text-siterun-navy mt-0.5">{contractorName(locale)}</h1>
          <p className="text-sm text-siterun-slate">{contractorTrade(locale)}</p>
        </div>

        {!activeJob ? (
          <div className="mx-4 mb-4 p-6 rounded-2xl border-2 border-dashed border-siterun-navy/20 text-center">
            <p className="font-bold text-siterun-navy">{t("noActiveJob")}</p>
            <p className="text-sm text-siterun-slate mt-2">{t("noActiveJobHint")}</p>
            <button
              type="button"
              onClick={() => setScreen("addJob")}
              className="mt-4 w-full py-4 rounded-2xl bg-siterun-orange text-white font-bold flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              {t("startJob")}
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setScreen("job")}
              className="mx-4 mb-2 p-4 rounded-2xl bg-siterun-navy text-white text-left active:opacity-95 shadow-lg w-[calc(100%-2rem)]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase tracking-wider text-siterun-amber font-semibold">
                    {t("activeJob")}
                  </span>
                  <p className="font-bold text-lg mt-1 leading-snug">{activeJobTitle(activeJob, locale)}</p>
                  <p className="flex items-center gap-1 text-sm text-white/70 mt-2">
                    <MapPin size={14} className="shrink-0" />
                    <span className="truncate">
                      {jobSiteLabel(jobSites, activeJob.siteId, locale)}
                    </span>
                  </p>
                </div>
                <ChevronRight className="shrink-0 mt-2 opacity-80" size={24} />
              </div>
              <div className="mt-3">
                <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
                  <div
                    className="h-full bg-siterun-amber rounded-full transition-all"
                    style={{ width: `${progressPercent(activeJob)}%` }}
                  />
                </div>
                <p className="text-xs mt-1.5 text-white/60">
                  {t("jobProgress", { pct: progressPercent(activeJob) })}
                </p>
              </div>
              <p className="text-xs mt-2 text-white/60">{activeJobStarted(activeJob, locale)}</p>
            </button>

            {checklistGaps.length > 0 && !activeOrder && (
              <div className="mx-4 mb-3">
                <button
                  type="button"
                  onClick={() => {
                    addChecklistGapsToCart();
                    setScreen("cart");
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-amber-100 border border-amber-300 text-left"
                >
                  <p className="text-sm font-bold text-amber-950">
                    {t("orderRemaining", { n: gapLineCount(checklistGaps) })}
                    <span className="font-normal text-amber-800">
                      {t("orderRemainingAmount", { amount: gapCartTotal(checklistGaps) })}
                    </span>
                  </p>
                </button>
              </div>
            )}

            <div className="px-4 mb-4 flex gap-2">
              <button
                type="button"
                onClick={() => setScreen("jobs")}
                className="flex-1 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-siterun-navy"
              >
                {t("switchJob")}
                {activeJobs.length > 1 && (
                  <span className="text-siterun-slate font-normal">
                    {" "}
                    ({t("jobCount", { n: activeJobs.length })})
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setScreen("addJob")}
                className="py-2.5 px-4 rounded-xl bg-siterun-orange-light border border-siterun-orange/30 text-siterun-orange font-semibold text-sm"
              >
                + {t("newJob")}
              </button>
            </div>
          </>
        )}

        {activeJob && (
          <div className="px-4 mb-3">
            <p className="text-sm font-semibold text-siterun-navy mb-2">{t("quickReorder")}</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {chips.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => handleChip(chip.id)}
                  className="shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-2xl bg-white border-2 border-slate-200 active:border-siterun-orange min-w-[96px]"
                >
                  <span className="text-2xl">{chip.emoji}</span>
                  <span className="text-xs font-semibold text-siterun-navy text-center leading-tight">
                    {"labelEn" in chip && chip.id === "job-type-repeat"
                      ? locale === "hi"
                        ? chip.labelHi
                        : chip.labelEn
                      : repeatChipLabel(chip.id, locale)}
                  </span>
                  {chip.id === "job-type-repeat" && (
                    <RotateCcw size={12} className="text-siterun-slate" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="px-4 pb-6 space-y-2">
          <button
            type="button"
            onClick={orderMaterials}
            className="w-full py-4 rounded-2xl bg-siterun-orange text-white font-bold text-lg active:opacity-90 shadow-md disabled:opacity-50"
          >
            {t("orderMaterials")}
          </button>
          {cartCount > 0 && (
            <button
              type="button"
              onClick={() => setScreen("cart")}
              className="w-full py-3 rounded-2xl border-2 border-siterun-navy text-siterun-navy font-semibold"
            >
              {t("viewCart")} ({cartCount})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
