"use client";

import type { PlatformKey, PresetsMap } from "@/types";

interface PlatformSelectorProps {
  presets: PresetsMap;
  selected: PlatformKey[];
  onToggle: (key: PlatformKey) => void;
  disabled?: boolean;
}

export function PlatformSelector({ presets, selected, onToggle, disabled }: PlatformSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
        Platforms
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {(Object.entries(presets) as [PlatformKey, PresetsMap[PlatformKey]][]).map(
          ([key, preset]) => {
            const isSelected = selected.includes(key);
            return (
              <button
                key={key}
                onClick={() => onToggle(key)}
                disabled={disabled}
                className={[
                  "rounded-lg border px-3 py-2.5 text-left transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400",
                  disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                  isSelected
                    ? "border-stone-800 bg-stone-900 text-white"
                    : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50",
                ].join(" ")}
              >
                <p className="text-xs font-semibold leading-tight">{preset.label}</p>
                <p className={`mt-0.5 text-xs ${isSelected ? "text-stone-400" : "text-stone-400"}`}>
                  {preset.width}×{preset.height}
                </p>
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}
