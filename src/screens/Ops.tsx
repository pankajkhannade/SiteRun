import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Package,
  Phone,
  User,
} from "lucide-react";
import { CONTRACTOR, getProduct } from "../data";
import { useApp } from "../context";
import { useTranslation } from "../i18n";
import { productName } from "../i18n/labels";
import { getPickLocation, sortItemsForPick } from "../lib/pickLocations";
import {
  formatCountdown,
  orderLineCount,
  slaLevel,
  slaSecondsRemaining,
  sortOrdersBySlaUrgency,
} from "../lib/opsSla";
import type { OrderStatus } from "../types";

function statusLabelKey(status: OrderStatus): "opsStatusNew" | "opsStatusPicking" | "opsStatusPacked" | "opsStatusDone" {
  switch (status) {
    case "confirmed":
      return "opsStatusNew";
    case "picking":
      return "opsStatusPicking";
    case "out_for_delivery":
      return "opsStatusPacked";
    case "delivered":
      return "opsStatusDone";
  }
}

export function OpsScreen() {
  const {
    offlineQueue,
    opsLiveOrders,
    advanceOrderStatus,
    setDemoMode,
    setScreen,
    locale,
    jobSites,
  } = useApp();
  const { t } = useTranslation();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pickedByOrder, setPickedByOrder] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const [tick, setTick] = useState(0);

  const sortedQueue = useMemo(
    () => sortOrdersBySlaUrgency(opsLiveOrders),
    [opsLiveOrders, tick]
  );

  const selectedOrder =
    opsLiveOrders.find((o) => o.id === selectedId) ?? sortedQueue[0] ?? null;

  const picked = selectedOrder
    ? (pickedByOrder[selectedOrder.id] ?? {})
    : {};

  useEffect(() => {
    if (!selectedId && sortedQueue[0]) setSelectedId(sortedQueue[0].id);
  }, [selectedId, sortedQueue]);

  useEffect(() => {
    if (selectedId && !opsLiveOrders.some((o) => o.id === selectedId)) {
      setSelectedId(sortedQueue[0]?.id ?? null);
    }
  }, [opsLiveOrders, selectedId, sortedQueue]);

  useEffect(() => {
    const id = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, []);

  void tick;

  const sortedItems = useMemo(
    () => (selectedOrder ? sortItemsForPick(selectedOrder.items) : []),
    [selectedOrder]
  );

  const pickedCount = sortedItems.filter((i) => picked[i.productId]).length;
  const allPicked = sortedItems.length > 0 && pickedCount === sortedItems.length;

  const site = selectedOrder
    ? jobSites.find((s) => s.id === selectedOrder.siteId)
    : null;
  const siteLabel = site
    ? locale === "hi"
      ? site.labelHi
      : site.labelEn
    : "";

  const slaRem = selectedOrder ? slaSecondsRemaining(selectedOrder) : 0;
  const sla = selectedOrder ? slaLevel(selectedOrder) : "ok";

  const handlePrimaryAction = () => {
    if (!selectedOrder) return;
    if (selectedOrder.status === "confirmed") {
      advanceOrderStatus(selectedOrder.id);
      return;
    }
    if (selectedOrder.status === "picking") {
      if (!allPicked) return;
      advanceOrderStatus(selectedOrder.id);
      return;
    }
    if (selectedOrder.status === "out_for_delivery") {
      advanceOrderStatus(selectedOrder.id);
    }
  };

  const primaryLabel = () => {
    if (!selectedOrder) return "";
    if (selectedOrder.status === "confirmed") return t("opsStartPicking");
    if (selectedOrder.status === "picking") return t("opsMarkPacked");
    if (selectedOrder.status === "out_for_delivery") return t("opsCompleteDelivery");
    return "";
  };

  const queueCount = opsLiveOrders.length + offlineQueue.length;

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      <header className="shrink-0 px-4 py-3 bg-slate-950 border-b border-white/10">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-bold text-base">{t("opsHub")}</p>
            <p className="text-xs text-white/60">{t("opsPickerMode")}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setDemoMode("contractor");
              setScreen("home");
            }}
            className="text-xs px-3 py-2 rounded-lg bg-white/10 font-medium shrink-0"
          >
            {t("contractorApp")} →
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <StatPill label={t("opd")} value="12" />
          <StatPill label={t("slaHit")} value="94%" accent="green" />
          <StatPill label={t("pickTime")} value="4.2m" accent="orange" />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto min-h-0">
        {queueCount === 0 ? (
          <div className="p-8 text-center">
            <Package size={48} className="mx-auto opacity-40 mb-4" />
            <p className="font-semibold text-lg">{t("opsNoOrders")}</p>
            <p className="text-sm text-white/60 mt-2">{t("opsNoOrdersHint")}</p>
          </div>
        ) : (
          <>
            {selectedOrder && (
              <div
                className={`mx-4 mt-4 p-4 rounded-2xl border-2 ${
                  sla === "critical"
                    ? "bg-red-950 border-red-500"
                    : sla === "warning"
                      ? "bg-amber-950 border-amber-500"
                      : "bg-emerald-950 border-emerald-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide opacity-80">
                      {sla === "critical"
                        ? t("opsSlaLate")
                        : sla === "warning"
                          ? t("opsSlaLate")
                          : t("opsSlaOk")}
                    </p>
                    <p className="text-4xl font-bold tabular-nums mt-1">
                      {formatCountdown(slaRem)}
                    </p>
                    <p className="text-sm opacity-80">{t("opsSlaDue")}</p>
                  </div>
                  {sla === "ok" ? (
                    <CheckCircle2 size={40} className="text-emerald-400" />
                  ) : (
                    <AlertTriangle size={40} className="text-amber-400" />
                  )}
                </div>
              </div>
            )}

            <div className="px-4 mt-4">
              <p className="text-xs font-semibold text-white/50 uppercase mb-2">
                {t("queue")} · {t("opsOrdersWaiting", { n: queueCount })}
              </p>
              {opsLiveOrders.length > 1 && (
                <p className="text-[11px] text-white/50 mb-2">{t("opsTapToSwitch")}</p>
              )}
              <div className="space-y-2">
                {sortedQueue.map((order) => {
                  const rem = slaSecondsRemaining(order);
                  const cardSla = slaLevel(order);
                  return (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => setSelectedId(order.id)}
                    className={`w-full p-3 rounded-xl text-left border-2 transition-colors ${
                      selectedOrder?.id === order.id
                        ? "border-siterun-orange bg-white/10"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="font-mono font-bold text-sm">{order.id}</p>
                        <p className="text-xs text-white/70 mt-0.5 line-clamp-1">
                          {locale === "hi" ? order.jobNameHi : order.jobNameEn}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-siterun-orange text-white">
                          {t(statusLabelKey(order.status))}
                        </span>
                        <span
                          className={`text-[10px] font-mono tabular-nums ${
                            cardSla === "critical"
                              ? "text-red-300"
                              : cardSla === "warning"
                                ? "text-amber-300"
                                : "text-emerald-300"
                          }`}
                        >
                          {formatCountdown(rem)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm mt-2 font-semibold">
                      ₹{order.total} · {orderLineCount(order)} units
                    </p>
                  </button>
                  );
                })}
                {offlineQueue.map((order) => (
                  <div
                    key={order.id}
                    className="p-3 rounded-xl border border-dashed border-amber-500/50 bg-amber-950/40"
                  >
                    <p className="font-mono text-sm text-amber-200">{order.id}</p>
                    <p className="text-xs text-amber-200/80 mt-1">{t("opsPendingSync")}</p>
                    <p className="text-[10px] text-amber-200/60">{t("opsPendingSyncHint")}</p>
                  </div>
                ))}
              </div>
            </div>

            {selectedOrder && (
              <>
                <div className="mx-4 mt-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-xs text-white/50 uppercase mb-2">{t("opsDeliveryTo")}</p>
                  <p className="flex items-start gap-2 text-sm font-medium">
                    <MapPin size={16} className="shrink-0 mt-0.5 text-siterun-orange" />
                    {siteLabel}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-white/80 mt-2">
                    <User size={16} />
                    {t("opsContractor")}:{" "}
                    {locale === "hi" ? CONTRACTOR.nameHi : CONTRACTOR.nameEn}
                  </p>
                  <p className="text-xs text-white/50 mt-1">
                    {t("opsItemsToPick", {
                      n: orderLineCount(selectedOrder),
                      lines: selectedOrder.items.length,
                    })}
                  </p>
                </div>

                <div className="px-4 mt-2 mb-24">
                  <p className="text-xs font-semibold text-white/50 uppercase mb-2 flex items-center gap-2">
                    <Package size={14} />
                    {t("opsPickRoute")} ({pickedCount}/{sortedItems.length})
                  </p>
                  <ul className="space-y-2">
                    {sortedItems.map((item) => {
                      const p = getProduct(item.productId);
                      const loc = getPickLocation(item.productId);
                      const isPicked = !!picked[item.productId];
                      const canPick = selectedOrder.status === "picking";

                      return (
                        <li key={item.productId}>
                          <button
                            type="button"
                            disabled={!canPick}
                            onClick={() => {
                              if (!selectedOrder) return;
                              setPickedByOrder((prev) => {
                                const orderPicked = prev[selectedOrder.id] ?? {};
                                return {
                                  ...prev,
                                  [selectedOrder.id]: {
                                    ...orderPicked,
                                    [item.productId]: !orderPicked[item.productId],
                                  },
                                };
                              });
                            }}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-colors ${
                              isPicked
                                ? "bg-emerald-900/50 border-emerald-500"
                                : "bg-white/5 border-white/10"
                            } ${!canPick ? "opacity-70" : "active:scale-[0.99]"}`}
                          >
                            <span
                              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-bold text-lg ${
                                isPicked ? "bg-emerald-500 text-white" : "bg-white/10"
                              }`}
                            >
                              {isPicked ? <Check size={22} /> : item.qty}
                            </span>
                            <span className="text-2xl shrink-0">{p?.emoji}</span>
                            <span className="flex-1 min-w-0">
                              <p className="font-semibold text-sm leading-tight">
                                {p ? productName(p, locale) : item.productId}
                              </p>
                              <p className="text-xs text-white/60 mt-0.5">
                                {t("aisle")} {loc.aisle} · {t("opsBin")} {loc.bin}
                              </p>
                            </span>
                            <span className="text-xs font-mono text-white/40 shrink-0">
                              {loc.aisle}-{loc.bin}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {selectedOrder && selectedOrder.status !== "delivered" && (
        <div className="shrink-0 p-4 bg-slate-950 border-t border-white/10 space-y-2">
          {selectedOrder.status === "picking" && !allPicked && (
            <p className="text-xs text-center text-amber-300">{t("opsPickAllFirst")}</p>
          )}
          <button
            type="button"
            onClick={handlePrimaryAction}
            disabled={selectedOrder.status === "picking" && !allPicked}
            className="w-full py-4 rounded-2xl bg-siterun-orange text-white font-bold text-lg disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {primaryLabel()}
            <ChevronRight size={20} />
          </button>
          <button
            type="button"
            className="w-full py-2.5 rounded-xl border border-white/20 text-sm flex items-center justify-center gap-2 text-white/80"
          >
            <Phone size={16} />
            {t("callStore")}
          </button>
        </div>
      )}
    </div>
  );
}

function StatPill({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "green" | "orange";
}) {
  return (
    <div className="flex-1 rounded-lg bg-white/5 px-2 py-2 text-center">
      <p
        className={`text-lg font-bold tabular-nums ${
          accent === "green" ? "text-emerald-400" : accent === "orange" ? "text-siterun-amber" : ""
        }`}
      >
        {value}
      </p>
      <p className="text-[10px] text-white/50">{label}</p>
    </div>
  );
}
