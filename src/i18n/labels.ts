import type { Locale } from "../types";
import type { Job, JobSite, Product } from "../types";
import { CATEGORIES, CONTRACTOR, REPEAT_CHIPS } from "../data";
import { formatJobStarted, jobDisplayTitle, siteLabel } from "../lib/jobs";

export function productName(p: Product, locale: Locale): string {
  return locale === "hi" ? p.nameHi : p.nameEn;
}

export function categoryLabel(
  id: (typeof CATEGORIES)[number]["id"],
  locale: Locale
): string {
  const c = CATEGORIES.find((x) => x.id === id);
  if (!c) return id;
  return locale === "hi" ? c.labelHi : c.labelEn;
}

export function contractorName(locale: Locale): string {
  return locale === "hi" ? CONTRACTOR.nameHi : CONTRACTOR.nameEn;
}

export function contractorTrade(locale: Locale): string {
  return locale === "hi" ? CONTRACTOR.tradeHi : CONTRACTOR.tradeEn;
}

export function jobSiteLabel(sites: JobSite[], siteId: string, locale: Locale): string {
  const s = sites.find((x) => x.id === siteId);
  if (!s) return siteId;
  return siteLabel(s, locale);
}

export function activeJobTitle(job: Job | null, locale: Locale): string {
  if (!job) return "";
  return jobDisplayTitle(job, locale);
}

export function activeJobStarted(job: Job | null, locale: Locale): string {
  if (!job) return "";
  return formatJobStarted(job, locale);
}

export function repeatChipLabel(chipId: string, locale: Locale): string {
  const c = REPEAT_CHIPS.find((x) => x.id === chipId);
  if (!c) return chipId;
  return locale === "hi" ? c.labelHi : c.labelEn;
}

export function matchesSearch(p: Product, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    p.nameEn.toLowerCase().includes(q) ||
    p.nameHi.includes(q) ||
    p.id.toLowerCase().includes(q)
  );
}
