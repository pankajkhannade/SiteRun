import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Phone } from "lucide-react";
import { getProduct } from "../data";
import { useApp } from "../context";
import { useTranslation } from "../i18n";
import { productName } from "../i18n/labels";
import { deliveryMinutesRemaining } from "../lib/delivery";
import { Header } from "../components/Header";
import type { OrderStatus } from "../types";

export function TrackingScreen() {
  const { activeOrder, liveOrders, trackOrder, setScreen, advanceOrderStatus, locale } =
    useApp();
  const { t } = useTranslation();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 15000);
    return () => clearInterval(id);
  }, []);

  void tick;

  useEffect(() => {
    if (!activeOrder) setScreen("home");
  }, [activeOrder, setScreen]);

  if (!activeOrder) return null;

  const steps: { status: OrderStatus; label: string }[] = [
    { status: "confirmed", label: t("confirmed") },
    { status: "picking", label: t("picking") },
    { status: "out_for_delivery", label: t("onTheWay") },
    { status: "delivered", label: t("delivered") },
  ];

  const statusIndex = steps.findIndex((s) => s.status === activeOrder.status);
  const minutesLeft = deliveryMinutesRemaining(activeOrder);
  const jobName = locale === "hi" ? activeOrder.jobNameHi : activeOrder.jobNameEn;

  return (
    <div className="flex flex-col h-full">
      <Header title={t("trackOrder")} showBack onBack={() => setScreen("home")} />
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {liveOrders.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1">
            {liveOrders.map((order) => {
              const name = locale === "hi" ? order.jobNameHi : order.jobNameEn;
              const isActive = order.id === activeOrder.id;
              return (
                <button
                  key={order.id}
                  type="button"
                  onClick={() => trackOrder(order.id)}
                  className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold border-2 ${
                    isActive
                      ? "border-siterun-orange bg-siterun-orange-light text-siterun-navy"
                      : "border-slate-200 bg-white text-siterun-slate"
                  }`}
                >
                  {name.split(" ")[0]} · {order.id.slice(-4)}
                </button>
              );
            })}
          </div>
        )}
        <div className="text-center py-6 rounded-2xl bg-siterun-navy text-white mb-4">
          <p className="text-4xl font-bold tabular-nums">{minutesLeft}</p>
          <p className="text-sm opacity-90">{t("minLeft")}</p>
          <p className="text-xs mt-2 opacity-70 font-mono">{activeOrder.id}</p>
        </div>

        <p className="text-sm text-siterun-slate mb-4">{jobName}</p>

        <ul className="space-y-0 mb-6">
          {steps.map((step, i) => {
            const done = i <= statusIndex;
            const current = i === statusIndex;
            return (
              <li key={step.status} className="flex gap-3">
                <div className="flex flex-col items-center">
                  {done ? (
                    <CheckCircle2 className="text-siterun-green" size={24} />
                  ) : (
                    <Circle className="text-slate-300" size={24} />
                  )}
                  {i < steps.length - 1 && (
                    <div className={`w-0.5 flex-1 min-h-[32px] ${done ? "bg-siterun-green" : "bg-slate-200"}`} />
                  )}
                </div>
                <div className={`pb-6 ${current ? "font-bold text-siterun-navy" : "text-siterun-slate"}`}>
                  {step.label}
                </div>
              </li>
            );
          })}
        </ul>

        <p className="text-sm font-semibold text-siterun-navy mb-2">{t("items")}</p>
        <ul className="space-y-2 text-sm">
          {activeOrder.items.map((item) => {
            const p = getProduct(item.productId);
            return (
              <li key={item.productId} className="flex justify-between text-siterun-slate">
                <span>
                  {p ? productName(p, locale) : item.productId} × {item.qty}
                </span>
                <span>₹{(p?.price ?? 0) * item.qty}</span>
              </li>
            );
          })}
        </ul>
        <p className="font-bold text-siterun-navy mt-3 text-right">₹{activeOrder.total}</p>

        {activeOrder.status !== "delivered" && (
          <button
            type="button"
            onClick={() => advanceOrderStatus()}
            className="mt-4 w-full py-2 text-xs text-siterun-slate border border-dashed rounded-lg"
          >
            {t("demoNextStatus")}
          </button>
        )}
      </div>

      <div className="shrink-0 p-4 border-t">
        <button
          type="button"
          className="w-full py-3 rounded-xl border-2 border-siterun-navy text-siterun-navy font-semibold flex items-center justify-center gap-2"
        >
          <Phone size={18} />
          {t("callStore")}
        </button>
      </div>
    </div>
  );
}
