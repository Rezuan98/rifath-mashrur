import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import slugify from "slugify";
import { ImageUploadField } from "@/app/(admin)/_components/image-upload-field";

async function createStudy(formData: FormData) {
  "use server";
  const title = (formData.get("title") as string).trim();

  // `slug` is UNIQUE. Two studies with the same (or similarly punctuated)
  // title used to blow up the whole action with a Prisma constraint error,
  // which surfaces in the UI as "the Create button does nothing". Suffix
  // until it's free instead; a title of pure punctuation slugifies to "".
  const base = slugify(title, { lower: true, strict: true }) || "case-study";
  let slug = base;
  for (let n = 2; await db.caseStudy.findUnique({ where: { slug } }); n++) {
    slug = `${base}-${n}`;
  }

  const metrics: Record<string, string> = {};
  for (let i = 1; i <= 4; i++) {
    const k = ((formData.get(`mk${i}`) as string) ?? "").trim();
    const v = ((formData.get(`mv${i}`) as string) ?? "").trim();
    if (k && v) metrics[k] = v;
  }

  await db.caseStudy.create({
    data: {
      title,
      slug,
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

export default function NewCaseStudyPage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8 flex items-center gap-3">
        <Link href="/admin/case-studies" className="text-cream/30 hover:text-cream text-sm transition-colors">
          ← Case Studies
        </Link>
        <span className="text-cream/20">/</span>
        <h1 className="text-xl font-bold text-cream">New Case Study</h1>
      </div>

      <form action={createStudy} className="flex flex-col gap-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Title *" name="title" placeholder="e.g. 5× ROI in 90 Days" required />
          <div>
            <label className="block text-cream/50 text-xs mb-1.5 tracking-widest uppercase">
              Category *
            </label>
            <select
              name="category"
              required
              className="w-full bg-cream/[0.04] border border-cream/[0.1] text-cream text-sm px-4 py-2.5 outline-none focus:border-green/50 transition-colors appearance-none"
            >
              <option value="">Select…</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <Field label="Client Name *" name="clientName" placeholder="Acme Corp" required />

        <ImageUploadField
          name="heroImage"
          label="Hero Image"
          optional
          hint="Shown at the top of the case study page. Wide (16:9) images look best."
        />

        <TextareaField label="Summary *" name="summary" rows={3} placeholder="One-paragraph overview of the project." required />
        <TextareaField label="Content (Markdown) *" name="content" rows={8} placeholder="## Challenge&#10;&#10;## Strategy&#10;&#10;## Results" required />

        {/* Metrics */}
        <div>
          <p className="text-cream/50 text-xs mb-3 tracking-widest uppercase">Metrics (up to 4)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-2">
                <input
                  name={`mk${i}`}
                  placeholder={`Label ${i}`}
                  className="w-1/2 bg-cream/[0.04] border border-cream/[0.1] text-cream text-sm px-3 py-2 outline-none focus:border-green/50 transition-colors placeholder:text-cream/20"
                />
                <input
                  name={`mv${i}`}
                  placeholder={`Value ${i}`}
                  className="w-1/2 bg-cream/[0.04] border border-cream/[0.1] text-cream text-sm px-3 py-2 outline-none focus:border-green/50 transition-colors placeholder:text-cream/20"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Published — defaults ON: the Work section on the site only lists
            published studies, so a draft looks like "nothing was added". */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer group w-fit">
            <input type="checkbox" name="published" defaultChecked className="accent-[#7CFC00] w-4 h-4" />
            <span className="text-cream/60 text-sm group-hover:text-cream transition-colors">Publish immediately</span>
          </label>
          <p className="text-cream/30 text-xs mt-2">
            Unpublished case studies stay as drafts and do not appear in the Work
            section of your site. You can flip this any time from the list.
          </p>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-green text-canvas font-bold text-sm hover:bg-green/80 transition-colors"
          >
            Create Case Study
          </button>
          <Link href="/admin/case-studies" className="text-sm text-cream/40 hover:text-cream transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({ label, name, placeholder, required }: { label: string; name: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-cream/50 text-xs mb-1.5 tracking-widest uppercase">{label}</label>
      <input
        name={name}
        placeholder={placeholder}
        required={required}
        className="w-full bg-cream/[0.04] border border-cream/[0.1] text-cream text-sm px-4 py-2.5 outline-none focus:border-green/50 transition-colors placeholder:text-cream/20"
      />
    </div>
  );
}

function TextareaField({ label, name, rows, placeholder, required }: { label: string; name: string; rows: number; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-cream/50 text-xs mb-1.5 tracking-widest uppercase">{label}</label>
      <textarea
        name={name}
        rows={rows}
        placeholder={placeholder}
        required={required}
        className="w-full bg-cream/[0.04] border border-cream/[0.1] text-cream text-sm px-4 py-2.5 outline-none focus:border-green/50 transition-colors placeholder:text-cream/20 resize-y"
      />
    </div>
  );
}
