"use client";

/**
 * useAnalytics — typed wrapper around pushToDataLayer.
 *
 * Components call these methods instead of pushToDataLayer directly.
 * This keeps event construction logic out of components and makes
 * the analytics layer independently testable.
 */

import { useCallback } from "react";
import { pushToDataLayer } from "@/lib/analytics";
import type { ModerationMode, PlatformKey } from "@/types";

export function useAnalytics() {
  const trackFileUploaded = useCallback((file: File) => {
    pushToDataLayer({
      event_name: "file_uploaded",
      file_type: file.type,
      file_size_kb: Math.round(file.size / 1024),
    });
  }, []);

  const trackPlatformSelected = useCallback(
    (key: PlatformKey, selected: boolean, totalSelected: number) => {
      pushToDataLayer({
        event_name: "platform_selected",
        platform_key: key,
        selected,
        total_selected: totalSelected,
      });
    },
    []
  );

  const trackModerationToggled = useCallback((mode: ModerationMode) => {
    pushToDataLayer({
      event_name: "moderation_toggled",
      mode,
    });
  }, []);

  const trackSensitivityChanged = useCallback((threshold: number) => {
    pushToDataLayer({
      event_name: "sensitivity_changed",
      score_threshold: threshold,
    });
  }, []);

  const trackBlurIntensityChanged = useCallback((intensity: number) => {
    pushToDataLayer({
      event_name: "blur_intensity_changed",
      blur_intensity: intensity,
    });
  }, []);

  const trackPreviewRun = useCallback(
    (mode: "blur" | "sticker", threshold: number) => {
      pushToDataLayer({
        event_name: "preview_run",
        moderation_mode: mode,
        score_threshold: threshold,
      });
    },
    []
  );

  const trackPreviewComplete = useCallback(
    (detectionCount: number, mode: "blur" | "sticker") => {
      pushToDataLayer({
        event_name: "preview_complete",
        detection_count: detectionCount,
        moderation_mode: mode,
      });
    },
    []
  );

  const trackProcessingStarted = useCallback(
    (platformCount: number, mode: ModerationMode, hasWatermark: boolean) => {
      pushToDataLayer({
        event_name: "processing_started",
        platform_count: platformCount,
        moderation_mode: mode,
        has_watermark: hasWatermark,
      });
    },
    []
  );

  const trackProcessingComplete = useCallback(
    (platformCount: number, detectionCount: number, moderationApplied: boolean) => {
      pushToDataLayer({
        event_name: "processing_complete",
        platform_count: platformCount,
        detection_count: detectionCount,
        moderation_applied: moderationApplied,
      });
    },
    []
  );

  const trackDownloadClicked = useCallback((platformCount: number) => {
    pushToDataLayer({
      event_name: "download_clicked",
      platform_count: platformCount,
    });
  }, []);

  const trackProcessingError = useCallback((message: string) => {
    pushToDataLayer({
      event_name: "processing_error",
      error_message: message,
    });
  }, []);

  return {
    trackFileUploaded,
    trackPlatformSelected,
    trackModerationToggled,
    trackSensitivityChanged,
    trackBlurIntensityChanged,
    trackPreviewRun,
    trackPreviewComplete,
    trackProcessingStarted,
    trackProcessingComplete,
    trackDownloadClicked,
    trackProcessingError,
  };
}