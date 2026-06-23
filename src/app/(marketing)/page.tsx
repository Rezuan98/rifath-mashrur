import Link from "next/link";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { HeroSection } from "./_components/hero";
import { AchievementsSection } from "./_components/achievements-section";
import type { CaseStudy, Testimonial, WorkExperience, Achievement } from "@/lib/types";

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

const services = [
  {
    title: "SEO Growth",
    desc: "Technical audits, content strategy, and authority building that compounds over time.",
    icon: "↑",
  },
  {
    title: "Paid Media",
    desc: "Profitable Google and Meta campaigns optimised for CPL and ROAS, not vanity clicks.",
    icon: "◈",
  },
  {
    title: "Content Strategy",
    desc: "Data-backed editorial plans that attract qualified audiences and convert them.",
    icon: "✦",
  },
  {
    title: "Analytics & Reporting",
    desc: "Custom dashboards and attribution models so you always know what's working.",
    icon: "◎",
  },
];

export default async function HomePage() {
  const [caseStudies, testimonials, experiences, achievements, settings] = await Promise.all([
    getCaseStudies(),
    getTestimonials(),
    getExperiences(),
    getAchievements(),
    getSettings(),
  ]);

  return (
    <>
      {/* Hero */}
      <HeroSection name={settings.brandName} profileImage={settings.profileImage} />

      {/* Work */}
      <section id="work" className="px-4 sm:px-8 py-16 sm:py-24 max-w-6xl mx-auto w-full">
        <div className="flex items-end justify-between mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-cream tracking-tight">
            Selected Work
          </h2>
          {caseStudies.length > 0 && (
            <span className="text-cream/30 text-sm">
              {caseStudies.length} case {caseStudies.length !== 1 ? "studies" : "study"}
            </span>
          )}
        </div>

        {caseStudies.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudies.map((study) => {
              const metrics = study.metrics as Record<string, string>;
              const [metricKey, metricValue] = Object.entries(metrics)[0] ?? [];
              return (
                <Link
                  key={study.id}
                  href={`/case-studies/${study.slug}`}
                  className="group rounded-2xl border border-cream/[0.07] bg-cream/[0.03] hover:bg-cream/[0.06] hover:border-cream/20 transition-all p-6 flex flex-col gap-4"
                >
                  <span className="text-xs font-medium tracking-[0.15em] uppercase text-green">
                    {study.category}
                  </span>
                  <div className="flex-1">
                    <p className="text-cream/40 text-sm mb-1.5">{study.clientName}</p>
                    <h3 className="text-cream font-semibold text-lg leading-snug group-hover:text-green transition-colors">
                      {study.title}
                    </h3>
                  </div>
                  {metricKey && (
                    <div className="border-t border-cream/[0.07] pt-4">
                      <p className="text-green font-bold text-2xl">{metricValue}</p>
                      <p className="text-cream/40 text-xs mt-0.5">{metricKey}</p>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Services */}
      <section id="services" className="px-4 sm:px-8 py-16 sm:py-24 border-t border-cream/[0.07]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-cream tracking-tight mb-4">
            What We Do
          </h2>
          <p className="text-cream/50 text-lg mb-14 max-w-xl">
            Full-stack digital marketing capabilities built to work together.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((svc) => (
              <div
                key={svc.title}
                className="rounded-2xl border border-cream/[0.07] bg-cream/[0.03] p-6"
              >
                <span className="text-green text-xl block mb-5">{svc.icon}</span>
                <h3 className="text-cream font-semibold mb-2 text-sm tracking-wide">
                  {svc.title}
                </h3>
                <p className="text-cream/50 text-sm leading-relaxed">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work Experience */}
      <section id="experience" className="px-4 sm:px-8 py-16 sm:py-24 border-t border-cream/[0.07]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-cream tracking-tight mb-12">
            Work Experience
          </h2>
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
                  <div key={exp.id} className="relative pl-8 pb-10 last:pb-0">
                    <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-green" />
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
                      <div>
                        <h3 className="text-cream font-semibold text-base">{exp.role}</h3>
                        <p className="text-green text-sm">{exp.company}</p>
                      </div>
                      <span className="text-cream/30 text-xs sm:text-sm shrink-0 mt-0.5">
                        {exp.startDate} — {exp.current ? "Present" : (exp.endDate ?? "")}
                      </span>
                    </div>
                    <p className="text-cream/50 text-sm leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section id="testimonials" className="px-4 sm:px-8 py-16 sm:py-24 border-t border-cream/[0.07]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-cream tracking-tight mb-12">
              What Clients Say
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="rounded-2xl border border-cream/[0.07] bg-cream/[0.03] p-6 flex flex-col gap-4"
                >
                  <p className="text-cream/75 text-sm leading-relaxed italic flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="pt-4 border-t border-cream/[0.07]">
                    <p className="text-cream font-medium text-sm">{t.author}</p>
                    <p className="text-cream/40 text-xs mt-0.5">{t.role}</p>
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
      <section id="contact" className="px-4 sm:px-8 py-20 sm:py-28 border-t border-cream/[0.07]">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-green text-xs tracking-[0.2em] uppercase block mb-6 sm:mb-8">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-cream tracking-tight mb-5">
            Ready to Grow?
          </h2>
          <p className="text-cream/50 text-base sm:text-lg leading-relaxed mb-8 sm:mb-10">
            Tell us about your goals and we&apos;ll put together a growth plan
            tailored to your business.
          </p>
          <a
            href={`mailto:${settings.email}`}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-green text-canvas font-bold text-base sm:text-lg hover:bg-green/80 transition-colors"
          >
            {settings.email} ↗
          </a>
          {settings.phone && (
            <p className="mt-6 text-cream/50 text-sm">
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
