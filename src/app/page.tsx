"use client";

import { useEffect, useState } from "react";
import { fetchPresets } from "@/lib/api";
import { useProcessor } from "@/hooks/useProcessor";
import { DropZone } from "@/components/upload/DropZone";
import { PlatformSelector } from "@/components/upload/PlatformSelector";
import { ModerationToggle } from "@/components/upload/ModerationToggle";
import { OutputPanel } from "@/components/output/OutputPanel";
import type { PresetsMap } from "@/types";

export default function Home() {
  const [presets, setPresets] = useState<PresetsMap | null>(null);
  const [presetsError, setPresetsError] = useState(false);

  const {
    file,
    previewUrl,
    selectedPlatforms,
    moderationMode,
    watermarkText,
    status,
    error,
    result,
    downloadUrl,
    setFile,
    togglePlatform,
    setModerationMode,
    setWatermarkText,
    process,
    reset,
  } = useProcessor();

  useEffect(() => {
    fetchPresets()
      .then(setPresets)
      .catch(() => setPresetsError(true));
  }, []);

  const isProcessing = status === "processing";
  const isDone = status === "done";

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <span className="text-sm font-bold tracking-tight text-stone-900">
            Socials Optimizer
          </span>
          <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-500">
            Beta
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10 space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Resize for every platform,<br />in one go.
          </h1>
          <p className="text-sm text-stone-500">
            Upload once. Get perfectly sized images for Bluesky, Twitter, Pixiv, and Fanbox — with optional content moderation built in.
          </p>
        </div>

        {presetsError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Can't reach the processing server. Make sure the API is running at{" "}
            <code className="font-mono text-xs">localhost:8000</code>.
          </div>
        )}

        {!isDone ? (
          <div className="space-y-6">
            <DropZone onFile={setFile} previewUrl={previewUrl} disabled={isProcessing} />

            {file && presets && (
              <>
                <PlatformSelector
                  presets={presets}
                  selected={selectedPlatforms}
                  onToggle={togglePlatform}
                  disabled={isProcessing}
                />

                <ModerationToggle
                  value={moderationMode}
                  onChange={setModerationMode}
                  disabled={isProcessing}
                />

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
                    Watermark <span className="normal-case font-normal text-stone-300">— optional</span>
                  </p>
                  <input
                    type="text"
                    placeholder="@yourhandle"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    disabled={isProcessing}
                    className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-400 disabled:opacity-50"
                  />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                  onClick={process}
                  disabled={isProcessing || selectedPlatforms.length === 0}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                      </svg>
                      Processing…
                    </>
                  ) : (
                    `Generate ${selectedPlatforms.length} image${selectedPlatforms.length !== 1 ? "s" : ""}`
                  )}
                </button>
              </>
            )}
          </div>
        ) : (
          result && downloadUrl && (
            <OutputPanel
              metadata={result}
              downloadUrl={downloadUrl}
              filename={`${file?.name?.split(".")[0] ?? "images"}_socials.zip`}
              onReset={reset}
            />
          )
        )}
      </main>
    </div>
  );
}
