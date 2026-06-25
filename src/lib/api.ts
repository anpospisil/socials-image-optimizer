/**
 * API client for the image-optimizer FastAPI service.
 *
 * All backend calls live here — no fetch() calls scattered through components.
 * The base URL is set via NEXT_PUBLIC_API_URL environment variable so it
 * works in both local dev (localhost:8000) and production (Railway URL).
 */

import type {
  PresetsMap,
  ProcessingConfig,
  ProcessMetadata,
  PreviewResponse,
} from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ---------------------------------------------------------------------------
// Presets
// ---------------------------------------------------------------------------

export async function fetchPresets(): Promise<PresetsMap> {
  const res = await fetch(`${API_BASE}/api/presets`);
  if (!res.ok) throw new Error("Failed to load platform presets");
  return res.json();
}

// ---------------------------------------------------------------------------
// Preview (detect only, no output images)
// ---------------------------------------------------------------------------

export async function previewModeration(
  file: File,
  config: Omit<ProcessingConfig, "preview_only">
): Promise<PreviewResponse> {
  const form = new FormData();
  form.append("image", file);
  form.append(
    "config",
    JSON.stringify({ ...config, preview_only: true, platforms: ["bluesky_square"] })
  );

  const res = await fetch(`${API_BASE}/api/process`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? "Preview failed");
  }

  return res.json();
}

// ---------------------------------------------------------------------------
// Process — returns a ZIP blob + metadata from response header
// ---------------------------------------------------------------------------

export interface ProcessResult {
  zipBlob: Blob;
  metadata: ProcessMetadata;
  downloadUrl: string;
}

export async function processImage(
  file: File,
  config: ProcessingConfig
): Promise<ProcessResult> {
  const form = new FormData();
  form.append("image", file);
  form.append("config", JSON.stringify(config));

  const res = await fetch(`${API_BASE}/api/process`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? "Processing failed");
  }

  // Metadata is embedded in the response header so we can read it
  // without parsing the ZIP
  const metaHeader = res.headers.get("X-Process-Metadata");
  if (!metaHeader) throw new Error("Missing process metadata in response");
  const metadata: ProcessMetadata = JSON.parse(metaHeader);

  const zipBlob = await res.blob();
  const downloadUrl = URL.createObjectURL(zipBlob);

  return { zipBlob, metadata, downloadUrl };
}
