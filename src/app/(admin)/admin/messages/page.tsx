import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";
import type { ContactSubmission } from "@/lib/types";

async function markAsRead(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await db.contactSubmission.update({ where: { id }, data: { isRead: true } });
  revalidatePath("/admin/messages");
}

async function markAllRead() {
  "use server";
  await db.contactSubmission.updateMany({
    where: { isRead: false },
    data: { isRead: true },
  });
  revalidatePath("/admin/messages");
}

async function deleteMessage(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await db.contactSubmission.delete({ where: { id } });
  revalidatePath("/admin/messages");
}

export default async function AdminMessagesPage() {
  let messages: ContactSubmission[] = [];
  try {
    messages = (await db.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
    })) as ContactSubmission[];
  } catch {
    /* DB unavailable */
  }

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-cream">Messages</h1>
          <p className="text-cream/40 text-sm mt-1">
            {messages.length} total
            {unreadCount > 0 && (
              <span className="ml-2 text-green">· {unreadCount} unread</span>
            )}
          </p>
        </div>
        {unreadCount > 0 && (
          <form action={markAllRead}>
            <button
              type="submit"
              className="text-sm px-4 py-2 border border-cream/20 text-cream/50 rounded-lg hover:border-cream/40 hover:text-cream transition-all cursor-pointer"
            >
              Mark all read
            </button>
          </form>
        )}
      </div>

      {messages.length === 0 ? (
        <p className="text-cream/30 text-sm">No messages yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl border p-6 transition-all ${
                !msg.isRead
                  ? "border-green/20 bg-green/[0.03]"
                  : "border-cream/[0.07] bg-cream/[0.02]"
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    {!msg.isRead && (
                      <span className="w-1.5 h-1.5 rounded-full bg-green shrink-0" />
                    )}
                    <p className="text-cream font-medium">{msg.name}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-cream/40 mt-1 ml-4">
                    <span>{msg.email}</span>
                    {msg.company && (
                      <>
                        <span className="text-cream/20">·</span>
                        <span>{msg.company}</span>
                      </>
                    )}
                    <span className="text-cream/20">·</span>
                    <span>{format(msg.createdAt, "MMM d, yyyy 'at' h:mm a")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!msg.isRead && (
                    <form action={markAsRead}>
                      <input type="hidden" name="id" value={msg.id} />
                      <button
                        type="submit"
                        className="text-xs text-cream/40 hover:text-cream transition-colors px-3 py-1.5 border border-cream/10 hover:border-cream/30 rounded-lg cursor-pointer"
                      >
                        Mark read
                      </button>
                    </form>
                  )}
                  <form action={deleteMessage}>
                    <input type="hidden" name="id" value={msg.id} />
                    <button
                      type="submit"
                      className="text-xs text-cream/20 hover:text-red-400 transition-colors px-3 py-1.5 border border-cream/[0.07] hover:border-red-400/30 rounded-lg cursor-pointer"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
              <p className="text-cream/70 text-sm leading-relaxed">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
