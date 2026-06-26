"use client";

import { useEffect, useRef } from "react";

interface BlurSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const PRESETS = [
  { label: "Light", value: 10 },
  { label: "Medium", value: 25 },
  { label: "Heavy", value: 51 },
];

function BlurPreview({ intensity }: { intensity: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 80;
    canvas.width = size;
    canvas.height = size;

    // Draw eggplant emoji large on a light background
    ctx.fillStyle = "#e7e5e4";
    ctx.fillRect(0, 0, size, size);
    ctx.font = "48px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🍆", size / 2, size / 2);

    // Blur it onto a second canvas
    const blurCanvas = document.createElement("canvas");
    blurCanvas.width = size;
    blurCanvas.height = size;
    const blurCtx = blurCanvas.getContext("2d");
    if (!blurCtx) return;

    blurCtx.filter = `blur(${Math.round(intensity / 4)}px)`;
    blurCtx.drawImage(canvas, 0, 0);

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = "#e7e5e4";
    ctx.fillRect(0, 0, size, size);
    ctx.drawImage(blurCanvas, 0, 0);
  }, [intensity]);

  return (
    <div className="flex flex-col items-center gap-1">
      <canvas
        ref={canvasRef}
        className="rounded-lg border border-stone-200"
        style={{ width: 80, height: 80 }}
      />
      <span className="text-xs text-stone-400">Preview</span>
    </div>
  );
}

export function BlurSlider({ value, onChange, disabled }: BlurSliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
          Blur intensity
        </p>
        <span className="text-xs text-stone-400 font-mono">{value}px</span>
      </div>

      <div className="flex items-center gap-4">
        <BlurPreview intensity={value} />

        <div className="flex-1 space-y-3">
          <div className="flex gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => onChange(preset.value)}
                disabled={disabled}
                className={[
                  "flex-1 rounded-lg border px-2 py-2 text-center transition-all text-xs font-semibold",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400",
                  disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                  value === preset.value
                    ? "border-stone-800 bg-stone-900 text-white"
                    : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50",
                ].join(" ")}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <input
            type="range"
            min={3}
            max={99}
            step={2}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            disabled={disabled}
            className="w-full accent-stone-900 disabled:opacity-50"
          />
          <div className="flex justify-between text-xs text-stone-300">
            <span>Subtle</span>
            <span>Strong</span>
          </div>
        </div>
      </div>
    </div>
  );
}