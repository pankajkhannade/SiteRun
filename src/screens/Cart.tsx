import { Clock, Truck } from "lucide-react";
import { getProduct } from "../data";
import { useApp } from "../context";
import { useTranslation } from "../i18n";
import { activeJobTitle, jobSiteLabel, productName } from "../i18n/labels";
import { etaMinutesForWindow } from "../lib/delivery";
import type { DeliveryWindow } from "../types";
import { ChecklistGapBanner } from "../components/ChecklistGapBanner";
import { Header } from "../components/Header";

export function CartScreen() {
  const {
    cart,
    setCartQty,
    setScreen,
    placeOrder,
    cartTotalAmount,
    locale,
    activeJob,
    jobSites,
    isOfflineMode,
    checklistGaps,
    addChecklistGapsToCart,
    deliveryWindow,
    setDeliveryWindow,
  } = useApp();
  const { t } = useTranslation();

  if (cart.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <Header title={t("cart")} showBack onBack={() => setScreen("home")} />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <p className="text-siterun-navy font-semibold">{t("cartEmpty")}</p>
          <button
            type="button"
            onClick={() => setScreen("catalog")}
            className="mt-6 px-6 py-3 rounded-2xl bg-siterun-orange text-white font-semibold"
          >
            {t("browseMaterials")}
          </button>
        </div>
      </div>
    );
  }

  if (!activeJob) {
    return (
      <div className="flex flex-col h-full">
        <Header title={t("cart")} showBack onBack={() => setScreen("home")} />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <p className="text-siterun-navy font-semibold">{t("orderNeedsJob")}</p>
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

  return (
    <div className="flex flex-col h-full">
      <Header title={t("cart")} showBack onBack={() => setScreen("home")} />
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        <div className="p-3 rounded-xl bg-siterun-navy/5 border border-siterun-navy/10 mb-2">
          <p className="text-xs text-siterun-slate">{t("activeJob")}</p>
          <p className="text-sm font-bold text-siterun-navy">{activeJobTitle(activeJob, locale)}</p>
          <p className="text-xs text-siterun-slate mt-1 flex items-center gap-1">
            <Truck size={12} />
            {t("deliveringTo")}: {jobSiteLabel(jobSites, activeJob.siteId, locale)}
          </p>
        </div>

        {checklistGaps.length > 0 && (
          <ChecklistGapBanner
            gaps={checklistGaps}
            onAddGaps={addChecklistGapsToCart}
            compact
          />
        )}

        <div className="p-3 rounded-xl bg-white border border-slate-200 mb-2">
          <p className="text-xs font-semibold text-siterun-slate uppercase mb-2 flex items-center gap-1">
            <Clock size={12} />
            {t("deliveryWindow")}
          </p>
          <div className="flex gap-2">
            {(["asap", "flex"] as DeliveryWindow[]).map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setDeliveryWindow(w)}
                className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-semibold border-2 ${
                  deliveryWindow === w
                    ? "border-siterun-orange bg-siterun-orange-light text-siterun-navy"
                    : "border-slate-200 text-siterun-slate"
                }`}
              >
                {w === "asap" ? t("deliverAsap") : t("deliverFlex")}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-siterun-slate mt-2">{t("deliveryWindowHint")}</p>
        </div>

        {cart.map((item) => {
          const p = getProduct(item.productId);
          if (!p) return null;
          return (
            <div key={item.productId} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
              <span className="text-2xl">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-siterun-navy">{productName(p, locale)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCartQty(item.productId, item.qty - 1)}
                  className="w-10 h-10 rounded-lg bg-white border font-bold text-lg"
                >
                  −
                </button>
                <span className="w-6 text-center font-bold">{item.qty}</span>
                <button
                  type="button"
                  onClick={() => setCartQty(item.productId, item.qty + 1)}
                  className="w-10 h-10 rounded-lg bg-siterun-orange text-white font-bold text-lg"
                >
                  +
                </button>
              </div>
              <p className="font-bold text-siterun-navy w-14 text-right">₹{p.price * item.qty}</p>
            </div>
          );
        })}
      </div>

      <div className="shrink-0 p-4 border-t bg-white space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-siterun-green-light text-siterun-green">
          <Truck size={22} />
          <div>
            <p className="font-semibold text-sm">
              {t("deliveryIn", { n: etaMinutesForWindow(deliveryWindow) })}
            </p>
            <p className="text-xs opacity-80">{t("deliveryHub")}</p>
          </div>
        </div>
        <div className="flex justify-between text-lg font-bold text-siterun-navy">
          <span>{t("total")}</span>
          <span>₹{cartTotalAmount}</span>
        </div>
        <p className="text-xs text-siterun-slate text-center">{t("payOnDelivery")}</p>
        {isOfflineMode && (
          <p className="text-xs text-amber-700 text-center font-medium">{t("offlineQueued")}</p>
        )}
        <button
          type="button"
          onClick={() => placeOrder()}
          className="w-full py-4 rounded-2xl bg-siterun-orange text-white font-bold text-lg"
        >
          {t("confirmOrder")}
        </button>
      </div>
    </div>
  );
}
