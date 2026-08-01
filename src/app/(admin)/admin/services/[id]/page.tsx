import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import type { Service } from "@/lib/types";
import { IconField, ICON_CHOICES } from "@/app/(admin)/_components/icon-field";

async function updateService(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await db.service.update({
    where: { id },
    data: {
      title:       (formData.get("title")       as string).trim(),
      description: (formData.get("description") as string).trim(),
      icon:        ((formData.get("icon")       as string) || "").trim() || ICON_CHOICES[0],
      order:       parseInt((formData.get("order") as string) || "0", 10) || 0,
    },
  });
  revalidatePath("/admin/services");
  revalidatePath("/");
  redirect("/admin/services");
}

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let service: Service | null = null;
  try {
    service = (await db.service.findUnique({ where: { id } })) as Service | null;
  } catch {}
  if (!service) notFound();

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8 flex items-center gap-3">
        <Link href="/admin/services" className="text-cream/30 hover:text-cream text-sm transition-colors">
          ← Services
        </Link>
        <span className="text-cream/20">/</span>
        <h1 className="text-xl font-bold text-cream">Edit Service</h1>
      </div>

      <form action={updateService} className="flex flex-col gap-5">
        <input type="hidden" name="id" value={service.id} />

        <div>
          <label className="block text-cream/50 text-xs mb-1.5 tracking-widest uppercase">Title *</label>
          <input
            name="title"
            defaultValue={service.title}
            required
            className="w-full bg-cream/[0.04] border border-cream/[0.1] text-cream text-sm px-4 py-2.5 outline-none focus:border-green/50 transition-colors placeholder:text-cream/20"
          />
        </div>

        <IconField defaultValue={service.icon} />

        <div>
          <label className="block text-cream/50 text-xs mb-1.5 tracking-widest uppercase">
            Description *
          </label>
          <textarea
            name="description"
            rows={3}
            required
            defaultValue={service.description}
            className="w-full bg-cream/[0.04] border border-cream/[0.1] text-cream text-sm px-4 py-2.5 outline-none focus:border-green/50 transition-colors placeholder:text-cream/20 resize-y"
          />
        </div>

        <div>
          <label className="block text-cream/50 text-xs mb-1.5 tracking-widest uppercase">
            Display Order
          </label>
          <input
            name="order"
            defaultValue={String(service.order)}
            className="w-full bg-cream/[0.04] border border-cream/[0.1] text-cream text-sm px-4 py-2.5 outline-none focus:border-green/50 transition-colors placeholder:text-cream/20"
          />
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-green text-canvas font-bold text-sm hover:bg-green/80 transition-colors"
          >
            Save Changes
          </button>
          <Link href="/admin/services" className="text-sm text-cream/40 hover:text-cream transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
