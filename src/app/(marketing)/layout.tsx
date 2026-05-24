import { MarketingNav } from "./_components/nav";
import { CursorTrail }  from "./_components/cursor-trail";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="marketing-zone">
      <CursorTrail />
      <MarketingNav />
      <main>{children}</main>
      <footer className="border-t border-cream/[0.07] px-4 sm:px-8 py-10 sm:py-12">
        <div className="max-w-6xl mx-auto flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-cream tracking-tight">Studio</p>
            <p className="text-sm text-cream/40 mt-1">Data-driven digital marketing.</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-cream/40">
            <a href="/#work"     className="hover:text-cream transition-colors">Work</a>
            <a href="/#services" className="hover:text-cream transition-colors">Services</a>
            <a href="/#contact"  className="hover:text-cream transition-colors">Contact</a>
            <span className="text-cream/20 hidden sm:inline">·</span>
            <span>© {new Date().getFullYear()} Studio</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
