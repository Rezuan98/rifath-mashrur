import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import type { Testimonial } from "@/lib/types";

async function updateTestimonial(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await db.testimonial.update({
    where: { id },
    data: {
      author:     (formData.get("author")     as string).trim(),
      role:       (formData.get("role")       as string).trim(),
      quote:      (formData.get("quote")      as string).trim(),
      avatarUrl:  (formData.get("avatarUrl")  as string) || null,
      companyLog: (formData.get("companyLog") as string) || null,
    },
  });
  revalidatePath("/admin/testimonials");
  redirect("/admin/testimonials");
}

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let testimonial: Testimonial | null = null;
  try {
    testimonial = (await db.testimonial.findUnique({ where: { id } })) as Testimonial | null;
  } catch {}
  if (!testimonial) notFound();

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8 flex items-center gap-3">
        <Link href="/admin/testimonials" className="text-cream/30 hover:text-cream text-sm transition-colors">
          ← Testimonials
        </Link>
        <span className="text-cream/20">/</span>
        <h1 className="text-xl font-bold text-cream">Edit Testimonial</h1>
      </div>

      <form action={updateTestimonial} className="flex flex-col gap-5">
        <input type="hidden" name="id" value={testimonial.id} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Author Name *" name="author" defaultValue={testimonial.author} required />
          <Field label="Role / Company *" name="role" defaultValue={testimonial.role} required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Avatar URL" name="avatarUrl" defaultValue={testimonial.avatarUrl ?? ""} />
          <Field label="Company Logo URL" name="companyLog" defaultValue={testimonial.companyLog ?? ""} />
        </div>
        <div>
          <label className="block text-cream/50 text-xs mb-1.5 tracking-widest uppercase">Quote *</label>
          <textarea
            name="quote"
            rows={4}
            required
            defaultValue={testimonial.quote}
            className="w-full bg-cream/[0.04] border border-cream/[0.1] text-cream text-sm px-4 py-2.5 outline-none focus:border-green/50 transition-colors placeholder:text-cream/20 resize-y"
          />
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-green text-canvas font-bold text-sm hover:bg-green/80 transition-colors"
          >
            Save Changes
          </button>
          <Link href="/admin/testimonials" className="text-sm text-cream/40 hover:text-cream transition-colors">
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
