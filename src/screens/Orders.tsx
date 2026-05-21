import { useApp } from "../context";
import { useTranslation } from "../i18n";
import { Header } from "../components/Header";

export function OrdersScreen() {
  const { liveOrders, trackOrder, pastOrders, reorderPast, locale } = useApp();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-full">
      <Header title={t("myOrders")} showCart />
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {liveOrders.length > 0 && (
          <>
            <p className="text-xs font-semibold text-siterun-slate uppercase mb-2">
              {liveOrders.length > 1 ? t("activeOrders") : t("active")}
            </p>
            <ul className="space-y-3 mb-4">
              {liveOrders.map((order) => (
                <li key={order.id}>
                  <button
                    type="button"
                    onClick={() => trackOrder(order.id)}
                    className="w-full p-4 rounded-2xl border-2 border-siterun-orange bg-siterun-orange-light text-left"
                  >
                    <p className="font-bold text-siterun-navy">
                      {locale === "hi" ? order.jobNameHi : order.jobNameEn}
                    </p>
                    <p className="text-sm text-siterun-slate">
                      {order.id} · ₹{order.total}
                    </p>
                    <p className="text-sm text-siterun-green font-medium mt-2">{t("track")} →</p>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {liveOrders.length === 0 && (
          <div className="text-center py-8 text-siterun-slate mb-4">
            <p>{t("noActiveOrders")}</p>
          </div>
        )}

        <p className="text-xs font-semibold text-siterun-slate uppercase mb-2">{t("pastOrders")}</p>
        <ul className="space-y-3">
          {pastOrders.map((order) => (
            <li key={order.id} className="p-4 rounded-2xl bg-white border border-slate-200">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <p className="font-medium text-siterun-navy">
                    {locale === "hi" ? order.jobNameHi : order.jobNameEn}
                  </p>
                  <p className="text-xs text-siterun-slate mt-0.5">
                    {locale === "hi" ? order.dateHi : order.dateEn} · {order.id}
                  </p>
                </div>
                <span className="text-xs text-siterun-green font-semibold">{t("deliveredStatus")}</span>
              </div>
              <p className="text-sm text-siterun-slate mt-2">
                {order.items.length} {t("items").toLowerCase()} · ₹{order.total}
              </p>
              <button
                type="button"
                onClick={() => reorderPast(order)}
                className="mt-3 w-full py-2.5 rounded-xl bg-siterun-navy text-white text-sm font-semibold"
              >
                {t("reorder")}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
