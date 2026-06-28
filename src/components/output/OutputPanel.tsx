"use client";

import { useAnalytics } from "@/hooks/useAnalytics";
import type { ProcessMetadata } from "@/types";

interface OutputPanelProps {
  metadata: ProcessMetadata;
  downloadUrl: string;
  filename: string;
  onReset: () => void;
}

export function OutputPanel({ metadata, downloadUrl, filename, onReset }: OutputPanelProps) {
  const { trackDownloadClicked } = useAnalytics();
 
  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-stone-900">
            {metadata.outputs.length} image{metadata.outputs.length !== 1 ? "s" : ""} ready
          </p>
          {metadata.detection_count > 0 && (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 border border-amber-200">
              {metadata.detection_count} region{metadata.detection_count !== 1 ? "s" : ""} covered
            </span>
          )}
        </div>

        {/* Per-platform list */}
        <ul className="divide-y divide-stone-100">
          {metadata.outputs.map((output) => (
            <li key={output.platform_key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-stone-700">{output.platform_label}</p>
                <p className="text-xs text-stone-400">{output.width}×{output.height}px</p>
              </div>
              <span className="text-xs text-stone-400 font-mono">{output.filename}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Download */}
      <a
        href={downloadUrl}
        download={filename}
        onClick={() => trackDownloadClicked(metadata.outputs.length)}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-700"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Download all ({metadata.outputs.length} files)
      </a>

      {/* Start over */}
      <button
        onClick={onReset}
        className="w-full text-center text-sm text-stone-400 underline underline-offset-2 hover:text-stone-600 transition-colors"
      >
        Process another image
      </button>
    </div>
  );
}
