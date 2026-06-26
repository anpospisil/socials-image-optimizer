"use client";

import { useEffect, useRef } from "react";
import type { DetectionResult } from "@/types";

interface DetectionPreviewProps {
  imageUrl: string;
  detections: DetectionResult[];
  imageWidth: number;
  imageHeight: number;
}

// Clean up label text for display — "MALE_GENITALIA_EXPOSED" → "Genitalia"
function formatLabel(label: string): string {
  const map: Record<string, string> = {
    MALE_GENITALIA_EXPOSED: "Naughty bits",
    MALE_GENITALIA_COVERED: "Naughty bits (covered)",
    ANUS_EXPOSED: "Naughty bits",
    ANUS_COVERED: "Naughty bits (covered)",
    BUTTOCKS_EXPOSED: "Butt",
  };
  return map[label] ?? label;
}

export function DetectionPreview({
  imageUrl,
  detections,
  imageWidth,
  imageHeight,
}: DetectionPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      // Scale canvas to fit container while preserving aspect ratio
      const maxWidth = canvas.parentElement?.clientWidth ?? 600;
      const scale = Math.min(maxWidth / imageWidth, 1);
      canvas.width = imageWidth * scale;
      canvas.height = imageHeight * scale;

      // Draw image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Draw detection regions
      detections.forEach(({ box, label }) => {
        const [x1, y1, x2, y2] = box.map((v) => v * scale);
        const w = x2 - x1;
        const h = y2 - y1;

        // Semi-transparent red fill
        ctx.fillStyle = "rgba(220, 38, 38, 0.35)";
        ctx.fillRect(x1, y1, w, h);

        // Solid red border
        ctx.strokeStyle = "rgba(220, 38, 38, 0.9)";
        ctx.lineWidth = 2;
        ctx.strokeRect(x1, y1, w, h);

        // Label pill
        const text = formatLabel(label);
        ctx.font = "bold 11px system-ui, sans-serif";
        const textWidth = ctx.measureText(text).width;
        const pillH = 18;
        const pillW = textWidth + 10;
        const pillX = x1;
        const pillY = y1 - pillH - 2;

        // Pill background
        ctx.fillStyle = "rgba(220, 38, 38, 0.9)";
        ctx.beginPath();
        ctx.roundRect(pillX, Math.max(0, pillY), pillW, pillH, 4);
        ctx.fill();

        // Pill text
        ctx.fillStyle = "#ffffff";
        ctx.fillText(text, pillX + 5, Math.max(pillH - 4, pillY + pillH - 4));
      });
    };
  }, [imageUrl, detections, imageWidth, imageHeight]);

  return (
    <div className="space-y-2">
      <div className="relative w-full overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
        <canvas ref={canvasRef} className="block w-full" />
      </div>
      <p className="text-xs text-stone-400 text-center">
        {detections.length} region{detections.length !== 1 ? "s" : ""} detected — these will be covered when you generate
      </p>
    </div>
  );
}
