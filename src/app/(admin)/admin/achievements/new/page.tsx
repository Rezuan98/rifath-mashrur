import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ImageUploadField } from "@/app/(admin)/_components/image-upload-field";

async function createAchievement(formData: FormData) {
  "use server";
  await db.achievement.create({
    data: {
      type:        (formData.get("type")        as string),
      title:       (formData.get("title")       as string).trim(),
      description: (formData.get("description") as string).trim() || null,
      imageUrl:    (formData.get("imageUrl")    as string).trim(),
      order:       parseInt((formData.get("order") as string) || "0", 10),
    },
  });
  revalidatePath("/admin/achievements");
  redirect("/admin/achievements");
}

export default function NewAchievementPage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8 flex items-center gap-3">
        <Link href="/admin/achievements" className="text-cream/30 hover:text-cream text-sm transition-colors">
          ← Achievements
        </Link>
        <span className="text-cream/20">/</span>
        <h1 className="text-xl font-bold text-cream">New Achievement</h1>
      </div>

      <form action={createAchievement} className="flex flex-col gap-5">
        <div>
          <label className="block text-cream/50 text-xs mb-1.5 tracking-widest uppercase">Type *</label>
          <select
            name="type"
            required
            className="w-full bg-cream/[0.04] border border-cream/[0.1] text-cream text-sm px-4 py-2.5 outline-none focus:border-green/50 transition-colors"
          >
            <option value="award">Award / Recognition</option>
            <option value="dashboard">Dashboard Screenshot</option>
          </select>
        </div>

        <Field label="Title *" name="title" placeholder="Google Ads Certified — Top 1%" required />
        <ImageUploadField name="imageUrl" label="Image" />

        <div>
          <label className="block text-cream/50 text-xs mb-1.5 tracking-widest uppercase">Description</label>
          <textarea
            name="description"
            rows={3}
            placeholder="Optional context about this achievement…"
            className="w-full bg-cream/[0.04] border border-cream/[0.1] text-cream text-sm px-4 py-2.5 outline-none focus:border-green/50 transition-colors placeholder:text-cream/20 resize-y"
          />
        </div>

        <Field label="Display Order" name="order" placeholder="0 (lower = first)" />

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-green text-canvas font-bold text-sm hover:bg-green/80 transition-colors"
          >
            Add Achievement
          </button>
          <Link href="/admin/achievements" className="text-sm text-cream/40 hover:text-cream transition-colors">
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
