"use client";

import type { ModerationMode } from "@/types";

interface ModerationToggleProps {
  value: ModerationMode;
  onChange: (mode: ModerationMode) => void;
  disabled?: boolean;
}

const OPTIONS: { value: ModerationMode; label: string; description: string }[] = [
  { value: "off", label: "Off", description: "No detection" },
  { value: "blur", label: "Blur", description: "Gaussian blur" },
  { value: "sticker", label: "Sticker", description: "Custom overlay" },
];

export function ModerationToggle({ value, onChange, disabled }: ModerationToggleProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
        Content moderation
      </p>
      <div className="flex gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            disabled={disabled}
            className={[
              "flex-1 rounded-lg border px-3 py-2.5 text-center transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400",
              disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
              value === opt.value
                ? "border-stone-800 bg-stone-900 text-white"
                : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50",
            ].join(" ")}
          >
            <p className="text-xs font-semibold">{opt.label}</p>
            <p className={`text-xs mt-0.5 ${value === opt.value ? "text-stone-400" : "text-stone-400"}`}>
              {opt.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
