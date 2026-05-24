import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import type { WorkExperience } from "@/lib/types";

async function deleteExperience(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await db.workExperience.delete({ where: { id } });
  revalidatePath("/admin/experience");
}

export default async function AdminExperiencePage() {
  let experiences: WorkExperience[] = [];
  try {
    experiences = (await db.workExperience.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    })) as WorkExperience[];
  } catch {}

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-cream">Work Experience</h1>
          <p className="text-cream/40 text-sm mt-1">{experiences.length} total</p>
        </div>
        <Link
          href="/admin/experience/new"
          className="px-4 py-2 bg-green text-canvas text-sm font-bold hover:bg-green/80 transition-colors"
        >
          + Add Experience
        </Link>
      </div>

      {experiences.length === 0 ? (
        <p className="text-cream/30 text-sm">No work experience added yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="rounded-xl border border-cream/[0.07] bg-cream/[0.02] p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <p className="text-cream font-medium text-sm">{exp.role}</p>
                  <p className="text-cream/40 text-xs mt-0.5">
                    {exp.company} · {exp.startDate} — {exp.current ? "Present" : (exp.endDate ?? "")}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/experience/${exp.id}`}
                    className="text-xs text-cream/40 hover:text-cream transition-colors px-3 py-1.5 border border-cream/10 hover:border-cream/30 rounded-lg"
                  >
                    Edit
                  </Link>
                  <form action={deleteExperience}>
                    <input type="hidden" name="id" value={exp.id} />
                    <button
                      type="submit"
                      className="text-xs text-cream/20 hover:text-red-400 transition-colors px-3 py-1.5 border border-cream/[0.07] hover:border-red-400/30 rounded-lg cursor-pointer"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
              <p className="text-cream/50 text-sm leading-relaxed line-clamp-2">{exp.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
