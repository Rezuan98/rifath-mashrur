"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DataNetwork } from "./data-network";

const E = "cubic-bezier(0.25,0.1,0,1)";

/* ── Type scale ────────────────────────────────────────────────────
   One fluid scale for the whole hero. Every step is clamp(min, vw, max)
   so sizes ramp smoothly from a 320px phone to a 1536px+ display with no
   breakpoint jumps and no horizontal overflow. Ratio ≈ 1.5 between the
   name and the role headline, which keeps the hierarchy readable:
   eyebrow → name → role headline (the dominant element) → body.        */
const TYPE = {
  eyebrow: "clamp(0.625rem, 1.5vw, 0.75rem)",
  name:    "clamp(1.5rem, 5.2vw, 2.75rem)",
  role:    "clamp(2rem, 7.6vw, 4.25rem)",
  body:    "clamp(0.9375rem, 1.6vw, 1.125rem)",
  stat:    "clamp(1.25rem, 3vw, 1.75rem)",
  statTag: "clamp(0.5625rem, 1.2vw, 0.6875rem)",
} as const;

type StatItem = { value: string; label: string };

export function HeroSection({
  name = "Rifat Mashrur",
  profileImage = "/images/profile.jpg",
  stats = [],
}: {
  name?: string;
  profileImage?: string;
  stats?: StatItem[];
}) {
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
    <section className="relative min-h-[100svh] flex flex-col bg-canvas overflow-hidden">

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
      <div className="relative z-10 flex-1 flex items-center px-5 sm:px-8 lg:px-16 xl:px-20 pt-24 sm:pt-28 lg:pt-32 pb-10 w-full max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-8 lg:gap-14 xl:gap-20 items-center w-full">

          {/* ── Left: copy ──────────────────────────────────────── */}
          <div className="min-w-0">
            {/* Available badge */}
            <div
              style={up(0.1)}
              className="inline-flex items-center gap-2.5 mb-7 sm:mb-9 px-3.5 sm:px-4 py-2 border border-green/30 bg-green/[0.06]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green animate-dot-blink shrink-0" />
              <span
                className="text-green text-[10px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.22em] uppercase font-bold"
              >
                Available for New Projects
              </span>
            </div>

            {/* Mobile photo */}
            <div style={fx(0.14)} className="lg:hidden mb-7 sm:mb-9 flex justify-start">
              <div
                className="relative w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] border border-cream/[0.12] shrink-0"
                style={{ borderRadius: "50%", overflow: "hidden" }}
              >
                <Image
                  src={profileImage}
                  alt={`${name} – Digital Marketer & Strategist`}
                  fill
                  className="object-cover object-top"
                  sizes="160px"
                  priority
                  unoptimized
                />
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-canvas/60 to-transparent" />
                <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-canvas/90 border border-green/30">
                  <span className="w-1 h-1 rounded-full bg-green" style={{ boxShadow: "0 0 5px #7CFC00" }} />
                  <span className="text-green text-[9px] font-bold tracking-wider uppercase">Open</span>
                </div>
              </div>
            </div>

            {/* Eyebrow + name read as ONE unit: tight 4px gap between them,
                then a deliberate gap before the role headline below. */}
            <p
              style={{ ...up(0.2), fontSize: TYPE.eyebrow }}
              className="text-cream/55 font-semibold tracking-[0.3em] uppercase mb-1"
            >
              Hi, I&apos;m
            </p>

            <h1
              style={{ ...up(0.28), fontSize: TYPE.name }}
              className="font-bold tracking-[-0.02em] leading-[1.08] text-cream mb-4 sm:mb-5 text-balance [overflow-wrap:anywhere]"
            >
              {name}
            </h1>

            {/* Role headline — two lines, one unit */}
            <div style={up(0.36)}>
              <h2
                className="font-extrabold tracking-[-0.035em] leading-[0.95] text-transparent bg-clip-text"
                style={{
                  fontSize: TYPE.role,
                  backgroundImage: "linear-gradient(118deg, #7CFC00 0%, #5cd600 45%, rgba(124,252,0,0.55) 100%)",
                }}
              >
                Digital Marketer
              </h2>
            </div>

            <h2
              style={{ ...up(0.43), fontSize: TYPE.role }}
              className="font-extrabold tracking-[-0.035em] leading-[0.95] text-cream/60"
            >
              &amp; Strategist
            </h2>

            <p
              style={{ ...up(0.5), fontSize: TYPE.body }}
              className="text-cream/65 leading-relaxed max-w-[46ch] mt-7 sm:mt-8 text-pretty"
            >
              I turn data into decisions and attention into revenue —
              building campaigns that compound over time.
            </p>

            <div style={up(0.57)} className="flex flex-wrap items-center gap-x-6 gap-y-4 mt-9 sm:mt-11">
              <Link
                href="/#work"
                className="group inline-flex items-center gap-3 px-6 sm:px-7 py-3.5 bg-green text-canvas font-bold text-sm sm:text-base hover:bg-green/80 transition-colors"
              >
                View My Work
                <span className="text-canvas/70 group-hover:translate-x-1 transition-transform inline-block">→</span>
              </Link>
              <Link
                href="/#contact"
                className="group inline-flex items-center gap-3 text-sm sm:text-base text-cream/65 hover:text-cream transition-colors"
              >
                <span className="w-8 h-px bg-cream/30 group-hover:w-12 group-hover:bg-cream/60 transition-all" />
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
                  src={profileImage}
                  alt={`${name} – Digital Marketer & Strategist`}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1280px) 380px, 420px"
                  priority
                  unoptimized
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

      {/* ── Stats row ─────────────────────────────────────────────
          Borders live on the cells (bottom + right) with the outer top/left
          on the wrapper, so the grid stays complete at any column count and
          any number of stats — unlike divide-x, which mis-draws on wrap. */}
      {stats.length > 0 && (
        <div
          style={up(0.72)}
          className="relative z-10 px-5 sm:px-8 lg:px-16 xl:px-20 pb-12 sm:pb-16 w-full max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-l border-cream/[0.12]">
            {stats.map((s) => (
              <div
                key={`${s.value}-${s.label}`}
                className="border-b border-r border-cream/[0.12] bg-cream/[0.03] px-4 py-4 sm:px-5 sm:py-5"
              >
                <p
                  className="text-green font-extrabold tabular-nums leading-none"
                  style={{ fontSize: TYPE.stat }}
                >
                  {s.value}
                </p>
                <p
                  className="text-cream/60 mt-2 tracking-[0.16em] uppercase leading-snug"
                  style={{ fontSize: TYPE.statTag }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Scroll indicator ──────────────────────────────────── */}
      <div className="hidden sm:flex absolute bottom-5 left-8 lg:left-16 xl:left-20 z-10 items-center gap-3">
        <div className="relative w-px h-9 bg-cream/[0.12] overflow-hidden">
          <div className="absolute inset-x-0 bg-green animate-scroll-drip" style={{ height: "35%" }} />
        </div>
        <span className="text-cream/40 text-[10px] tracking-[0.28em] uppercase">Scroll</span>
      </div>
    </section>
  );
}
