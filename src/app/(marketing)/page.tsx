import Link from "next/link";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import {
  getHeroStats,
  getServices,
  DEFAULT_STATS,
  DEFAULT_SERVICES,
} from "@/lib/content";
import { HeroSection } from "./_components/hero";
import { AchievementsSection } from "./_components/achievements-section";
import type { CaseStudy, Testimonial, WorkExperience, Achievement } from "@/lib/types";

// Content is managed through the admin dashboard, so the homepage must always
// reflect the current database rather than a build-time snapshot.
export const dynamic = "force-dynamic";

/* Shared type scale + rhythm so every section reads as one system.
   Fluid clamp() sizes ramp smoothly across phones, tablets and desktops. */
const SECTION   = "px-5 sm:px-8 py-16 sm:py-20 lg:py-24";
const H2        = "text-[clamp(1.625rem,4.2vw,2.75rem)] font-bold text-cream tracking-[-0.02em] leading-[1.1] text-balance";
const SECTION_P = "text-[clamp(0.9375rem,1.6vw,1.125rem)] text-cream/65 leading-relaxed text-pretty";

async function getCaseStudies(): Promise<CaseStudy[]> {
  try {
    return (await db.caseStudy.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    })) as CaseStudy[];
  } catch {
    return [];
  }
}

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    return (await db.testimonial.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
    })) as Testimonial[];
  } catch {
    return [];
  }
}

async function getExperiences(): Promise<WorkExperience[]> {
  try {
    return (await db.workExperience.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    })) as WorkExperience[];
  } catch {
    return [];
  }
}

