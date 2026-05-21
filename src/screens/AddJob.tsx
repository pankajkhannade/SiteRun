import { useState } from "react";
import { Check, MapPin, Plus } from "lucide-react";
import { useApp } from "../context";
import { useTranslation } from "../i18n";
import { JOB_TYPES, siteLabel } from "../lib/jobs";
import type { JobType } from "../types";
import { Header } from "../components/Header";

export function AddJobScreen() {
  const { jobSites, addJobSite, createNewJob, setScreen, locale } = useApp();
  const { t } = useTranslation();
  const [step, setStep] = useState<1 | 2>(1);
  const [siteId, setSiteId] = useState<string | null>(jobSites[0]?.id ?? null);
  const [addingSite, setAddingSite] = useState(false);
  const [siteEn, setSiteEn] = useState("");
  const [siteHi, setSiteHi] = useState("");
  const [jobType, setJobType] = useState<JobType | null>(null);

  const handleAddSite = () => {
    const en = siteEn.trim();
    const hi = siteHi.trim() || en;
    if (!en) return;
    const id = addJobSite(en, hi);
    setSiteId(id);
    setAddingSite(false);
    setSiteEn("");
    setSiteHi("");
  };

  const handleCreate = () => {
    if (!siteId || !jobType) return;
    createNewJob(siteId, jobType);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <Header
        title={t("addJobTitle")}
        showBack
        onBack={() => (step === 2 ? setStep(1) : setScreen("home"))}
      />

      <div className="px-4 py-3 flex gap-2">
        <StepDot active={step >= 1} label={t("stepSite")} />
        <div className="flex-1 h-0.5 bg-slate-200 self-center" />
        <StepDot active={step >= 2} label={t("stepJobType")} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2">
        {step === 1 && (
          <>
            <p className="text-sm font-semibold text-siterun-navy mb-3">{t("pickSite")}</p>
            <ul className="space-y-2 mb-4">
              {jobSites.map((site) => (
                <li key={site.id}>
                  <button
                    type="button"
                    onClick={() => setSiteId(site.id)}
                    className={`w-full p-4 rounded-2xl border-2 text-left flex items-start gap-3 ${
                      siteId === site.id
                        ? "border-siterun-orange bg-siterun-orange-light"
                        : "border-slate-200"
                    }`}
                  >
                    <MapPin size={18} className="text-siterun-orange shrink-0 mt-0.5" />
                    <span className="flex-1 text-sm font-medium text-siterun-navy">
                      {siteLabel(site, locale)}
                    </span>
                    {siteId === site.id && <Check size={20} className="text-siterun-orange" />}
                  </button>
                </li>
              ))}
            </ul>

            {!addingSite ? (
              <button
                type="button"
                onClick={() => setAddingSite(true)}
                className="w-full py-3 rounded-xl border-2 border-dashed border-siterun-navy/30 text-siterun-navy font-semibold flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                {t("addNewSite")}
              </button>
            ) : (
              <div className="p-4 rounded-2xl border border-slate-200 space-y-3">
                <input
                  value={siteEn}
                  onChange={(e) => setSiteEn(e.target.value)}
                  placeholder={t("siteAreaPlaceholder")}
                  className="w-full py-3 px-3 rounded-xl border-2 border-slate-200 text-sm"
                />
                <input
                  value={siteHi}
                  onChange={(e) => setSiteHi(e.target.value)}
                  placeholder={t("siteNameHi")}
                  className="w-full py-3 px-3 rounded-xl border-2 border-slate-200 text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddSite}
                  className="w-full py-3 rounded-xl bg-siterun-navy text-white font-semibold"
                >
                  {t("addNewSite")}
                </button>
              </div>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-sm font-semibold text-siterun-navy mb-3">{t("stepJobType")}</p>
            <div className="grid grid-cols-2 gap-2 max-h-[min(420px,50vh)] overflow-y-auto pr-1">
              {JOB_TYPES.map((jt) => (
                <button
                  key={jt.id}
                  type="button"
                  onClick={() => setJobType(jt.id)}
                  className={`p-3 rounded-2xl border-2 text-center ${
                    jobType === jt.id
                      ? "border-siterun-orange bg-siterun-orange-light"
                      : "border-slate-200"
                  }`}
                >
                  <span className="text-3xl block mb-2">{jt.emoji}</span>
                  <span className="text-sm font-bold text-siterun-navy leading-tight block">
                    {locale === "hi" ? jt.titleHi : jt.titleEn}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="shrink-0 p-4 border-t">
        {step === 1 ? (
          <button
            type="button"
            disabled={!siteId}
            onClick={() => setStep(2)}
            className="w-full py-4 rounded-2xl bg-siterun-orange text-white font-bold disabled:opacity-40"
          >
            {t("next")}
          </button>
        ) : (
          <button
            type="button"
            disabled={!jobType}
            onClick={handleCreate}
            className="w-full py-4 rounded-2xl bg-siterun-orange text-white font-bold disabled:opacity-40"
          >
            {t("createJob")}
          </button>
        )}
      </div>
    </div>
  );
}

function StepDot({ active, label }: { active: boolean; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[72px]">
      <span
        className={`w-3 h-3 rounded-full ${active ? "bg-siterun-orange" : "bg-slate-300"}`}
      />
      <span className="text-[10px] text-siterun-slate mt-1 text-center leading-tight">{label}</span>
    </div>
  );
}
