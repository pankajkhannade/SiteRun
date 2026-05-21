import { Check, MapPin } from "lucide-react";
import { useApp } from "../context";
import { useTranslation } from "../i18n";
import { jobDisplayTitle, siteLabel } from "../lib/jobs";
import { Header } from "../components/Header";

export function JobsScreen() {
  const {
    activeJobs,
    activeJobId,
    setActiveJobId,
    completeJob,
    setScreen,
    jobSites,
    locale,
  } = useApp();
  const { t } = useTranslation();

  const bySite = jobSites
    .map((site) => ({
      site,
      jobs: activeJobs.filter((j) => j.siteId === site.id),
    }))
    .filter((g) => g.jobs.length > 0);

  return (
    <div className="flex flex-col h-full">
      <Header title={t("openJobs")} showBack onBack={() => setScreen("home")} />
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {activeJobs.length === 0 && (
          <div className="text-center py-12 text-siterun-slate">
            <p>{t("noActiveJob")}</p>
            <button
              type="button"
              onClick={() => setScreen("addJob")}
              className="mt-4 px-6 py-3 rounded-2xl bg-siterun-orange text-white font-semibold"
            >
              {t("startJob")}
            </button>
          </div>
        )}

        {bySite.map(({ site, jobs }) => (
          <section key={site.id}>
            <p className="text-xs font-semibold text-siterun-slate uppercase mb-2 flex items-center gap-1">
              <MapPin size={12} />
              {siteLabel(site, locale)}
            </p>
            <ul className="space-y-2">
              {jobs.map((job) => (
                <li
                  key={job.id}
                  className={`p-4 rounded-2xl border-2 ${
                    job.id === activeJobId
                      ? "border-siterun-orange bg-siterun-orange-light"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-siterun-navy">{jobDisplayTitle(job, locale)}</p>
                      <p className="text-xs text-siterun-slate mt-1">
                        {job.checklist.filter((c) => !c.done).length}{" "}
                        {t("items").toLowerCase()} pending
                      </p>
                    </div>
                    {job.id === activeJobId && (
                      <span className="text-[10px] font-bold text-siterun-orange uppercase flex items-center gap-0.5">
                        <Check size={12} /> {t("active")}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-3">
                    {job.id !== activeJobId && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveJobId(job.id);
                          setScreen("home");
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-siterun-navy text-white text-sm font-semibold"
                      >
                        {t("switchToJob")}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => completeJob(job.id)}
                      className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-siterun-slate text-sm font-semibold"
                    >
                      {t("markComplete")}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <button
          type="button"
          onClick={() => setScreen("addJob")}
          className="w-full py-3 rounded-2xl border-2 border-siterun-orange text-siterun-orange font-semibold"
        >
          + {t("newJob")}
        </button>
      </div>
    </div>
  );
}
