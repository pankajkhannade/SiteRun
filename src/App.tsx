import { AppProvider, useApp } from "./context";
import { PhoneFrame } from "./components/PhoneFrame";
import { BottomNav } from "./components/BottomNav";
import { CopilotFab } from "./components/CopilotFab";
import { LanguageToggle } from "./components/LanguageToggle";
import { HomeScreen } from "./screens/Home";
import { JobScreen } from "./screens/Job";
import { CatalogScreen } from "./screens/Catalog";
import { CartScreen } from "./screens/Cart";
import { TrackingScreen } from "./screens/Tracking";
import { OrdersScreen } from "./screens/Orders";
import { CopilotScreen } from "./screens/Copilot";
import { OpsScreen } from "./screens/Ops";
import { LoginScreen } from "./screens/Login";
import { ProfileScreen } from "./screens/Profile";
import { AddJobScreen } from "./screens/AddJob";
import { JobsScreen } from "./screens/Jobs";
import { useTranslation } from "./i18n";
import { Settings } from "lucide-react";

function AppContent() {
  const { screen, demoMode, setDemoMode, setScreen, isAuthenticated } = useApp();
  const { t } = useTranslation();

  const renderScreen = () => {
    if (!isAuthenticated) return <LoginScreen />;
    if (demoMode === "ops") return <OpsScreen />;
    switch (screen) {
      case "login":
        return <HomeScreen />;
      case "home":
        return <HomeScreen />;
      case "job":
        return <JobScreen />;
      case "addJob":
        return <AddJobScreen />;
      case "jobs":
        return <JobsScreen />;
      case "catalog":
        return <CatalogScreen />;
      case "cart":
        return <CartScreen />;
      case "tracking":
        return <TrackingScreen />;
      case "orders":
        return <OrdersScreen />;
      case "copilot":
        return <CopilotScreen />;
      case "profile":
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const isOps = demoMode === "ops" && isAuthenticated;

  return (
    <PhoneFrame>
      <div
        className={`flex flex-col h-full min-h-0 relative ${isOps ? "bg-slate-900" : "bg-slate-50"}`}
      >
        {isAuthenticated && !isOps && (
          <div className="shrink-0 flex items-center justify-between gap-2 px-3 py-1.5 bg-white border-b border-slate-100">
            <span className="text-[10px] font-semibold text-siterun-navy tracking-wide truncate">
              {t("appName")} · {t("appTagline")}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <LanguageToggle compact />
              <button
                type="button"
                onClick={() => {
                  setDemoMode("ops");
                  setScreen("ops");
                }}
                className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md bg-slate-800 text-white font-medium"
              >
                <Settings size={12} />
                {t("opsView")}
              </button>
            </div>
          </div>
        )}
        <div className="flex-1 min-h-0 overflow-hidden relative">{renderScreen()}</div>
        {!isOps && <CopilotFab />}
        {!isOps && <BottomNav />}
      </div>
    </PhoneFrame>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
