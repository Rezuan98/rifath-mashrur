import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import type { HeroStat } from "@/lib/types";

async function updateStat(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await db.heroStat.update({
    where: { id },
    data: {
      value: (formData.get("value") as string).trim(),
      label: (formData.get("label") as string).trim(),
      order: parseInt((formData.get("order") as string) || "0", 10) || 0,
    },
  });
  revalidatePath("/admin/stats");
  revalidatePath("/");
  redirect("/admin/stats");
}

export default async function EditStatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let stat: HeroStat | null = null;
  try {
    stat = (await db.heroStat.findUnique({ where: { id } })) as HeroStat | null;
  } catch {}
  if (!stat) notFound();

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8 flex items-center gap-3">
        <Link href="/admin/stats" className="text-cream/30 hover:text-cream text-sm transition-colors">
          ← Hero Stats
        </Link>
        <span className="text-cream/20">/</span>
        <h1 className="text-xl font-bold text-cream">Edit Stat</h1>
      </div>

      <form action={updateStat} className="flex flex-col gap-5">
        <input type="hidden" name="id" value={stat.id} />
        <Field label="Value *" name="value" defaultValue={stat.value} required />
        <Field label="Label *" name="label" defaultValue={stat.label} required />
        <Field label="Display Order" name="order" defaultValue={String(stat.order)} />

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-green text-canvas font-bold text-sm hover:bg-green/80 transition-colors"
          >
            Save Changes
          </button>
          <Link href="/admin/stats" className="text-sm text-cream/40 hover:text-cream transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
}) {
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
