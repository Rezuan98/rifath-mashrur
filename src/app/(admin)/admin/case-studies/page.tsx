import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { format } from "date-fns";
import type { CaseStudy } from "@/lib/types";

async function togglePublish(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const published = formData.get("published") === "true";
  await db.caseStudy.update({ where: { id }, data: { published: !published } });
  revalidatePath("/admin/case-studies");
}

async function deleteStudy(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await db.caseStudy.delete({ where: { id } });
  revalidatePath("/admin/case-studies");
}

export default async function AdminCaseStudiesPage() {
  let studies: CaseStudy[] = [];
  try {
    studies = (await db.caseStudy.findMany({ orderBy: { createdAt: "desc" } })) as CaseStudy[];
  } catch {
    /* DB unavailable */
  }

  const liveCount = studies.filter((s) => s.published).length;

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-cream">Case Studies</h1>
          <p className="text-cream/40 text-sm mt-1">
            {studies.length} total · {liveCount} published — published ones fill the
            Work section of your site
          </p>
        </div>
        <Link
          href="/admin/case-studies/new"
          className="px-4 py-2 bg-green text-canvas text-sm font-bold hover:bg-green/80 transition-colors shrink-0"
        >
          + New Case Study
        </Link>
      </div>

      {studies.length === 0 ? (
        <p className="text-cream/30 text-sm">No case studies yet.</p>
      ) : (
        <div className="rounded-xl border border-cream/[0.07] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream/[0.07] bg-cream/[0.02]">
                <th className="text-left px-4 py-3 text-cream/40 font-medium">Title</th>
                <th className="text-left px-4 py-3 text-cream/40 font-medium hidden sm:table-cell">
                  Category
                </th>
                <th className="text-left px-4 py-3 text-cream/40 font-medium hidden md:table-cell">
                  Client
                </th>
                <th className="text-left px-4 py-3 text-cream/40 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-cream/40 font-medium hidden lg:table-cell">
                  Date
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {studies.map((study) => (
                <tr
                  key={study.id}
                  className="border-b border-cream/[0.05] last:border-0 hover:bg-cream/[0.02] transition-colors"
                >
                  <td className="px-4 py-4 max-w-xs">
                    <p className="text-cream font-medium truncate">{study.title}</p>
                    <p className="text-cream/30 text-xs mt-0.5 truncate">{study.slug}</p>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-green/10 text-green">
                      {study.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-cream/60 hidden md:table-cell">
                    {study.clientName}
                  </td>
                  <td className="px-4 py-4">
                    <form action={togglePublish}>
                      <input type="hidden" name="id" value={study.id} />
                      <input type="hidden" name="published" value={study.published.toString()} />
                      <button
                        type="submit"
                        className={`text-xs px-3 py-1 rounded-full border transition-all cursor-pointer ${
                          study.published
                            ? "border-green/40 text-green hover:bg-green/10"
                            : "border-cream/20 text-cream/40 hover:border-cream/40 hover:text-cream/70"
                        }`}
                      >
                        {study.published ? "● Live" : "○ Draft"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-4 text-cream/30 text-xs hidden lg:table-cell">
                    {format(study.createdAt, "MMM d, yyyy")}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 justify-end">
                      <Link
                        href={`/admin/case-studies/${study.id}`}
                        className="text-xs text-cream/40 hover:text-cream transition-colors px-2 py-1 rounded hover:bg-cream/5"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/case-studies/${study.slug}`}
                        target="_blank"
                        className="text-xs text-cream/30 hover:text-cream transition-colors px-2 py-1 rounded hover:bg-cream/5"
                      >
                        View ↗
                      </Link>
                      <form action={deleteStudy}>
                        <input type="hidden" name="id" value={study.id} />
                        <button
                          type="submit"
                          className="text-xs text-cream/20 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-400/5"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
