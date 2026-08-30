"use client";

import { useEffect, useRef } from "react";

/* Data-flow network — nodes, dashed connections, travelling packets,
   and a periodically highlighted "decision path" (brightest chain). */

const FALLBACK_RGB = "124,252,0"; // used only if the CSS var is unreadable

interface NodeData {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  ph: number; ps: number; // pulse phase / speed
}
interface Pkt {
  a: number; b: number;
  t: number; s: number; // progress (0–1) / speed
}

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

export function DataNetwork({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    const G = accentRgb(cvs);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;

    const resize = () => {
      const rect = cvs.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      cvs.width  = W * dpr;
      cvs.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cvs);

    /* Scene helpers — sized to canvas */
    const cfg = () => ({
      N: W < 640 ? 28 : W < 1024 ? 42 : 58,
      D: W < 640 ? 95 : W < 1024 ? 120 : 145,   // max connection distance
      P: W < 640 ? 5  : W < 1024 ? 9  : 14,     // packet count
    });

    let { N, D, P } = cfg();

    const mkNode = (): NodeData => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r:  1.5 + Math.random() * 1.5,
      ph: Math.random() * Math.PI * 2,
      ps: 0.012 + Math.random() * 0.015,
    });
    let nodes: NodeData[] = Array.from({ length: N }, mkNode);

    const mkPkt = (): Pkt => {
      const a = Math.floor(Math.random() * nodes.length);
      let   b = a;
      while (b === a) b = Math.floor(Math.random() * nodes.length);
      return { a, b, t: Math.random(), s: 0.003 + Math.random() * 0.005 };
    };
    let pkts: Pkt[] = Array.from({ length: P }, mkPkt);

    /* Decision path — a chain of 4-6 connected nodes that lights up */
    let hl   = new Set<number>();
    let hlTk = 0;
    const HL_EVERY = 190; // frames between path changes

    const refreshHl = () => {
      const start = Math.floor(Math.random() * nodes.length);
      const path  = new Set([start]);
      let   cur   = start;
      for (let step = 0; step < 5; step++) {
        let best = -1, bestD = Infinity;
        for (let i = 0; i < nodes.length; i++) {
          if (path.has(i)) continue;
          const d = Math.hypot(nodes[cur].x - nodes[i].x, nodes[cur].y - nodes[i].y);
          if (d < D && d < bestD) { bestD = d; best = i; }
        }
        if (best < 0) break;
        path.add(best);
        cur = best;
      }
      hl = path;
    };
    refreshHl();

    let raf: number;

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      hlTk++;
      if (hlTk >= HL_EVERY) { hlTk = 0; refreshHl(); }

      /* Resize/reinit if config changed */
      const next = cfg();
      if (next.N !== N) {
        N = next.N; D = next.D; P = next.P;
        nodes = Array.from({ length: N }, mkNode);
        pkts  = Array.from({ length: P }, mkPkt);
        refreshHl();
      }

      /* Move nodes (wrap around edges) */
      nodes.forEach(n => {
        n.x = ((n.x + n.vx) + W) % W;
        n.y = ((n.y + n.vy) + H) % H;
        n.ph += n.ps;
      });

      /* Connections */
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d > D) continue;
          const isHl  = hl.has(i) && hl.has(j);
          const frac  = 1 - d / D;
          const alpha = isHl ? frac * 0.55 : frac * 0.07;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(${G},${alpha})`;
          ctx.lineWidth   = isHl ? 0.9 : 0.4;
          if (!isHl) ctx.setLineDash([3, 7]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      /* Nodes */
      nodes.forEach((n, i) => {
        const isHl  = hl.has(i);
        const pulse = Math.sin(n.ph) * 0.5 + 0.5;
        const alpha = isHl ? 0.9 : 0.14 + pulse * 0.18;
        const r     = n.r + (isHl ? pulse * 2.5 : 0);

        if (isHl) {
          const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 5);
          grd.addColorStop(0, `rgba(${G},0.2)`);
          grd.addColorStop(1, `rgba(${G},0)`);
          ctx.beginPath();
          ctx.arc(n.x, n.y, r * 5, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${G},${alpha})`;
        ctx.fill();
      });

      /* Travelling data packets */
      pkts.forEach(p => {
        p.t += p.s;
        if (p.t >= 1) {
          p.a = p.b;
          const nb: number[] = [];
          for (let i = 0; i < nodes.length; i++) {
            if (i !== p.a && Math.hypot(nodes[p.a].x - nodes[i].x, nodes[p.a].y - nodes[i].y) < D) nb.push(i);
          }
          p.b = nb.length ? nb[Math.floor(Math.random() * nb.length)] : Math.floor(Math.random() * nodes.length);
          p.t = 0;
        }

        const na = nodes[p.a], nb = nodes[p.b];
        if (Math.hypot(na.x - nb.x, na.y - nb.y) > D) return;

        const px = na.x + (nb.x - na.x) * p.t;
        const py = na.y + (nb.y - na.y) * p.t;

        /* Glow halo */
        const grd = ctx.createRadialGradient(px, py, 0, px, py, 10);
        grd.addColorStop(0, `rgba(${G},0.45)`);
        grd.addColorStop(1, `rgba(${G},0)`);
        ctx.beginPath();
        ctx.arc(px, py, 10, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        /* Packet dot */
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${G},1)`;
        ctx.fill();
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={ref}
      className={className}
      aria-hidden
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
