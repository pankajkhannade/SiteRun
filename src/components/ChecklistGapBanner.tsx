import { ListChecks, Plus } from "lucide-react";
import { gapCartTotal, gapLineCount } from "../lib/checklist";
import type { ChecklistGap } from "../lib/checklist";
import { useTranslation } from "../i18n";

export function ChecklistGapBanner({
  gaps,
  onAddGaps,
  compact,
}: {
  gaps: ChecklistGap[];
  onAddGaps: () => void;
  compact?: boolean;
}) {
  const { t } = useTranslation();
  if (gaps.length === 0) return null;

  const lines = gapLineCount(gaps);
  const total = gapCartTotal(gaps);

  return (
    <div
      className={`rounded-xl border-2 border-amber-300 bg-amber-50 ${
        compact ? "p-3" : "p-4 mb-3"
      }`}
    >
      <div className="flex items-start gap-2">
        <ListChecks size={20} className="text-amber-700 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-amber-950">{t("checklistGapTitle")}</p>
          <p className="text-xs text-amber-900/80 mt-0.5">
            {t("checklistGapDetail", { n: lines, amount: total })}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onAddGaps}
        className="mt-3 w-full py-2.5 rounded-lg bg-amber-600 text-white text-sm font-semibold flex items-center justify-center gap-2"
      >
        <Plus size={16} />
        {t("addMissingChecklist")}
      </button>
    </div>
  );
}
