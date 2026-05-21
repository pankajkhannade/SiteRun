import { Search, X } from "lucide-react";
import { useTranslation } from "../i18n";

export function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="px-4 pb-2">
      <div className="relative flex items-center">
        <Search size={18} className="absolute left-3 text-siterun-slate" />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full pl-10 pr-10 py-3 rounded-xl border-2 border-slate-200 bg-white text-siterun-navy text-sm focus:border-siterun-orange focus:outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-siterun-slate"
            aria-label="Clear"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
