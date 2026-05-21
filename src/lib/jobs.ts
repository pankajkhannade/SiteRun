import type { ChecklistItem, Job, JobSite, JobType, Locale } from "../types";
import { JOB_KITS } from "../data";

export const JOB_TYPES: {
  id: JobType;
  emoji: string;
  titleEn: string;
  titleHi: string;
}[] = [
  { id: "bathroom", emoji: "🛁", titleEn: "Bathroom renovation", titleHi: "बाथरूम रेनोवेशन" },
  { id: "kitchen", emoji: "🍳", titleEn: "Kitchen plumbing", titleHi: "किचन प्लंबिंग" },
  { id: "toilet_wc", emoji: "🚽", titleEn: "Toilet / WC work", titleHi: "टॉयलेट / WC" },
  { id: "pvc_repair", emoji: "🔧", titleEn: "PVC repair", titleHi: "PVC रिपेयर" },
  { id: "new_connection", emoji: "🚿", titleEn: "New connection", titleHi: "नया कनेक्शन" },
  { id: "water_tank", emoji: "🪣", titleEn: "Water tank line", titleHi: "पानी की टंकी" },
  { id: "geyser", emoji: "♨️", titleEn: "Geyser plumbing", titleHi: "गीज़र कनेक्शन" },
  { id: "leakage_repair", emoji: "💧", titleEn: "Leakage repair", titleHi: "लिकेज रिपेयर" },
  { id: "drain_blockage", emoji: "🪠", titleEn: "Drain blockage", titleHi: "नाली जाम" },
  { id: "pipeline_upgrade", emoji: "📏", titleEn: "Pipeline replacement", titleHi: "पाइपलाइन बदलना" },
  { id: "other", emoji: "📋", titleEn: "Other plumbing", titleHi: "अन्य प्लंबिंग" },
];

function checklistItem(productId: string, qty: number, done = false, suffix = ""): ChecklistItem {
  return { id: `cl-${productId}${suffix}`, productId, qty, done };
}

export function checklistForJobType(type: JobType): ChecklistItem[] {
  const kit = JOB_KITS[type].slice(0, 6);
  return kit.map((k, i) => checklistItem(k.productId, k.qty, i === 0, `-${i}`));
}

export function kitForJobType(type: JobType): { productId: string; qty: number }[] {
  return JOB_KITS[type];
}

export function jobTypeTitle(type: JobType, locale: Locale): string {
  const jt = JOB_TYPES.find((t) => t.id === type);
  if (!jt) return type;
  return locale === "hi" ? jt.titleHi : jt.titleEn;
}

export function jobDisplayTitle(job: Job, locale: Locale): string {
  return locale === "hi" ? job.titleHi : job.titleEn;
}

export function siteLabel(site: JobSite, locale: Locale): string {
  return locale === "hi" ? site.labelHi : site.labelEn;
}

export function formatJobStarted(job: Job, locale: Locale): string {
  const d = job.createdAt;
  const time = d.toLocaleTimeString(locale === "hi" ? "hi-IN" : "en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
  if (locale === "hi") {
    const isToday = new Date().toDateString() === d.toDateString();
    return isToday ? `आज शुरू · ${time}` : `${d.toLocaleDateString("hi-IN")} · ${time}`;
  }
  const isToday = new Date().toDateString() === d.toDateString();
  return isToday ? `Started today · ${time}` : `${d.toLocaleDateString("en-IN")} · ${time}`;
}

export function createJob(siteId: string, type: JobType): Job {
  const jt = JOB_TYPES.find((t) => t.id === type)!;
  return {
    id: `job-${Date.now().toString().slice(-8)}`,
    siteId,
    type,
    titleEn: jt.titleEn,
    titleHi: jt.titleHi,
    status: "active",
    checklist: checklistForJobType(type),
    createdAt: new Date(),
  };
}

export function createDefaultJobs(): Job[] {
  return [
    {
      id: "job-1",
      siteId: "site-1",
      type: "bathroom",
      titleEn: "2BHK Bathroom renovation",
      titleHi: "2BHK बाथरूम रेनोवेशन",
      status: "active",
      checklist: checklistForJobType("bathroom").map((c, i) => ({
        ...c,
        id: `c${i + 1}`,
        done: i === 0 || i === 4,
      })),
      createdAt: new Date(Date.now() - 3600000),
    },
    {
      id: "job-2",
      siteId: "site-2",
      type: "pvc_repair",
      titleEn: "PVC repair",
      titleHi: "PVC रिपेयर",
      status: "active",
      checklist: checklistForJobType("pvc_repair"),
      createdAt: new Date(Date.now() - 86400000),
    },
  ];
}
