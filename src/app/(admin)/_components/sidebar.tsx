"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Mail, MessageSquareQuote, Briefcase, Trophy, Settings, LogOut, BarChart3, Sparkles } from "lucide-react";
import { logout } from "@/app/login/actions";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/stats",         label: "Hero Stats",    icon: BarChart3 },
  { href: "/admin/case-studies", label: "Case Studies", icon: FileText },
  { href: "/admin/services",      label: "Services",      icon: Sparkles },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/experience",    label: "Experience",    icon: Briefcase },
  { href: "/admin/achievements",  label: "Achievements",  icon: Trophy },
  { href: "/admin/messages",      label: "Messages",      icon: Mail },
  { href: "/admin/settings",      label: "Settings",      icon: Settings },
];

export function AdminSidebar({ brandName }: { brandName: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-cream/[0.07] flex flex-col min-h-screen bg-canvas sticky top-0 h-screen overflow-y-auto">
      <div className="px-5 py-6 border-b border-cream/[0.07]">
        <Link
          href="/"
          className="text-cream/50 text-xs hover:text-cream transition-colors flex items-center gap-1.5 mb-3"
        >
          ← Back to site
        </Link>
        <p className="text-cream font-semibold text-sm tracking-tight">{brandName}</p>
        <p className="text-cream/30 text-xs mt-0.5">Admin Dashboard</p>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? "bg-green/10 text-green"
                  : "text-cream/50 hover:text-cream hover:bg-cream/[0.05]"
              }`}
            >
              <Icon size={15} className="shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-cream/[0.07]">
        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-cream/40 hover:text-red-400 hover:bg-red-400/[0.05] transition-all"
          >
            <LogOut size={15} className="shrink-0" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