async function getAchievements(): Promise<Achievement[]> {
  try {
    return (await db.achievement.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    })) as Achievement[];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [caseStudies, testimonials, experiences, achievements, heroStats, services, settings] =
    await Promise.all([
      getCaseStudies(),
      getTestimonials(),
      getExperiences(),
      getAchievements(),
      getHeroStats(),
      getServices(),
      getSettings(),
    ]);

  // Fall back to the bundled copy until the owner adds their own rows.
  const statItems    = heroStats.length > 0 ? heroStats : DEFAULT_STATS;
  const serviceItems = services.length   > 0 ? services : DEFAULT_SERVICES;

  // Keep the last row full: 3 / 6 / 9 cards look better in three columns.
  const serviceCols =
    serviceItems.length % 3 === 0 && serviceItems.length % 4 !== 0
      ? "lg:grid-cols-3"
      : "lg:grid-cols-4";

  return (
    <>
      {/* Hero */}
      <HeroSection
        name={settings.brandName}
        profileImage={settings.profileImage}
        stats={statItems}
      />

      {/* Work */}
      <section id="work" className={`${SECTION} max-w-6xl mx-auto w-full`}>
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 mb-10 sm:mb-12">
          <div className="min-w-0">
            <h2 className={H2}>{settings.workTitle}</h2>
            {settings.workSubtitle && (
              <p className={`${SECTION_P} mt-3 max-w-xl`}>{settings.workSubtitle}</p>
            )}
          </div>
          {caseStudies.length > 0 && (
            <span className="text-cream/50 text-sm shrink-0">
              {caseStudies.length} case {caseStudies.length !== 1 ? "studies" : "study"}
            </span>
          )}
        </div>

        {caseStudies.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-cream/[0.07] bg-cream/[0.03] p-6 h-64 flex flex-col justify-between"
              >
                <div className="h-3 w-16 bg-cream/10 rounded-full" />
                <div className="space-y-3">
                  <div className="h-5 w-3/4 bg-cream/10 rounded" />
                  <div className="h-4 w-1/2 bg-cream/[0.07] rounded" />
                  <div className="border-t border-cream/[0.07] pt-4">
                    <div className="h-7 w-1/3 bg-cream/10 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {caseStudies.map((study) => {
              const metrics = study.metrics as Record<string, string>;
              const [metricKey, metricValue] = Object.entries(metrics)[0] ?? [];
              return (
                <Link
                  key={study.id}
                  href={`/case-studies/${study.slug}`}
                  className="group rounded-2xl border border-cream/[0.07] bg-cream/[0.03] hover:bg-cream/[0.06] hover:border-cream/20 transition-all p-5 sm:p-6 flex flex-col gap-4"
                >
                  <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-green">
                    {study.category}
                  </span>
                  <div className="flex-1">
                    <p className="text-cream/55 text-sm mb-1.5">{study.clientName}</p>
                    <h3 className="text-cream font-semibold text-base sm:text-lg leading-snug group-hover:text-green transition-colors text-pretty">
                      {study.title}
                    </h3>
                  </div>
                  {metricKey && (
                    <div className="border-t border-cream/[0.07] pt-4">
                      <p className="text-green font-bold text-xl sm:text-2xl tabular-nums">{metricValue}</p>
                      <p className="text-cream/55 text-xs mt-1">{metricKey}</p>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Services */}
      <section id="services" className={`${SECTION} border-t border-cream/[0.07]`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={H2}>{settings.servicesTitle}</h2>
          {settings.servicesSubtitle && (
            <p className={`${SECTION_P} mt-4 max-w-xl`}>{settings.servicesSubtitle}</p>
          )}
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${serviceCols} gap-4 sm:gap-5 mt-10 sm:mt-14`}>
            {serviceItems.map((svc) => (
              <div
                key={svc.title}
                className="rounded-2xl border border-cream/[0.07] bg-cream/[0.03] p-5 sm:p-6"
              >
                <span className="text-green text-xl block mb-4 sm:mb-5" aria-hidden>
                  {svc.icon}
                </span>
                <h3 className="text-cream font-semibold mb-2 text-[0.9375rem] tracking-wide">
                  {svc.title}
                </h3>
                <p className="text-cream/65 text-sm leading-relaxed text-pretty">{svc.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work Experience */}
      <section id="experience" className={`${SECTION} border-t border-cream/[0.07]`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`${H2} mb-10 sm:mb-12`}>Work Experience</h2>
          {experiences.length === 0 ? (
            <div className="flex flex-col gap-5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="relative pl-8 pb-10 last:pb-0">
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-cream/[0.07]" />
                  <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-cream/10" />
                  <div className="h-4 w-40 bg-cream/[0.06] rounded mb-2" />
                  <div className="h-3 w-24 bg-cream/[0.04] rounded mb-3" />
                  <div className="h-3 w-full bg-cream/[0.03] rounded mb-1.5" />
                  <div className="h-3 w-3/4 bg-cream/[0.03] rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-px bg-cream/[0.07]" />
              <div className="flex flex-col gap-0">
                {experiences.map((exp) => (
                  <div key={exp.id} className="relative pl-7 sm:pl-8 pb-9 sm:pb-10 last:pb-0">
                    <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-green" />
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
                      <div className="min-w-0">
                        <h3 className="text-cream font-semibold text-base">{exp.role}</h3>
                        <p className="text-green text-sm mt-0.5">{exp.company}</p>
                      </div>
                      <span className="text-cream/50 text-xs sm:text-sm shrink-0 sm:mt-0.5 tabular-nums">
                        {exp.startDate} — {exp.current ? "Present" : (exp.endDate ?? "")}
                      </span>
                    </div>
                    <p className="text-cream/65 text-sm leading-relaxed text-pretty">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section id="testimonials" className={`${SECTION} border-t border-cream/[0.07]`}>
          <div className="max-w-6xl mx-auto">
            <h2 className={`${H2} mb-10 sm:mb-12`}>What Clients Say</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="rounded-2xl border border-cream/[0.07] bg-cream/[0.03] p-5 sm:p-6 flex flex-col gap-4"
                >
                  <p className="text-cream/80 text-sm leading-relaxed italic flex-1 text-pretty">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="pt-4 border-t border-cream/[0.07]">
                    <p className="text-cream font-medium text-sm">{t.author}</p>
                    <p className="text-cream/55 text-xs mt-0.5">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Achievements */}
      <AchievementsSection
        awards={achievements.filter((a) => a.type === "award")}
        dashboards={achievements.filter((a) => a.type === "dashboard")}
      />

      {/* Contact */}
      <section id="contact" className="px-5 sm:px-8 py-20 sm:py-28 border-t border-cream/[0.07]">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-green text-[11px] font-semibold tracking-[0.2em] uppercase block mb-5 sm:mb-7">
            Get In Touch
          </span>
          <h2 className="text-[clamp(1.75rem,5vw,3.25rem)] font-bold text-cream tracking-[-0.025em] leading-[1.05] mb-5 text-balance">
            Ready to Grow?
          </h2>
          <p className={`${SECTION_P} mb-8 sm:mb-10`}>
            Tell us about your goals and we&apos;ll put together a growth plan
            tailored to your business.
          </p>
          <a
            href={`mailto:${settings.email}`}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-green text-canvas font-bold text-sm sm:text-lg break-all sm:break-normal hover:bg-green/80 transition-colors"
          >
            {settings.email} ↗
          </a>
          {settings.phone && (
            <p className="mt-6 text-cream/65 text-sm">
              Or call{" "}
              <a
                href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                className="text-green hover:underline"
              >
                {settings.phone}
              </a>
            </p>
          )}
        </div>
      </section>
    </>
  );
}
