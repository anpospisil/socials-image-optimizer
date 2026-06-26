"use client";

import { useState, useCallback } from "react";
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

  const setFile = useCallback((file: File) => {
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
  }, []);

  const togglePlatform = useCallback((key: PlatformKey) => {
    setState((prev) => ({
      ...prev,
      selectedPlatforms: prev.selectedPlatforms.includes(key)
        ? prev.selectedPlatforms.filter((p) => p !== key)
        : [...prev.selectedPlatforms, key],
    }));
  }, []);

  const setModerationMode = useCallback((mode: ModerationMode) => {
    setState((prev) => ({ ...prev, moderationMode: mode, detectionPreview: null }));
  }, []);

  const setWatermarkText = useCallback((text: string) => {
    setState((prev) => ({ ...prev, watermarkText: text }));
  }, []);

  const setScoreThreshold = useCallback((value: number) => {
    setState((prev) => ({ ...prev, scoreThreshold: value, detectionPreview: null }));
  }, []);

const setBlurIntensity = useCallback((value: number) => {
  setState((prev) => ({ ...prev, blurIntensity: value }));
}, []);

  const runPreview = useCallback(async () => {
    const { file, moderationMode, scoreThreshold } = state;
    if (!file || moderationMode === "off") return;

    setState((prev) => ({ ...prev, status: "uploading", error: null, detectionPreview: null }));
    try {
      const preview = await previewModeration(file, {
        platforms: ["bluesky_square"],
        moderation_mode: moderationMode,
        score_threshold: scoreThreshold,
      });
      setState((prev) => ({ ...prev, status: "idle", detectionPreview: preview }));
    } catch (e) {
      setState((prev) => ({
        ...prev,
        status: "error",
        error: e instanceof Error ? e.message : "Preview failed",
      }));
    }
  }, [state]);

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

    setState((prev) => ({ ...prev, status: "processing", error: null }));

    try {
      const { metadata, downloadUrl } = await processImage(file, config);
      setState((prev) => ({ ...prev, status: "done", result: metadata, downloadUrl }));
    } catch (e) {
      setState((prev) => ({
        ...prev,
        status: "error",
        error: e instanceof Error ? e.message : "Something went wrong",
      }));
    }
  }, [state]);

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
