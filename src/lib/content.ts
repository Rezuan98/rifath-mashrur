import { db } from "@/lib/db";
import type { HeroStat, Service } from "@/lib/types";

/** Shape the homepage actually renders — DB rows and fallbacks both satisfy it. */
export type StatItem    = Pick<HeroStat, "value" | "label">;
export type ServiceItem = Pick<Service, "title" | "description" | "icon">;

/**
 * Shown until the owner adds their own rows in the dashboard (also covers a
 * missing table / unreachable DB) so the homepage never renders a hole.
 */
export const DEFAULT_STATS: StatItem[] = [
  { value: "5+",   label: "Years Experience" },
  { value: "50+",  label: "Brands Grown" },
  { value: "3×",   label: "Avg. ROI" },
  { value: "$2M+", label: "Ad Spend Managed" },
];

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    title: "SEO Growth",
    description: "Technical audits, content strategy, and authority building that compounds over time.",
    icon: "↑",
  },
  {
    title: "Paid Media",
    description: "Profitable Google and Meta campaigns optimised for CPL and ROAS, not vanity clicks.",
    icon: "◈",
  },
  {
    title: "Content Strategy",
    description: "Data-backed editorial plans that attract qualified audiences and convert them.",
    icon: "✦",
  },
  {
    title: "Analytics & Reporting",
    description: "Custom dashboards and attribution models so you always know what's working.",
    icon: "◎",
  },
];

export async function getHeroStats(): Promise<HeroStat[]> {
  try {
    return (await db.heroStat.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    })) as HeroStat[];
  } catch {
    return [];
  }
}

export async function getServices(): Promise<Service[]> {
  try {
    return (await db.service.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    })) as Service[];
  } catch {
    return [];
  }
}
