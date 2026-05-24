import { db } from "@/lib/db";
import Link from "next/link";
import type { CaseStudy, ContactSubmission } from "@/lib/types";

async function getMetrics() {
  try {
    const [total, published, unread, testimonialCount] = await Promise.all([
      db.caseStudy.count(),
      db.caseStudy.count({ where: { published: true } }),
      db.contactSubmission.count({ where: { isRead: false } }),
      db.testimonial.count(),
    ]);
    const [recentStudiesRaw, recentMessagesRaw] = await Promise.all([
      db.caseStudy.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      db.contactSubmission.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);
    const recentStudies = recentStudiesRaw as CaseStudy[];
    const recentMessages = recentMessagesRaw as ContactSubmission[];
    return {
      total,
      published,
      draft: total - published,
      unread,
      testimonialCount,
      recentStudies,
      recentMessages,
    };
  } catch {
    return null;
  }
}

export default async function AdminPage() {
  const m = await getMetrics();

  if (!m) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-cream mb-2">Dashboard</h1>
        <p className="text-cream/30 text-sm">Database connection unavailable.</p>
      </div>
    );
  }

  const statCards = [
    { label: "Case Studies", value: m.total, highlight: false },
    { label: "Published", value: m.published, highlight: true },
    { label: "Drafts", value: m.draft, highlight: false },
    { label: "Unread Messages", value: m.unread, highlight: m.unread > 0 },
    { label: "Testimonials", value: m.testimonialCount, highlight: false },
  ];

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-cream">Dashboard</h1>
        <p className="text-cream/40 text-sm mt-1">Site overview and recent activity.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-cream/[0.07] bg-cream/[0.03] p-5"
          >
            <p
              className={`text-3xl font-bold tabular-nums ${
                card.highlight ? "text-green" : "text-cream"
              }`}
            >
              {card.value}
            </p>
            <p className="text-cream/40 text-xs mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent case studies */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-cream/40 uppercase tracking-widest">
              Recent Case Studies
            </h2>
            <Link
              href="/admin/case-studies"
              className="text-xs text-cream/30 hover:text-green transition-colors"
            >
              Manage →
            </Link>
          </div>
          {m.recentStudies.length === 0 ? (
            <p className="text-cream/20 text-sm">No case studies yet.</p>
          ) : (
            <div className="flex flex-col">
              {m.recentStudies.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between py-3 border-b border-cream/[0.05] last:border-0"
                >
                  <div>
                    <p className="text-cream text-sm font-medium">{s.title}</p>
                    <p className="text-cream/30 text-xs mt-0.5">{s.clientName}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                      s.published
                        ? "bg-green/10 text-green"
                        : "bg-cream/5 text-cream/30"
                    }`}
                  >
                    {s.published ? "Live" : "Draft"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent messages */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-cream/40 uppercase tracking-widest">
              Recent Messages
            </h2>
            <Link
              href="/admin/messages"
              className="text-xs text-cream/30 hover:text-green transition-colors"
            >
              View all →
            </Link>
          </div>
          {m.recentMessages.length === 0 ? (
            <p className="text-cream/20 text-sm">No messages yet.</p>
          ) : (
            <div className="flex flex-col">
              {m.recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-start justify-between gap-3 py-3 border-b border-cream/[0.05] last:border-0"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {!msg.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-green shrink-0" />
                      )}
                      <p className="text-cream text-sm font-medium truncate">
                        {msg.name}
                      </p>
                    </div>
                    <p className="text-cream/30 text-xs mt-0.5 truncate">
                      {msg.message}
                    </p>
                  </div>
                  <span className="text-cream/20 text-xs shrink-0">{msg.email}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
