import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";

async function createStat(formData: FormData) {
  "use server";
  await db.heroStat.create({
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

export default function NewStatPage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8 flex items-center gap-3">
        <Link href="/admin/stats" className="text-cream/30 hover:text-cream text-sm transition-colors">
          ← Hero Stats
        </Link>
        <span className="text-cream/20">/</span>
        <h1 className="text-xl font-bold text-cream">New Stat</h1>
      </div>

      <form action={createStat} className="flex flex-col gap-5">
        <Field
          label="Value *"
          name="value"
          placeholder="$2M+"
          required
          hint="Keep it short — it renders large. e.g. 5+, 50+, 3×, $2M+"
        />
        <Field
          label="Label *"
          name="label"
          placeholder="Ad Spend Managed"
          required
          hint="Two or three words reads best under the value."
        />
        <Field label="Display Order" name="order" placeholder="0 (lower = first)" />

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-green text-canvas font-bold text-sm hover:bg-green/80 transition-colors"
          >
            Add Stat
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
  placeholder,
  required,
  hint,
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-cream/50 text-xs mb-1.5 tracking-widest uppercase">{label}</label>
      <input
        name={name}
        placeholder={placeholder}
        required={required}
        className="w-full bg-cream/[0.04] border border-cream/[0.1] text-cream text-sm px-4 py-2.5 outline-none focus:border-green/50 transition-colors placeholder:text-cream/20"
      />
      {hint && <p className="text-cream/30 text-xs mt-1.5">{hint}</p>}
    </div>
  );
}
