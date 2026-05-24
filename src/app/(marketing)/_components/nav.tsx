"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/#work",         label: "Work" },
  { href: "/#services",     label: "Services" },
  { href: "/#experience",   label: "Experience" },
  { href: "/#achievements", label: "Achievements" },
  { href: "/#testimonials", label: "Testimonials" },
  { href: "/#contact",      label: "Contact" },
];

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const close = () => setOpen(false);

  /* Nav pill style — scrolled state is always false on both SSR and first
     client render, so style objects are identical: zero hydration mismatch. */
  const navStyle: React.CSSProperties = {
    maxWidth:        scrolled ? "1000px"                    : "1440px",
    paddingTop:      scrolled ? "10px"                      : "18px",
    paddingBottom:   scrolled ? "10px"                      : "18px",
    paddingLeft:     scrolled ? "24px"                      : "52px",
    paddingRight:    scrolled ? "24px"                      : "52px",
    marginTop:       scrolled ? "12px"                      : "0px",
    backgroundColor: scrolled ? "rgba(26,25,23,0.97)"       : "rgba(26,25,23,0.75)",
    boxShadow:       scrolled ? "0 8px 40px rgba(0,0,0,0.5)": "none",
    borderColor:     scrolled ? "rgba(245,239,224,0.12)"    : "rgba(245,239,224,0.07)",
    transition:      "max-width .48s cubic-bezier(.4,0,.2,1), padding .48s cubic-bezier(.4,0,.2,1), margin .48s cubic-bezier(.4,0,.2,1), background-color .48s cubic-bezier(.4,0,.2,1), box-shadow .48s cubic-bezier(.4,0,.2,1), border-color .5s",
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">

      {/* ── Main bar ───────────────────────────────────────────── */}
      <div className="flex justify-center">
        <div
          style={navStyle}
          className="w-full flex items-center justify-between backdrop-blur-xl border-b"
        >
          {/* Brand */}
          <Link href="/" onClick={close} className="group flex items-center gap-2.5 shrink-0">
            <span className="w-5 h-5 border border-green/50 flex items-center justify-center group-hover:border-green transition-colors">
              <span className="w-1.5 h-1.5 bg-green" />
            </span>
            <span className="font-bold text-sm tracking-tight text-cream group-hover:text-green transition-colors">
              Rifath Mashrur
            </span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden sm:flex items-center">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="relative px-3 py-1 text-[13px] text-cream/50 hover:text-cream transition-colors group"
              >
                {label}
                <span className="absolute bottom-0 left-3 right-3 h-px bg-green scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              href="/#contact"
              onClick={close}
              className="hidden sm:flex items-center gap-1.5 px-5 py-2.5 bg-green text-canvas text-sm font-bold hover:bg-green/80 transition-colors"
            >
              Let&apos;s Talk
              <span className="text-canvas/60 text-xs">↗</span>
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setOpen(o => !o)}
              className="sm:hidden flex flex-col justify-center gap-[5px] w-8 h-8 shrink-0 group"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span className={`block h-px w-5 bg-cream transition-all duration-300 origin-center ${open ? "rotate-45 translate-y-[6px]" : ""}`} />
              <span className={`block h-px w-5 bg-cream transition-all duration-200 ${open ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`block h-px w-5 bg-cream transition-all duration-300 origin-center ${open ? "-rotate-45 -translate-y-[6px]" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile dropdown — CSS max-height transition, no Framer Motion ── */}
      <div
        className="sm:hidden w-full bg-canvas/97 backdrop-blur-xl border-b border-cream/[0.1] overflow-hidden"
        style={{
          maxHeight:  open ? "480px" : "0px",
          opacity:    open ? 1 : 0,
          transition: "max-height .25s ease, opacity .2s ease",
        }}
      >
        <div className="flex flex-col px-6 py-3">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={close}
              className="py-4 text-base text-cream/60 hover:text-cream border-b border-cream/[0.06] last:border-0 transition-colors"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/#contact"
            onClick={close}
            className="mt-3 flex items-center justify-center gap-2 py-3.5 bg-green text-canvas font-bold text-sm"
          >
            Let&apos;s Talk ↗
          </Link>
        </div>
      </div>
    </header>
  );
}
