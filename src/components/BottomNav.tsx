import { Briefcase, Headphones, Home, Package, User } from "lucide-react";
import { useApp } from "../context";
import { useTranslation } from "../i18n";

export function BottomNav() {
  const { screen, setScreen, setCatalogCategory, setSearchQuery, demoMode, isAuthenticated } = useApp();
  const { t } = useTranslation();

  if (demoMode === "ops" || !isAuthenticated) return null;

  const tabs = [
    { id: "home" as const, icon: Home, label: t("navHome") },
    { id: "job" as const, icon: Briefcase, label: t("navJob") },
    { id: "orders" as const, icon: Package, label: t("navOrders") },
    { id: "copilot" as const, icon: Headphones, label: t("navCopilot") },
    { id: "profile" as const, icon: User, label: t("navProfile") },
  ];

  return (
    <nav className="shrink-0 border-t border-slate-200 bg-white px-1 pb-1 pt-1">
      <div className="flex justify-around">
        {tabs.map(({ id, icon: Icon, label }) => {
          const active = screen === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                setCatalogCategory(null);
                setSearchQuery("");
                setScreen(id);
              }}
              className={`flex flex-col items-center py-2 px-2 min-w-[64px] rounded-xl transition-colors ${
                active ? "text-siterun-orange" : "text-siterun-slate"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-semibold mt-0.5 leading-tight text-center">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
