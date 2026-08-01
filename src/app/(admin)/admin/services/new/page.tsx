import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { IconField, ICON_CHOICES } from "@/app/(admin)/_components/icon-field";

async function createService(formData: FormData) {
  "use server";
  await db.service.create({
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

export default function NewServicePage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8 flex items-center gap-3">
        <Link href="/admin/services" className="text-cream/30 hover:text-cream text-sm transition-colors">
          ← Services
        </Link>
        <span className="text-cream/20">/</span>
        <h1 className="text-xl font-bold text-cream">New Service</h1>
      </div>

      <form action={createService} className="flex flex-col gap-5">
        <div>
          <label className="block text-cream/50 text-xs mb-1.5 tracking-widest uppercase">Title *</label>
          <input
            name="title"
            placeholder="Paid Media"
            required
            className="w-full bg-cream/[0.04] border border-cream/[0.1] text-cream text-sm px-4 py-2.5 outline-none focus:border-green/50 transition-colors placeholder:text-cream/20"
          />
        </div>

        <IconField />

        <div>
          <label className="block text-cream/50 text-xs mb-1.5 tracking-widest uppercase">
            Description *
          </label>
          <textarea
            name="description"
            rows={3}
            required
            placeholder="Profitable Google and Meta campaigns optimised for CPL and ROAS, not vanity clicks."
            className="w-full bg-cream/[0.04] border border-cream/[0.1] text-cream text-sm px-4 py-2.5 outline-none focus:border-green/50 transition-colors placeholder:text-cream/20 resize-y"
          />
          <p className="text-cream/30 text-xs mt-1.5">One or two sentences keeps the cards even in height.</p>
        </div>

        <div>
          <label className="block text-cream/50 text-xs mb-1.5 tracking-widest uppercase">
            Display Order
          </label>
          <input
            name="order"
            placeholder="0 (lower = first)"
            className="w-full bg-cream/[0.04] border border-cream/[0.1] text-cream text-sm px-4 py-2.5 outline-none focus:border-green/50 transition-colors placeholder:text-cream/20"
          />
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-green text-canvas font-bold text-sm hover:bg-green/80 transition-colors"
          >
            Add Service
          </button>
          <Link href="/admin/services" className="text-sm text-cream/40 hover:text-cream transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
