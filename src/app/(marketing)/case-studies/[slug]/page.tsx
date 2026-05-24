import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const study = await db.caseStudy.findFirst({
      where: { slug, published: true },
    });
    if (!study) return { title: "Not Found" };
    return {
      title: `${study.title} — Case Study`,
      description: study.summary,
    };
  } catch {
    return { title: "Case Study" };
  }
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let study;
  try {
    study = await db.caseStudy.findFirst({
      where: { slug, published: true },
    });
  } catch {
    notFound();
  }

  if (!study) notFound();

  const metrics = study.metrics as Record<string, string>;
  const metricEntries = Object.entries(metrics);

  return (
    <div className="pt-24 pb-32">
      {/* Breadcrumb + header */}
      <div className="px-8 max-w-4xl mx-auto mb-16">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 text-sm text-cream/40 hover:text-cream transition-colors mb-10"
        >
          ← Back to Work
        </Link>
        <span className="text-green text-xs tracking-[0.2em] uppercase block mb-5">
          {study.category}
        </span>
        <h1 className="text-4xl sm:text-6xl font-bold text-cream tracking-tight leading-[1.05] mb-4">
          {study.title}
        </h1>
        <p className="text-cream/50 text-lg">{study.clientName}</p>
      </div>

      {/* Hero image */}
      {study.heroImage && (
        <div className="px-8 max-w-6xl mx-auto mb-16">
          <img
            src={study.heroImage}
            alt={study.title}
            className="w-full rounded-2xl aspect-video object-cover bg-cream/5"
          />
        </div>
      )}

      {/* Metrics */}
      {metricEntries.length > 0 && (
        <div className="px-8 max-w-4xl mx-auto mb-16">
          <div
            className={`grid gap-4 ${
              metricEntries.length === 1
                ? "grid-cols-1 max-w-xs"
                : metricEntries.length === 2
                ? "grid-cols-2"
                : metricEntries.length === 3
                ? "grid-cols-3"
                : "grid-cols-2 sm:grid-cols-4"
            }`}
          >
            {metricEntries.map(([key, value]) => (
              <div
                key={key}
                className="rounded-xl border border-cream/[0.07] bg-cream/[0.03] p-5"
              >
                <p className="text-green font-bold text-3xl">{value}</p>
                <p className="text-cream/40 text-xs mt-1.5">{key}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary pull quote */}
      <div className="px-8 max-w-4xl mx-auto mb-12">
        <p className="text-cream/75 text-xl leading-relaxed border-l-2 border-green pl-6">
          {study.summary}
        </p>
      </div>

      {/* Body content */}
      <div className="px-8 max-w-4xl mx-auto">
        <div className="text-cream/70 leading-[1.85] whitespace-pre-wrap text-base">
          {study.content}
        </div>
      </div>
    </div>
  );
}
