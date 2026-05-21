import { Sparkles } from "lucide-react";
import { useApp } from "../context";
import { useTranslation } from "../i18n";

export function CopilotFab() {
  const { setScreen, demoMode, screen, isAuthenticated, activeJob } = useApp();
  const { t } = useTranslation();

  if (demoMode === "ops" || !isAuthenticated || !activeJob) return null;
  if (screen === "cart" || screen === "tracking" || screen === "copilot" || screen === "login") return null;

  return (
    <button
      type="button"
      onClick={() => setScreen("copilot")}
      className="absolute bottom-[4.5rem] right-4 z-20 flex items-center gap-2 bg-siterun-navy text-white pl-4 pr-5 py-3 rounded-full shadow-lg shadow-siterun-navy/30 active:scale-95 transition-transform"
    >
      <Sparkles size={18} className="text-siterun-amber" />
      <span className="text-sm font-semibold">{t("copilotFab")}</span>
    </button>
  );
}
