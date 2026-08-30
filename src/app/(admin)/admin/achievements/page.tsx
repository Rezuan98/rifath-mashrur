import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import type { Achievement } from "@/lib/types";
import { isRenderableImage } from "@/lib/image";

async function deleteAchievement(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await db.achievement.delete({ where: { id } });
  revalidatePath("/admin/achievements");
}

export default async function AdminAchievementsPage() {
  let achievements: Achievement[] = [];
  try {
    achievements = (await db.achievement.findMany({
      orderBy: [{ type: "asc" }, { order: "asc" }, { createdAt: "desc" }],
    })) as Achievement[];
  } catch {}

  const awards     = achievements.filter((a) => a.type === "award");
  const dashboards = achievements.filter((a) => a.type === "dashboard");

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-cream">Achievements</h1>
          <p className="text-cream/40 text-sm mt-1">
            {awards.length} award{awards.length !== 1 ? "s" : ""} · {dashboards.length} dashboard{dashboards.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/achievements/new"
          className="px-4 py-2 bg-green text-canvas text-sm font-bold hover:bg-green/80 transition-colors"
        >
          + Add Achievement
        </Link>
      </div>

      {achievements.length === 0 ? (
        <p className="text-cream/30 text-sm">No achievements added yet.</p>
      ) : (
        <div className="flex flex-col gap-8">
          {[
            { label: "Awards & Recognition", items: awards },
            { label: "Dashboard Screenshots", items: dashboards },
          ].map(({ label, items }) =>
            items.length === 0 ? null : (
              <div key={label}>
                <h2 className="text-cream/50 text-xs tracking-widest uppercase mb-4">{label}</h2>
                <div className="flex flex-col gap-3">
                  {items.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-4 rounded-xl border border-cream/[0.07] bg-cream/[0.02] p-4"
                    >
                      {/* thumbnail */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-cream/[0.05] border border-cream/[0.07] flex items-center justify-center">
                        {isRenderableImage(a.imageUrl) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-red-400/70 text-[9px] text-center leading-tight px-1">No image</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-cream text-sm font-medium truncate">{a.title}</p>
                        {a.description && (
                          <p className="text-cream/40 text-xs mt-0.5 line-clamp-1">{a.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/admin/achievements/${a.id}`}
                          className="text-xs text-cream/40 hover:text-cream transition-colors px-3 py-1.5 border border-cream/10 hover:border-cream/30 rounded-lg"
                        >
                          Edit
                        </Link>
                        <form action={deleteAchievement}>
                          <input type="hidden" name="id" value={a.id} />
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
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
