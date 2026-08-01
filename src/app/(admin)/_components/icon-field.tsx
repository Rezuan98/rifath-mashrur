"use client";

import { useState } from "react";

/** Glyphs that match the site's geometric style. First one is the default. */
export const ICON_CHOICES = ["◈", "↑", "✦", "◎", "◆", "▲", "✕", "⚡", "☰", "◐", "→", "★"] as const;

/**
 * Icon picker for a service card. Clicking a glyph fills the (editable) input,
 * so any single character or emoji can still be typed by hand.
 */
export function IconField({ defaultValue }: { defaultValue?: string }) {
  const [icon, setIcon] = useState(defaultValue || ICON_CHOICES[0]);

  return (
    <div>
      <label className="block text-cream/50 text-xs mb-1.5 tracking-widest uppercase">Icon</label>
      <div className="flex items-center gap-3">
        <span className="w-12 h-12 shrink-0 grid place-items-center border border-cream/[0.1] bg-cream/[0.04] text-green text-xl">
          {icon}
        </span>
        <input
          name="icon"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          maxLength={4}
          className="w-24 bg-cream/[0.04] border border-cream/[0.1] text-cream text-center text-sm px-3 py-2.5 outline-none focus:border-green/50 transition-colors"
        />
        <div className="flex flex-wrap gap-1.5">
          {ICON_CHOICES.map((choice) => (
            <button
              key={choice}
              type="button"
              onClick={() => setIcon(choice)}
              aria-label={`Use ${choice}`}
              aria-pressed={icon === choice}
              className={`w-8 h-8 grid place-items-center border text-sm transition-colors cursor-pointer ${
                icon === choice
                  ? "border-green/60 text-green bg-green/10"
                  : "border-cream/[0.1] text-cream/50 hover:text-cream hover:border-cream/30"
              }`}
            >
              {choice}
            </button>
          ))}
        </div>
      </div>
      <p className="text-cream/30 text-xs mt-1.5">
        Shown above the service title. Pick one, or type any character or emoji.
      </p>
    </div>
  );
}
