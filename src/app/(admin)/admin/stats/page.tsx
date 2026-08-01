import { revalidatePath } from "next/cache";
import Link from "next/link";
import { db } from "@/lib/db";
import { getHeroStats, DEFAULT_STATS } from "@/lib/content";

// Always read the live DB — this list is the source of truth for the editor.
export const dynamic = "force-dynamic";

async function deleteStat(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await db.heroStat.delete({ where: { id } });
  revalidatePath("/admin/stats");
  revalidatePath("/");
}

export default async function AdminStatsPage() {
  const stats = await getHeroStats();

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-cream">Hero Stats</h1>
          <p className="text-cream/40 text-sm mt-1">
            The numbers row under the homepage hero · {stats.length} total
          </p>
        </div>
        <Link
          href="/admin/stats/new"
          className="px-4 py-2 bg-green text-canvas text-sm font-bold hover:bg-green/80 transition-colors shrink-0"
        >
          + Add Stat
        </Link>
      </div>

      {stats.length === 0 ? (
        <div className="rounded-xl border border-cream/[0.07] bg-cream/[0.02] p-6">
          <p className="text-cream/50 text-sm">
            No stats added yet — the homepage is showing these placeholders:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {DEFAULT_STATS.map((s) => (
              <div key={s.label} className="rounded-lg border border-cream/[0.07] px-3 py-2.5">
                <p className="text-cream/60 font-bold text-lg tabular-nums">{s.value}</p>
                <p className="text-cream/30 text-[10px] uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-cream/30 text-xs mt-4">
            Add your first stat and the placeholders are replaced entirely.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {stats.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-4 rounded-xl border border-cream/[0.07] bg-cream/[0.02] p-4"
            >
              <p className="text-green font-extrabold text-xl tabular-nums w-24 shrink-0">
                {s.value}
              </p>
              <div className="flex-1 min-w-0">
                <p className="text-cream text-sm truncate">{s.label}</p>
                <p className="text-cream/30 text-xs mt-0.5">Order {s.order}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/admin/stats/${s.id}`}
                  className="text-xs text-cream/40 hover:text-cream transition-colors px-3 py-1.5 border border-cream/10 hover:border-cream/30 rounded-lg"
                >
                  Edit
                </Link>
                <form action={deleteStat}>
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
        Four stats fit the row best (2 columns on mobile, 4 on desktop), but any number works.
      </p>
    </div>
  );
}
