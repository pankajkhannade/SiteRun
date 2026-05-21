import { useApp } from "../context";
import type { Locale } from "../i18n/types";
import { useTranslation } from "../i18n";

export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useApp();
  const { t } = useTranslation();

  const options: { id: Locale; label: string }[] = [
    { id: "en", label: "EN" },
    { id: "hi", label: "हिं" },
  ];

  return (
    <div
      className={`flex rounded-lg bg-slate-200/80 p-0.5 ${compact ? "scale-90 origin-right" : ""}`}
      role="group"
      aria-label={t("language")}
    >
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => setLocale(opt.id)}
          className={`min-w-[40px] px-2.5 py-1.5 rounded-md text-xs font-bold transition-all ${
            locale === opt.id
              ? "bg-white text-siterun-navy shadow-sm"
              : "text-siterun-slate active:bg-white/50"
          }`}
          aria-pressed={locale === opt.id}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
