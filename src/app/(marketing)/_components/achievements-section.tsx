"use client";

import { useState } from "react";
import Image from "next/image";
import type { Achievement } from "@/lib/types";

interface Props {
  awards: Achievement[];
  dashboards: Achievement[];
}

export function AchievementsSection({ awards, dashboards }: Props) {
  const [tab, setTab] = useState<"awards" | "dashboards">("awards");
  const items = tab === "awards" ? awards : dashboards;

  const hasAny = awards.length > 0 || dashboards.length > 0;

  return (
    <section id="achievements" className="px-4 sm:px-8 py-16 sm:py-24 border-t border-cream/[0.07]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-cream tracking-tight">
              Achievements
            </h2>
            <p className="text-cream/40 text-sm mt-2">
              Certifications, recognitions &amp; proof of performance
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 border border-cream/[0.08] bg-cream/[0.03] self-start sm:self-auto">
            <button
              onClick={() => setTab("awards")}
              className={`px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                tab === "awards"
                  ? "bg-green text-canvas"
                  : "text-cream/40 hover:text-cream"
              }`}
            >
              Awards &amp; Recognition
            </button>
            <button
              onClick={() => setTab("dashboards")}
              className={`px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                tab === "dashboards"
                  ? "bg-green text-canvas"
                  : "text-cream/40 hover:text-cream"
              }`}
            >
              Dashboard Proof
            </button>
          </div>
        </div>

        {!hasAny ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-xl border border-cream/[0.07] bg-cream/[0.02] animate-pulse"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-cream/25 text-sm">
            No {tab === "awards" ? "awards" : "dashboards"} added yet.
          </p>
        ) : tab === "awards" ? (
          /* Awards grid — portrait cards with title overlay */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((a) => (
              <div
                key={a.id}
                className="group relative rounded-2xl overflow-hidden border border-cream/[0.07] bg-cream/[0.03]"
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={a.imageUrl}
                    alt={a.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-canvas/90 via-canvas/20 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-cream font-semibold text-sm leading-snug">{a.title}</p>
                  {a.description && (
                    <p className="text-cream/50 text-xs mt-1 leading-relaxed">{a.description}</p>
                  )}
                </div>
                {/* Green corner accent */}
                <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-green/60" />
              </div>
            ))}
          </div>
        ) : (
          /* Dashboards grid — wider cards, screenshot style */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {items.map((a) => (
              <div
                key={a.id}
                className="group rounded-2xl border border-cream/[0.07] bg-cream/[0.03] overflow-hidden"
              >
                <div className="relative aspect-video w-full border-b border-cream/[0.07]">
                  <Image
                    src={a.imageUrl}
                    alt={a.title}
                    fill
                    className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  {/* browser chrome bar */}
                  <div className="absolute top-0 left-0 right-0 h-7 bg-canvas/80 backdrop-blur-sm border-b border-cream/[0.07] flex items-center px-3 gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400/60" />
                    <span className="w-2 h-2 rounded-full bg-yellow-400/60" />
                    <span className="w-2 h-2 rounded-full bg-green/60" />
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-cream font-semibold text-sm">{a.title}</p>
                      {a.description && (
                        <p className="text-cream/45 text-xs mt-1 leading-relaxed">{a.description}</p>
                      )}
                    </div>
                    <span className="shrink-0 text-[10px] font-bold tracking-widest uppercase text-green/70 border border-green/20 px-2 py-1">
                      Proof
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
