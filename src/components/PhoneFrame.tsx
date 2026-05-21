import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-4 md:p-8">
      <div className="hidden md:flex items-center gap-3 mb-4 text-siterun-slate text-sm">
        <span className="w-2 h-2 rounded-full bg-siterun-green animate-pulse" />
        Demo mode — phone viewport on laptop
      </div>
      <div
        className="relative w-full max-w-[390px] h-[min(844px,92dvh)] bg-white rounded-[2rem] shadow-2xl shadow-siterun-navy/20 overflow-hidden flex flex-col border-[6px] border-siterun-navy/90"
        style={{ minHeight: "640px" }}
      >
        <div className="h-7 bg-siterun-navy flex items-center justify-center shrink-0">
          <div className="w-24 h-4 bg-black/40 rounded-full" />
        </div>
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">{children}</div>
        <div className="h-5 bg-white shrink-0 flex justify-center items-start pt-1">
          <div className="w-28 h-1 bg-siterun-navy/20 rounded-full" />
        </div>
      </div>
      <p className="hidden md:block mt-4 text-xs text-siterun-slate max-w-[390px] text-center">
        Tip: Zoom browser to 100%. Use bottom nav + co-pilot FAB for the interview story.
      </p>
    </div>
  );
}
