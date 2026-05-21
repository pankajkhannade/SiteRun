import { Check, Plus } from "lucide-react";
import { getProduct } from "../data";
import { useApp } from "../context";
import { useTranslation } from "../i18n";
import { activeJobTitle, jobSiteLabel, productName } from "../i18n/labels";
import {
  gapCartTotal,
  gapLineCount,
  pendingChecklistCount,
  progressPercent,
} from "../lib/checklist";
import { ChecklistGapBanner } from "../components/ChecklistGapBanner";
import { Header } from "../components/Header";

export function JobScreen() {
  const {
    activeJob,
    toggleChecklistItem,
    addChecklistToCart,
    addChecklistGapsToCart,
    checklistGaps,
    setScreen,
    locale,
    jobSites,
  } = useApp();
  const { t } = useTranslation();

  if (!activeJob) {
    return (
      <div className="flex flex-col h-full">
        <Header title={t("activeJob")} showBack onBack={() => setScreen("home")} />
        <div className="flex-1 flex items-center justify-center px-6 text-center">
          <p className="text-siterun-slate">{t("noActiveJob")}</p>
          <button
            type="button"
            onClick={() => setScreen("addJob")}
            className="mt-4 py-3 px-6 rounded-2xl bg-siterun-orange text-white font-semibold"
          >
            {t("startJob")}
          </button>
        </div>
      </div>
    );
  }

  const pending = pendingChecklistCount(activeJob);
  const pct = progressPercent(activeJob);

  return (
    <div className="flex flex-col h-full">
      <Header title={t("activeJob")} showBack showCart onBack={() => setScreen("home")} />
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mb-4">
          <h2 className="font-bold text-siterun-navy text-lg">{activeJobTitle(activeJob, locale)}</h2>
          <p className="text-sm text-siterun-slate mt-1">
            {t("deliveringTo")}: {jobSiteLabel(jobSites, activeJob.siteId, locale)}
          </p>
          <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-siterun-green rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-siterun-slate mt-1">{t("jobProgress", { pct })}</p>
        </div>

        {checklistGaps.length > 0 && (
          <ChecklistGapBanner gaps={checklistGaps} onAddGaps={addChecklistGapsToCart} />
        )}

        <p className="text-sm font-semibold text-siterun-navy mb-3">{t("jobChecklist")}</p>
        <ul className="space-y-2">
          {activeJob.checklist.map((item) => {
            const p = getProduct(item.productId);
            if (!p) return null;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left ${
                    item.done
                      ? "bg-siterun-green-light border-siterun-green/30 opacity-80"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      item.done ? "bg-siterun-green text-white" : "bg-slate-100"
                    }`}
                  >
                    {item.done ? <Check size={18} /> : null}
                  </span>
                  <span className="text-2xl shrink-0">{p.emoji}</span>
                  <span className="flex-1 min-w-0">
                    <span
                      className={`font-semibold block ${item.done ? "line-through text-siterun-slate" : "text-siterun-navy"}`}
                    >
                      {productName(p, locale)}
                    </span>
                    <span className="text-sm text-siterun-navy mt-0.5">
                      {item.qty} {p.unit} · ₹{p.price * item.qty}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {pending > 0 && (
        <div className="shrink-0 p-4 border-t bg-white space-y-2">
          {checklistGaps.length > 0 && (
            <p className="text-xs text-center text-siterun-slate">
              {t("checklistGapDetail", {
                n: gapLineCount(checklistGaps),
                amount: gapCartTotal(checklistGaps),
              })}
            </p>
          )}
          <button
            type="button"
            onClick={() => {
              if (checklistGaps.length > 0) addChecklistGapsToCart();
              else addChecklistToCart();
              setScreen("cart");
            }}
            className="w-full py-4 rounded-2xl bg-siterun-orange text-white font-bold flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            {checklistGaps.length > 0
              ? t("addMissingChecklist")
              : t("pendingCount", { n: pending })}
          </button>
        </div>
      )}
    </div>
  );
}
