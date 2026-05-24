import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import type { CaseStudy } from "@/lib/types";

async function updateStudy(formData: FormData) {
  "use server";
  const id    = formData.get("id") as string;
  const title = (formData.get("title") as string).trim();

  const metrics: Record<string, string> = {};
  for (let i = 1; i <= 4; i++) {
    const k = ((formData.get(`mk${i}`) as string) ?? "").trim();
    const v = ((formData.get(`mv${i}`) as string) ?? "").trim();
    if (k && v) metrics[k] = v;
  }

  await db.caseStudy.update({
    where: { id },
    data: {
      title,
      category:   (formData.get("category")   as string).trim(),
      clientName: (formData.get("clientName")  as string).trim(),
      heroImage:  (formData.get("heroImage")   as string) || "",
      summary:    (formData.get("summary")     as string).trim(),
      content:    (formData.get("content")     as string).trim(),
      metrics,
      published:  formData.get("published") === "on",
    },
  });

  revalidatePath("/admin/case-studies");
  redirect("/admin/case-studies");
}

const CATEGORIES = ["SEO", "PPC", "Growth", "Content", "Analytics", "Social"];

export default async function EditCaseStudyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let study: CaseStudy | null = null;
  try {
    study = (await db.caseStudy.findUnique({ where: { id } })) as CaseStudy | null;
  } catch {}
  if (!study) notFound();

  const metrics = study.metrics as Record<string, string>;
  const metricEntries = Object.entries(metrics).slice(0, 4);

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8 flex items-center gap-3">
        <Link href="/admin/case-studies" className="text-cream/30 hover:text-cream text-sm transition-colors">
          ← Case Studies
        </Link>
        <span className="text-cream/20">/</span>
        <h1 className="text-xl font-bold text-cream">Edit Case Study</h1>
      </div>

      <form action={updateStudy} className="flex flex-col gap-6">
        <input type="hidden" name="id" value={study.id} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Title *" name="title" defaultValue={study.title} required />
          <div>
            <label className="block text-cream/50 text-xs mb-1.5 tracking-widest uppercase">Category *</label>
            <select
              name="category"
              required
              defaultValue={study.category}
              className="w-full bg-cream/[0.04] border border-cream/[0.1] text-cream text-sm px-4 py-2.5 outline-none focus:border-green/50 transition-colors appearance-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Client Name *" name="clientName" defaultValue={study.clientName} required />
          <Field label="Hero Image URL" name="heroImage" defaultValue={study.heroImage} />
        </div>

        <TextareaField label="Summary *" name="summary" rows={3} defaultValue={study.summary} required />
        <TextareaField label="Content (Markdown) *" name="content" rows={8} defaultValue={study.content} required />

        <div>
          <p className="text-cream/50 text-xs mb-3 tracking-widest uppercase">Metrics (up to 4)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex gap-2">
                <input
                  name={`mk${i + 1}`}
                  placeholder={`Label ${i + 1}`}
                  defaultValue={metricEntries[i]?.[0] ?? ""}
                  className="w-1/2 bg-cream/[0.04] border border-cream/[0.1] text-cream text-sm px-3 py-2 outline-none focus:border-green/50 transition-colors placeholder:text-cream/20"
                />
                <input
                  name={`mv${i + 1}`}
                  placeholder={`Value ${i + 1}`}
                  defaultValue={metricEntries[i]?.[1] ?? ""}
                  className="w-1/2 bg-cream/[0.04] border border-cream/[0.1] text-cream text-sm px-3 py-2 outline-none focus:border-green/50 transition-colors placeholder:text-cream/20"
                />
              </div>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer group w-fit">
          <input
            type="checkbox"
            name="published"
            defaultChecked={study.published}
            className="accent-[#7CFC00] w-4 h-4"
          />
          <span className="text-cream/60 text-sm group-hover:text-cream transition-colors">Published</span>
        </label>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-green text-canvas font-bold text-sm hover:bg-green/80 transition-colors"
          >
            Save Changes
          </button>
          <Link href="/admin/case-studies" className="text-sm text-cream/40 hover:text-cream transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({ label, name, defaultValue, required }: { label: string; name: string; defaultValue?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-cream/50 text-xs mb-1.5 tracking-widest uppercase">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="w-full bg-cream/[0.04] border border-cream/[0.1] text-cream text-sm px-4 py-2.5 outline-none focus:border-green/50 transition-colors placeholder:text-cream/20"
      />
    </div>
  );
}

function TextareaField({ label, name, rows, defaultValue, required }: { label: string; name: string; rows: number; defaultValue?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-cream/50 text-xs mb-1.5 tracking-widest uppercase">{label}</label>
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        required={required}
        className="w-full bg-cream/[0.04] border border-cream/[0.1] text-cream text-sm px-4 py-2.5 outline-none focus:border-green/50 transition-colors placeholder:text-cream/20 resize-y"
      />
    </div>
  );
}
