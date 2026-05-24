import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import type { WorkExperience } from "@/lib/types";

async function updateExperience(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await db.workExperience.update({
    where: { id },
    data: {
      company:     (formData.get("company")     as string).trim(),
      role:        (formData.get("role")        as string).trim(),
      startDate:   (formData.get("startDate")   as string).trim(),
      endDate:     (formData.get("endDate")     as string) || null,
      current:     formData.get("current") === "on",
      description: (formData.get("description") as string).trim(),
      order:       parseInt((formData.get("order") as string) || "0", 10),
    },
  });
  revalidatePath("/admin/experience");
  redirect("/admin/experience");
}

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let exp: WorkExperience | null = null;
  try {
    exp = (await db.workExperience.findUnique({ where: { id } })) as WorkExperience | null;
  } catch {}
  if (!exp) notFound();

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8 flex items-center gap-3">
        <Link href="/admin/experience" className="text-cream/30 hover:text-cream text-sm transition-colors">
          ← Experience
        </Link>
        <span className="text-cream/20">/</span>
        <h1 className="text-xl font-bold text-cream">Edit Experience</h1>
      </div>

      <form action={updateExperience} className="flex flex-col gap-5">
        <input type="hidden" name="id" value={exp.id} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Company *" name="company" defaultValue={exp.company} required />
          <Field label="Role / Title *" name="role" defaultValue={exp.role} required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Start Date *" name="startDate" defaultValue={exp.startDate} required />
          <Field label="End Date" name="endDate" defaultValue={exp.endDate ?? ""} />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="current"
            id="current"
            defaultChecked={exp.current}
            className="w-4 h-4 accent-green"
          />
          <label htmlFor="current" className="text-cream/60 text-sm">
            Currently working here
          </label>
        </div>

        <div>
          <label className="block text-cream/50 text-xs mb-1.5 tracking-widest uppercase">Description *</label>
          <textarea
            name="description"
            rows={4}
            required
            defaultValue={exp.description}
            className="w-full bg-cream/[0.04] border border-cream/[0.1] text-cream text-sm px-4 py-2.5 outline-none focus:border-green/50 transition-colors placeholder:text-cream/20 resize-y"
          />
        </div>

        <Field label="Display Order" name="order" defaultValue={String(exp.order)} />

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-green text-canvas font-bold text-sm hover:bg-green/80 transition-colors"
          >
            Save Changes
          </button>
          <Link href="/admin/experience" className="text-sm text-cream/40 hover:text-cream transition-colors">
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
