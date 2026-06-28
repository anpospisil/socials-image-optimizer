/**
 * Analytics event schema and dataLayer utility.
 *
 * All GA4 events flow through pushToDataLayer — no raw gtag() calls
 * anywhere in the app. This gives us a typed contract between the
 * frontend and GTM, and makes the events testable in isolation.
 *
 * GTM picks up these events via Custom Event triggers matching
 * the event_name field.
 *
 * ADR #4: see docs/decisions/ADR-004-analytics-architecture.md
 */

// ---------------------------------------------------------------------------
// Event definitions — one interface per event
// ---------------------------------------------------------------------------

interface FileUploadedEvent {
  event_name: "file_uploaded";
  file_type: string;       // e.g. "image/jpeg"
  file_size_kb: number;
}

interface PlatformSelectedEvent {
  event_name: "platform_selected";
  platform_key: string;
  selected: boolean;       // true = added, false = removed
  total_selected: number;
}

interface ModerationToggledEvent {
  event_name: "moderation_toggled";
  mode: "off" | "blur" | "sticker";
}

interface SensitivityChangedEvent {
  event_name: "sensitivity_changed";
  score_threshold: number;
}

interface BlurIntensityChangedEvent {
  event_name: "blur_intensity_changed";
  blur_intensity: number;
}

interface PreviewRunEvent {
  event_name: "preview_run";
  moderation_mode: "blur" | "sticker";
  score_threshold: number;
}

interface PreviewCompleteEvent {
  event_name: "preview_complete";
  detection_count: number;
  moderation_mode: "blur" | "sticker";
}

interface ProcessingStartedEvent {
  event_name: "processing_started";
  platform_count: number;
  moderation_mode: "off" | "blur" | "sticker";
  has_watermark: boolean;
}

interface ProcessingCompleteEvent {
  event_name: "processing_complete";
  platform_count: number;
  detection_count: number;
  moderation_applied: boolean;
}

interface DownloadClickedEvent {
  event_name: "download_clicked";
  platform_count: number;
}

interface ProcessingErrorEvent {
  event_name: "processing_error";
  error_message: string;
}

// ---------------------------------------------------------------------------
// Union type — every valid event shape
// ---------------------------------------------------------------------------

export type AnalyticsEvent =
  | FileUploadedEvent
  | PlatformSelectedEvent
  | ModerationToggledEvent
  | SensitivityChangedEvent
  | BlurIntensityChangedEvent
  | PreviewRunEvent
  | PreviewCompleteEvent
  | ProcessingStartedEvent
  | ProcessingCompleteEvent
  | DownloadClickedEvent
  | ProcessingErrorEvent;

// ---------------------------------------------------------------------------
// dataLayer utility
// ---------------------------------------------------------------------------

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function pushToDataLayer(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
  event: event.event_name,
  ...(event as unknown as Record<string, unknown>),
});

  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", event.event_name, event);
  }
}