import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import type { Achievement } from "@/lib/types";
import { ImageUploadField } from "@/app/(admin)/_components/image-upload-field";

async function updateAchievement(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const imageUrl = ((formData.get("imageUrl") as string) ?? "").trim();
  if (!imageUrl) throw new Error("An image is required for an achievement.");

  await db.achievement.update({
    where: { id },
    data: {
      type:        (formData.get("type")        as string),
      title:       (formData.get("title")       as string).trim(),
      description: (formData.get("description") as string).trim() || null,
      imageUrl,
      order:       parseInt((formData.get("order") as string) || "0", 10),
    },
  });
  revalidatePath("/admin/achievements");
  redirect("/admin/achievements");
}

export default async function EditAchievementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let achievement: Achievement | null = null;
  try {
    achievement = (await db.achievement.findUnique({ where: { id } })) as Achievement | null;
  } catch {}
  if (!achievement) notFound();

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8 flex items-center gap-3">
        <Link href="/admin/achievements" className="text-cream/30 hover:text-cream text-sm transition-colors">
          ← Achievements
        </Link>
        <span className="text-cream/20">/</span>
        <h1 className="text-xl font-bold text-cream">Edit Achievement</h1>
      </div>

      <form action={updateAchievement} className="flex flex-col gap-5">
        <input type="hidden" name="id" value={achievement.id} />

        <div>
          <label className="block text-cream/50 text-xs mb-1.5 tracking-widest uppercase">Type *</label>
          <select
            name="type"
            required
            defaultValue={achievement.type}
            className="w-full bg-cream/[0.04] border border-cream/[0.1] text-cream text-sm px-4 py-2.5 outline-none focus:border-green/50 transition-colors"
          >
            <option value="award">Award / Recognition</option>
            <option value="dashboard">Dashboard Screenshot</option>
          </select>
        </div>

        <Field label="Title *" name="title" defaultValue={achievement.title} required />
        <ImageUploadField name="imageUrl" label="Image" defaultValue={achievement.imageUrl} />

        <div>
          <label className="block text-cream/50 text-xs mb-1.5 tracking-widest uppercase">Description</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={achievement.description ?? ""}
            className="w-full bg-cream/[0.04] border border-cream/[0.1] text-cream text-sm px-4 py-2.5 outline-none focus:border-green/50 transition-colors placeholder:text-cream/20 resize-y"
          />
        </div>

        <Field label="Display Order" name="order" defaultValue={String(achievement.order)} />

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-green text-canvas font-bold text-sm hover:bg-green/80 transition-colors"
          >
            Save Changes
          </button>
          <Link href="/admin/achievements" className="text-sm text-cream/40 hover:text-cream transition-colors">
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
