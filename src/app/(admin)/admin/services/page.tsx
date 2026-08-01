import { revalidatePath } from "next/cache";
import Link from "next/link";
import { db } from "@/lib/db";
import { getServices, DEFAULT_SERVICES } from "@/lib/content";

// Always read the live DB — this list is the source of truth for the editor.
export const dynamic = "force-dynamic";

async function deleteService(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await db.service.delete({ where: { id } });
  revalidatePath("/admin/services");
  revalidatePath("/");
}

export default async function AdminServicesPage() {
  const services = await getServices();

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-cream">Services</h1>
          <p className="text-cream/40 text-sm mt-1">
            The cards in the homepage &ldquo;What I Do&rdquo; section · {services.length} total
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="px-4 py-2 bg-green text-canvas text-sm font-bold hover:bg-green/80 transition-colors shrink-0"
        >
          + Add Service
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="rounded-xl border border-cream/[0.07] bg-cream/[0.02] p-6">
          <p className="text-cream/50 text-sm">
            No services added yet — the homepage is showing these placeholders:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {DEFAULT_SERVICES.map((s) => (
              <div key={s.title} className="rounded-lg border border-cream/[0.07] px-4 py-3">
                <p className="text-cream/60 text-sm">
                  <span className="text-green mr-2">{s.icon}</span>
                  {s.title}
                </p>
              </div>
            ))}
          </div>
          <p className="text-cream/30 text-xs mt-4">
            Add your first service and the placeholders are replaced entirely.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {services.map((s) => (
            <div
              key={s.id}
              className="flex items-start gap-4 rounded-xl border border-cream/[0.07] bg-cream/[0.02] p-4"
            >
              <span className="text-green text-xl w-8 shrink-0 text-center leading-6">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-cream text-sm font-medium">{s.title}</p>
                <p className="text-cream/40 text-xs mt-1 line-clamp-2">{s.description}</p>
                <p className="text-cream/25 text-xs mt-1.5">Order {s.order}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/admin/services/${s.id}`}
                  className="text-xs text-cream/40 hover:text-cream transition-colors px-3 py-1.5 border border-cream/10 hover:border-cream/30 rounded-lg"
                >
                  Edit
                </Link>
                <form action={deleteService}>
                  <input type="hidden" name="id" value={s.id} />
                  <button
                    type="submit"
                    className="text-xs text-cream/20 hover:text-red-400 transition-colors px-3 py-1.5 border border-cream/[0.07] hover:border-red-400/30 rounded-lg cursor-pointer"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-cream/30 text-xs mt-6">
        The section heading and intro line above these cards live in{" "}
        <Link href="/admin/settings" className="text-cream/50 hover:text-green transition-colors">
          Settings → Homepage Sections
        </Link>
        .
      </p>
    </div>
  );
}
