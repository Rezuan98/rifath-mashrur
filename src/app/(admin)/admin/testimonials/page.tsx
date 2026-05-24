import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import type { Testimonial } from "@/lib/types";

async function createTestimonial(formData: FormData) {
  "use server";
  await db.testimonial.create({
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

async function deleteTestimonial(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await db.testimonial.delete({ where: { id } });
  revalidatePath("/admin/testimonials");
}

export default async function AdminTestimonialsPage() {
  let testimonials: Testimonial[] = [];
  try {
    testimonials = (await db.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    })) as Testimonial[];
  } catch {}

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-cream">Testimonials</h1>
          <p className="text-cream/40 text-sm mt-1">{testimonials.length} total</p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="px-4 py-2 bg-green text-canvas text-sm font-bold hover:bg-green/80 transition-colors"
        >
          + Add Testimonial
        </Link>
      </div>

      {testimonials.length === 0 ? (
        <p className="text-cream/30 text-sm">No testimonials yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="rounded-xl border border-cream/[0.07] bg-cream/[0.02] p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-cream font-medium text-sm">{t.author}</p>
                  <p className="text-cream/40 text-xs mt-0.5">{t.role}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/testimonials/${t.id}`}
                    className="text-xs text-cream/40 hover:text-cream transition-colors px-3 py-1.5 border border-cream/10 hover:border-cream/30 rounded-lg"
                  >
                    Edit
                  </Link>
                  <form action={deleteTestimonial}>
                    <input type="hidden" name="id" value={t.id} />
                    <button
                      type="submit"
                      className="text-xs text-cream/20 hover:text-red-400 transition-colors px-3 py-1.5 border border-cream/[0.07] hover:border-red-400/30 rounded-lg cursor-pointer"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
              <p className="text-cream/60 text-sm leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
              <p className="text-cream/20 text-xs mt-3">{format(t.createdAt, "MMM d, yyyy")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
