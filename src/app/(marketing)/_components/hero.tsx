"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DataNetwork } from "./data-network";

const E = "cubic-bezier(0.25,0.1,0,1)";

const stats = [
  { value: "5+",   label: "Years Experience" },
  { value: "50+",  label: "Brands Grown" },
  { value: "3×",   label: "Avg. ROI" },
  { value: "$2M+", label: "Ad Spend Managed" },
];

export function HeroSection() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(id);
  }, []);

  /* Helpers — return a style object; same value on SSR (show=false) and first
     client render (show=false), so there is ZERO hydration mismatch. */
  const up = (delay: number): React.CSSProperties => ({
    opacity:    show ? 1 : 0,
    transform:  show ? "translateY(0px)" : "translateY(30px)",
    transition: `opacity .8s ${E} ${delay}s, transform .8s ${E} ${delay}s`,
  });
  const fx = (delay: number, x = 0): React.CSSProperties => ({
    opacity:    show ? 1 : 0,
    transform:  show ? "translateX(0px)" : `translateX(${x}px)`,
    transition: `opacity .85s ${E} ${delay}s, transform .85s ${E} ${delay}s`,
  });

  return (
    <section className="relative min-h-screen flex flex-col bg-canvas overflow-hidden">

      {/* ── Background layers ─────────────────────────────────── */}
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #7CFC00 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />
      <DataNetwork className="absolute inset-0 pointer-events-none z-[1]" />
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden
      >
        <line x1="0"    y1="0"    x2="38%"  y2="100%" stroke="#7CFC00" strokeWidth="0.5" opacity="0.05" />
        <line x1="100%" y1="0"    x2="63%"  y2="100%" stroke="#7CFC00" strokeWidth="0.5" opacity="0.04" />
      </svg>
      <div className="absolute top-24 right-6 sm:right-10 w-12 h-12 border-t border-r border-green/[0.18] pointer-events-none z-[2]" aria-hidden />
      <div className="absolute bottom-16 left-5 sm:left-8 w-10 h-10 border-b border-l border-green/[0.14] pointer-events-none z-[2]" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-canvas to-transparent pointer-events-none z-[3]" aria-hidden />

      {/* ── Content ───────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex items-center px-4 sm:px-8 lg:px-16 xl:px-20 pt-24 sm:pt-28 lg:pt-32 pb-8 w-full max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-8 lg:gap-14 xl:gap-20 items-center w-full">

          {/* ── Left: copy ──────────────────────────────────────── */}
          <div>
            {/* Available badge */}
            <div
              style={up(0.1)}
              className="inline-flex items-center gap-2.5 mb-8 sm:mb-10 px-4 py-2 border border-green/25 bg-green/[0.05]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green animate-dot-blink shrink-0" />
              <span className="text-green text-[11px] tracking-[0.22em] uppercase font-bold">
                Available for New Projects
              </span>
            </div>

            {/* Mobile photo */}
            <div style={fx(0.14)} className="lg:hidden mb-8 flex justify-start">
              <div
                className="relative w-[130px] h-[130px] sm:w-[150px] sm:h-[150px] border border-cream/[0.1] shrink-0"
                style={{ borderRadius: "50%", overflow: "hidden" }}
              >
                <Image
                  src="/images/profile.jpg"
                  alt="Rifath Mashrur – Digital Marketer & Strategist"
                  fill
                  className="object-cover object-top"
                  sizes="160px"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-canvas/60 to-transparent" />
                <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-canvas/90 border border-green/25">
                  <span className="w-1 h-1 rounded-full bg-green" style={{ boxShadow: "0 0 5px #7CFC00" }} />
                  <span className="text-green text-[9px] font-bold tracking-wider uppercase">Open</span>
                </div>
              </div>
            </div>

            <p style={up(0.2)} className="text-cream/35 text-xs font-semibold tracking-[0.28em] uppercase mb-2">
              Hi, I&apos;m
            </p>

            <h1 style={up(0.28)} className="text-[clamp(2.6rem,7vw,5.5rem)] font-extrabold tracking-[-0.035em] leading-[0.9] text-cream mb-2">
              Rifath Mashrur
            </h1>

            <div style={up(0.36)}>
              <h2
                className="text-[clamp(1.8rem,5vw,4rem)] font-extrabold tracking-[-0.03em] leading-[0.92] text-transparent bg-clip-text mb-1"
                style={{
                  backgroundImage: "linear-gradient(118deg, #7CFC00 0%, #5cd600 45%, rgba(124,252,0,0.38) 100%)",
                }}
              >
                Digital Marketer
              </h2>
            </div>

            <h2 style={up(0.43)} className="text-[clamp(1.8rem,5vw,4rem)] font-extrabold tracking-[-0.03em] leading-[0.92] text-cream/45 mb-8 sm:mb-10">
              &amp; Strategist
            </h2>

            <p style={up(0.5)} className="text-cream/45 text-base sm:text-lg leading-relaxed max-w-[400px] mb-10 sm:mb-12">
              I turn data into decisions and attention into revenue —
              building campaigns that compound over time.
            </p>

            <div style={up(0.57)} className="flex flex-wrap items-center gap-5">
              <Link
                href="/#work"
                className="group inline-flex items-center gap-3 px-6 sm:px-7 py-3.5 bg-green text-canvas font-bold text-sm hover:bg-green/80 transition-colors"
              >
                View My Work
                <span className="text-canvas/60 group-hover:translate-x-1 transition-transform inline-block">→</span>
              </Link>
              <Link
                href="/#contact"
                className="group inline-flex items-center gap-3 text-sm text-cream/45 hover:text-cream transition-colors"
              >
                <span className="w-8 h-px bg-cream/20 group-hover:w-12 group-hover:bg-cream/50 transition-all" />
                Let&apos;s Talk
              </Link>
            </div>
          </div>

          {/* ── Right: photo (desktop only) ─────────────────────── */}
          <div style={fx(0.28, 40)} className="hidden lg:block relative">
            {/* Float via CSS animation — no Framer Motion, no hydration issue */}
            <div className="relative animate-hero-float">
              <div
                className="relative w-[320px] h-[320px] xl:w-[380px] xl:h-[380px] bg-cream/[0.03] border-2 border-cream/[0.12]"
                style={{ borderRadius: "50%", overflow: "hidden" }}
              >
                <Image
                  src="/images/profile.jpg"
                  alt="Rifath Mashrur – Digital Marketer & Strategist"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1280px) 380px, 420px"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-canvas/65 to-transparent" />
              </div>

              {/* Open-to-work chip */}
              <div
                style={fx(1.1)}
                className="absolute -top-3 left-5 flex items-center gap-2 px-3 py-1.5 bg-canvas border border-green/30"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-green shrink-0"
                  style={{ boxShadow: "0 0 8px #7CFC00" }}
                />
                <span className="text-green text-[11px] font-bold tracking-widest uppercase">
                  Open to Work
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats row ─────────────────────────────────────────── */}
      <div
        style={up(0.72)}
        className="relative z-10 px-4 sm:px-8 lg:px-16 xl:px-20 pb-12 sm:pb-16 w-full max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 border border-cream/[0.07] divide-x divide-y sm:divide-y-0 divide-cream/[0.07]">
          {stats.map((s) => (
            <div key={s.label} className="px-4 sm:px-6 py-4 sm:py-5 bg-cream/[0.02]">
              <p className="text-green font-extrabold text-xl sm:text-2xl tabular-nums">{s.value}</p>
              <p className="text-cream/[0.38] text-[10px] sm:text-[11px] mt-1.5 tracking-[0.18em] uppercase">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Scroll indicator ──────────────────────────────────── */}
      <div className="hidden sm:flex absolute bottom-8 left-8 lg:left-16 xl:left-20 z-10 items-center gap-3">
        <div className="relative w-px h-12 bg-cream/[0.08] overflow-hidden">
          <div className="absolute inset-x-0 bg-green animate-scroll-drip" style={{ height: "35%" }} />
        </div>
        <span className="text-cream/[0.18] text-[10px] tracking-[0.28em] uppercase">Scroll</span>
      </div>
    </section>
  );
}
