import Link from "next/link";
import { MarketingNav } from "./_components/nav";
import { CursorTrail }  from "./_components/cursor-trail";
import { getSettings } from "@/lib/settings";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const s = await getSettings();

  // Override the brand color CSS variables for the public site only. The
  // utilities (bg-canvas / text-cream / bg-green) read these via var(), so
  // setting them here cascades to everything inside .marketing-zone without
  // touching the admin panel.
  const themeVars = {
    "--color-canvas": s.colorCanvas,
    "--color-cream":  s.colorCream,
    "--color-green":  s.colorGreen,
  } as React.CSSProperties;

  return (
    <div className="marketing-zone bg-canvas min-h-screen" style={themeVars}>
      <CursorTrail />
      <MarketingNav name={s.brandName} />
      <main>{children}</main>
      <footer className="border-t border-cream/[0.07] px-4 sm:px-8 py-10 sm:py-12">
        <div className="max-w-6xl mx-auto flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-cream tracking-tight">{s.brandName}</p>
            {s.tagline && <p className="text-sm text-cream/40 mt-1">{s.tagline}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-cream/40">
            <Link href="/#work"     className="hover:text-cream transition-colors">Work</Link>
            <Link href="/#services" className="hover:text-cream transition-colors">Services</Link>
            <Link href="/#contact"  className="hover:text-cream transition-colors">Contact</Link>
            {s.email && (
              <a href={`mailto:${s.email}`} className="hover:text-cream transition-colors">{s.email}</a>
            )}
            {s.phone && (
              <a href={`tel:${s.phone.replace(/\s+/g, "")}`} className="hover:text-cream transition-colors">{s.phone}</a>
            )}
            <span className="text-cream/20 hidden sm:inline">·</span>
            <span>© {new Date().getFullYear()} {s.brandName}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
