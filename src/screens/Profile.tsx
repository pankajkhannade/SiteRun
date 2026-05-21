import { Check, MapPin, TrendingUp } from "lucide-react";
import { CONTRACTOR } from "../data";
import { useApp } from "../context";
import { useTranslation } from "../i18n";
import { contractorName, contractorTrade } from "../i18n/labels";
import { siteLabel } from "../lib/jobs";
import { Header } from "../components/Header";
import { LanguageToggle } from "../components/LanguageToggle";

export function ProfileScreen() {
  const {
    locale,
    activeJob,
    jobSites,
    isOfflineMode,
    setIsOfflineMode,
    syncOfflineQueue,
    logout,
    setScreen,
    offlineQueueCount,
    weeklyMetrics,
  } = useApp();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-full">
      <Header title={t("profileTitle")} showBack onBack={() => setScreen("home")} />
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        <section>
          <p className="text-xs font-semibold text-siterun-slate uppercase mb-2 flex items-center gap-1">
            <TrendingUp size={14} />
            {t("yourImpact")}
          </p>
          <div className="p-4 rounded-2xl bg-siterun-navy text-white">
            <p className="text-3xl font-bold tabular-nums">
              {weeklyMetrics.hoursSaved}
              <span className="text-base font-semibold text-siterun-amber ml-1">
                {t("hoursSavedUnit")}
              </span>
            </p>
            <p className="text-xs text-white/70 mt-1">{t("hoursSavedHint")}</p>
            <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
              <div>
                <p className="text-white/60 text-xs">{t("impactTrips")}</p>
                <p className="font-bold">{weeklyMetrics.tripsAvoided}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs">{t("impactStreak")}</p>
                <p className="font-bold">{weeklyMetrics.weekStreak}</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <p className="text-xs font-semibold text-siterun-slate uppercase mb-2">{t("account")}</p>
          <div className="p-4 rounded-2xl bg-white border border-slate-200">
            <p className="font-bold text-siterun-navy text-lg">{contractorName(locale)}</p>
            <p className="text-sm text-siterun-slate">{contractorTrade(locale)}</p>
            <p className="text-sm text-siterun-slate mt-1">{CONTRACTOR.phone}</p>
          </div>
        </section>

        <section>
          <p className="text-xs font-semibold text-siterun-slate uppercase mb-2">{t("language")}</p>
          <div className="p-4 rounded-2xl bg-white border border-slate-200">
            <LanguageToggle />
          </div>
        </section>

        <section>
          <p className="text-xs font-semibold text-siterun-slate uppercase mb-2">{t("jobSites")}</p>
          <ul className="space-y-2">
            {jobSites.map((site) => (
              <li
                key={site.id}
                className={`p-3 rounded-xl border flex items-start gap-2 ${
                  activeJob?.siteId === site.id
                    ? "border-siterun-orange bg-siterun-orange-light"
                    : "border-slate-200 bg-white"
                }`}
              >
                <MapPin size={16} className="text-siterun-orange shrink-0 mt-0.5" />
                <span className="text-sm text-siterun-navy">{siteLabel(site, locale)}</span>
                {activeJob?.siteId === site.id && (
                  <Check size={16} className="text-siterun-orange ml-auto shrink-0" />
                )}
              </li>
            ))}
          </ul>
          <p className="text-xs text-siterun-slate mt-2">{t("addNewSite")} — {t("addJobTitle")}</p>
        </section>

        <section>
          <p className="text-xs font-semibold text-siterun-slate uppercase mb-2">{t("preferences")}</p>
          <button
            type="button"
            onClick={() => setIsOfflineMode(!isOfflineMode)}
            className={`w-full p-4 rounded-2xl border-2 text-left ${
              isOfflineMode ? "border-amber-500 bg-amber-50" : "border-slate-200 bg-white"
            }`}
          >
            <p className="font-semibold text-siterun-navy">{t("simulateOffline")}</p>
            <p className="text-xs text-siterun-slate mt-1">{t("simulateOfflineHint")}</p>
            {offlineQueueCount > 0 && (
              <p className="text-sm text-amber-700 font-medium mt-2">
                {offlineQueueCount}{" "}
                {offlineQueueCount === 1 ? t("offlineQueued") : t("offlineQueuedPlural")}
              </p>
            )}
          </button>
          {isOfflineMode && (
            <button
              type="button"
              onClick={() => {
                setIsOfflineMode(false);
                syncOfflineQueue();
              }}
              className="w-full mt-2 py-3 rounded-xl bg-siterun-green text-white font-semibold"
            >
              {t("goOnline")}
            </button>
          )}
        </section>

        <button
          type="button"
          onClick={logout}
          className="w-full py-3 rounded-2xl border-2 border-red-200 text-red-600 font-semibold"
        >
          {t("logout")}
        </button>
      </div>
    </div>
  );
}
