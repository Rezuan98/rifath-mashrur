import { AdminSidebar } from "./_components/sidebar";
import { getSettings } from "@/lib/settings";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { brandName } = await getSettings();
  return (
    <div className="flex min-h-screen">
      <AdminSidebar brandName={brandName} />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
