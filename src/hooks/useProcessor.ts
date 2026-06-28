"use client";

import { useState, useCallback } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { processImage, previewModeration } from "@/lib/api";
import type {
  ProcessingConfig,
  ProcessingStatus,
  ProcessMetadata,
  PreviewResponse,
  ModerationMode,
  PlatformKey,
} from "@/types";

interface ProcessorState {
  file: File | null;
  previewUrl: string | null;
  selectedPlatforms: PlatformKey[];
  moderationMode: ModerationMode;
  watermarkText: string;
  scoreThreshold: number;
  status: ProcessingStatus;
  error: string | null;
  result: ProcessMetadata | null;
  downloadUrl: string | null;
  detectionPreview: PreviewResponse | null;
  blurIntensity: number;
}

const initialState: ProcessorState = {
  file: null,
  previewUrl: null,
  selectedPlatforms: ["bluesky_square", "twitter_square"],
  moderationMode: "off",
  watermarkText: "",
  scoreThreshold: 0.35,
  status: "idle",
  error: null,
  result: null,
  downloadUrl: null,
  detectionPreview: null,
  blurIntensity: 25,
};

export function useProcessor() {
  const [state, setState] = useState<ProcessorState>(initialState);

  const analytics = useAnalytics();

  const setFile = useCallback((file: File) => {
    analytics.trackFileUploaded(file),
    setState((prev) => {
      if (prev.previewUrl) URL.revokeObjectURL(prev.previewUrl);
      return {
        ...prev,
        file,
        previewUrl: URL.createObjectURL(file),
        status: "idle",
        error: null,
        result: null,
        downloadUrl: null,
        detectionPreview: null,
      };
    });
  }, [analytics]);

 const togglePlatform = useCallback((key: PlatformKey) => {
  setState((prev) => {
    const isSelected = prev.selectedPlatforms.includes(key);
    const next = isSelected
      ? prev.selectedPlatforms.filter((p) => p !== key)
      : [...prev.selectedPlatforms, key];
    analytics.trackPlatformSelected(key, !isSelected, next.length);
    return { ...prev, selectedPlatforms: next };
  });
}, [analytics]);

const setModerationMode = useCallback((mode: ModerationMode) => {
  analytics.trackModerationToggled(mode);
  setState((prev) => ({ ...prev, moderationMode: mode, detectionPreview: null }));
}, [analytics]);

  const setWatermarkText = useCallback((text: string) => {
    setState((prev) => ({ ...prev, watermarkText: text }));
  }, []);

const setScoreThreshold = useCallback((value: number) => {
  analytics.trackSensitivityChanged(value);
  setState((prev) => ({ ...prev, scoreThreshold: value, detectionPreview: null }));
}, [analytics]);

const setBlurIntensity = useCallback((value: number) => {
  analytics.trackBlurIntensityChanged(value);
  setState((prev) => ({ ...prev, blurIntensity: value }));
}, [analytics]);

  const runPreview = useCallback(async () => {
    const { file, moderationMode, scoreThreshold } = state;
    if (!file || moderationMode === "off") return;

    setState((prev) => ({ ...prev, status: "uploading", error: null, detectionPreview: null }));
    analytics.trackPreviewRun(moderationMode as "blur" | "sticker", scoreThreshold);
    try {
      const preview = await previewModeration(file, {
        platforms: ["bluesky_square"],
        moderation_mode: moderationMode,
        score_threshold: scoreThreshold,
      });
      setState((prev) => ({ ...prev, status: "idle", detectionPreview: preview }));
      analytics.trackPreviewComplete(preview.detection_count, moderationMode as "blur" | "sticker");
    } catch (e) {
      setState((prev) => ({
        ...prev,
        status: "error",
        error: e instanceof Error ? e.message : "Preview failed",
      }));
    }
  }, [state, analytics]);

  const process = useCallback(async () => {
    const { file, selectedPlatforms, moderationMode, watermarkText, scoreThreshold, blurIntensity } = state;
    if (!file) return;
    if (selectedPlatforms.length === 0) {
      setState((prev) => ({ ...prev, error: "Select at least one platform." }));
      return;
    }

    const config: ProcessingConfig = {
      platforms: selectedPlatforms,
      moderation_mode: moderationMode,
      watermark_text: watermarkText || undefined,
      score_threshold: scoreThreshold,
      blur_intensity: blurIntensity,
    };
    analytics.trackProcessingStarted(selectedPlatforms.length, moderationMode, !!watermarkText);
    setState((prev) => ({ ...prev, status: "processing", error: null }));

    try {
      const { metadata, downloadUrl } = await processImage(file, config);
      setState((prev) => ({ ...prev, status: "done", result: metadata, downloadUrl }));
      analytics.trackProcessingComplete(metadata.outputs.length, metadata.detection_count, metadata.moderation_applied);
    } catch (e) {
      setState((prev) => ({
        ...prev,
        status: "error",
        error: e instanceof Error ? e.message : "Something went wrong",
        
      }));
      analytics.trackProcessingError(e instanceof Error ? e.message : "Unknown error");
    }
  }, [state, analytics]);

  const reset = useCallback(() => {
    setState((prev) => {
      if (prev.previewUrl) URL.revokeObjectURL(prev.previewUrl);
      if (prev.downloadUrl) URL.revokeObjectURL(prev.downloadUrl);
      return initialState;
    });
  }, []);

  return {
    ...state,
    setFile,
    togglePlatform,
    setModerationMode,
    setWatermarkText,
    setScoreThreshold,
    setBlurIntensity,
    runPreview,
    process,
    reset,
  };
}
