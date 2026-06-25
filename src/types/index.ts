// ---------------------------------------------------------------------------
// Platform presets
// Mirrors app/presets.py — if you add a preset there, add the key here.
// ---------------------------------------------------------------------------

export type PlatformKey =
  | "bluesky_square"
  | "bluesky_landscape"
  | "twitter_square"
  | "twitter_landscape"
  | "pixiv"
  | "fanbox";

export interface PlatformPreset {
  label: string;
  width: number;
  height: number;
  max_file_size_kb: number;
  notes: string;
}

export type PresetsMap = Record<PlatformKey, PlatformPreset>;

// ---------------------------------------------------------------------------
// Processing config — sent to POST /api/process
// ---------------------------------------------------------------------------

export type ModerationMode = "off" | "blur" | "sticker";

export interface ProcessingConfig {
  platforms: PlatformKey[];
  moderation_mode: ModerationMode;
  watermark_text?: string;
  preview_only?: boolean;
  score_threshold?: number;
  blur_intensity?: number;
}

// ---------------------------------------------------------------------------
// API responses
// ---------------------------------------------------------------------------

export interface DetectionResult {
  label: string;
  score: number;
  box: [number, number, number, number]; // [x1, y1, x2, y2]
}

export interface ProcessedOutput {
  platform_key: PlatformKey;
  platform_label: string;
  width: number;
  height: number;
  filename: string;
}

export interface ProcessMetadata {
  outputs: ProcessedOutput[];
  detections: DetectionResult[];
  detection_count: number;
  moderation_applied: boolean;
}

export interface PreviewResponse {
  detections: DetectionResult[];
  detection_count: number;
  image_width: number;
  image_height: number;
}

// ---------------------------------------------------------------------------
// UI state
// ---------------------------------------------------------------------------

export type ProcessingStatus =
  | "idle"
  | "uploading"
  | "processing"
  | "done"
  | "error";
