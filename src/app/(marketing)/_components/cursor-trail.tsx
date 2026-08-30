"use client";

import { useEffect, useRef } from "react";

/* Thin dashed-line doodle trail + dotted ring cursor.
   Only activates on devices with a fine pointer (mouse). */
const FALLBACK_RGB = "124,252,0"; // used only if the CSS var is unreadable

/** Read the live brand accent (set per-site in admin Settings) as "r,g,b".
    Canvas has no access to CSS vars, so resolve it once from the element. */
function accentRgb(el: Element): string {
  const raw = getComputedStyle(el).getPropertyValue("--color-green").trim();
  if (!raw) return FALLBACK_RGB;
  const hex = raw.replace("#", "");
  if (/^[0-9a-f]{3}$/i.test(hex)) {
    const [r, g, b] = hex.split("").map((c) => parseInt(c + c, 16));
    return `${r},${g},${b}`;
  }
  if (/^[0-9a-f]{6}$/i.test(hex)) {
    return `${parseInt(hex.slice(0, 2), 16)},${parseInt(hex.slice(2, 4), 16)},${parseInt(hex.slice(4, 6), 16)}`;
  }
  const m = raw.match(/rgba?\(([^)]+)\)/i);
  if (m) return m[1].split(",").slice(0, 3).map((n) => n.trim()).join(",");
  return FALLBACK_RGB;
}

export function CursorTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    const G = accentRgb(cvs);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = window.innerWidth;
    let H = window.innerHeight;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      cvs.width  = W * dpr;
      cvs.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    /* Trail points ─ time-stamped for age-based fade */
    type Pt = { x: number; y: number; t: number };
    const trail: Pt[] = [];
    const MAX_AGE  = 650;   // ms before a point disappears
    const MIN_DIST = 7;     // px between successive trail points

    let cx = -300, cy = -300;
    let lx = cx,   ly = cy;

    const onMove = (e: MouseEvent) => {
      cx = e.clientX;
      cy = e.clientY;
      if (Math.hypot(cx - lx, cy - ly) >= MIN_DIST) {
        trail.push({ x: cx, y: cy, t: Date.now() });
        lx = cx; ly = cy;
        if (trail.length > 90) trail.splice(0, trail.length - 90);
      }
    };
    window.addEventListener("mousemove", onMove);

    let raf: number;

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      const now = Date.now();

      /* Remove expired points */
      while (trail.length && now - trail[0].t > MAX_AGE) trail.shift();

      /* Draw dashed trail ─ each segment fades with age */
      if (trail.length > 1) {
        ctx.lineCap = "round";
        for (let i = 1; i < trail.length; i++) {
          const age   = (now - trail[i].t) / MAX_AGE;
          const alpha = Math.max(0, 1 - age) * 0.6;
          ctx.beginPath();
          ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
          ctx.lineTo(trail[i].x,     trail[i].y);
          ctx.strokeStyle = `rgba(${G},${alpha})`;
          ctx.lineWidth   = 1;
          ctx.setLineDash([2, 5]);
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }

      /* Dotted ring cursor */
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${G},0.72)`;
      ctx.lineWidth   = 1;
      ctx.setLineDash([2.5, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      /* Center dot */
      ctx.beginPath();
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${G},0.92)`;
      ctx.fill();

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 z-[9999] pointer-events-none"
      aria-hidden
    />
  );
}
