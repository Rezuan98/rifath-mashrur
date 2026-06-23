"use client";

import { useState } from "react";

/** Color picker + hex text input kept in sync. The text input carries `name`
 *  so the hex value is what gets submitted with the form. */
export function ColorField({
  name,
  label,
  defaultValue,
  hint,
}: {
  name: string;
  label: string;
  defaultValue: string;
  hint?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const valid = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);

  return (
    <div>
      <label className="block text-cream/50 text-xs mb-1.5 tracking-widest uppercase">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          aria-label={`${label} color picker`}
          value={valid ? value : "#000000"}
          onChange={(e) => setValue(e.target.value)}
          className="w-11 h-11 shrink-0 rounded-lg bg-transparent border border-cream/[0.1] cursor-pointer p-1"
        />
        <input
          type="text"
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          spellCheck={false}
          className="w-36 bg-cream/[0.04] border border-cream/[0.1] text-cream text-sm font-mono px-3 py-2.5 outline-none focus:border-green/50 transition-colors uppercase"
        />
        {!valid && <span className="text-red-400 text-xs">Invalid hex</span>}
      </div>
      {hint && <p className="text-cream/30 text-xs mt-1.5">{hint}</p>}
    </div>
  );
}
