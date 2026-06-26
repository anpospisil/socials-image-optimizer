"use client";

interface SensitivitySliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const PRESETS = [
  { label: "Subtle", value: 0.1, description: "Catches most regions" },
  { label: "Balanced", value: 0.35, description: "Recommended" },
  { label: "Strict", value: 0.6, description: "High confidence only" },
];

export function SensitivitySlider({ value, onChange, disabled }: SensitivitySliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
          Detection sensitivity
        </p>
        <span className="text-xs text-stone-400 font-mono">
          {Math.round((1 - value) * 100)}%
        </span>
      </div>

      {/* Quick presets */}
      <div className="flex gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => onChange(preset.value)}
            disabled={disabled}
            className={[
              "flex-1 rounded-lg border px-2 py-2 text-center transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400",
              disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
              value === preset.value
                ? "border-stone-800 bg-stone-900 text-white"
                : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50",
            ].join(" ")}
          >
            <p className="text-xs font-semibold">{preset.label}</p>
            <p className={`text-xs mt-0.5 ${value === preset.value ? "text-stone-400" : "text-stone-400"}`}>
              {preset.description}
            </p>
          </button>
        ))}
      </div>

      {/* Fine-tune slider */}
      <input
        type="range"
        min={0.01}
        max={0.9}
        step={0.01}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
        className="w-full accent-stone-900 disabled:opacity-50"
      />
      <div className="flex justify-between text-xs text-stone-300">
        <span>More detections</span>
        <span>Fewer detections</span>
      </div>
    </div>
  );
}
