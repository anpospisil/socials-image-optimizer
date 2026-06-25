"use client";

/**
 * useProcessor — orchestrates the full upload → configure → process → download flow.
 *
 * Keeping all state here means components stay dumb and testable.
 * This hook is the thing we'll write Jest tests against in Phase 4.
 */

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
  previewUrl: string | null;          // local object URL for the image preview
  selectedPlatforms: PlatformKey[];
  moderationMode: ModerationMode;
  watermarkText: string;
  status: ProcessingStatus;
  error: string | null;
  result: ProcessMetadata | null;
  downloadUrl: string | null;
  previewDetections: PreviewResponse | null;
}

const initialState: ProcessorState = {
  file: null,
  previewUrl: null,
  selectedPlatforms: ["bluesky_square", "twitter_square"],
  moderationMode: "off",
  watermarkText: "",
  status: "idle",
  error: null,
  result: null,
  downloadUrl: null,
  previewDetections: null,
};

export function useProcessor() {
  const [state, setState] = useState<ProcessorState>(initialState);

  const setFile = useCallback((file: File) => {
    // Revoke previous preview URL to avoid memory leaks
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
        previewDetections: null,
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
    setState((prev) => ({ ...prev, moderationMode: mode }));
  }, []);

  const setWatermarkText = useCallback((text: string) => {
    setState((prev) => ({ ...prev, watermarkText: text }));
  }, []);

  const runPreview = useCallback(async () => {
    const { file, moderationMode } = state;
    if (!file || moderationMode === "off") return;

    setState((prev) => ({ ...prev, status: "processing", error: null }));
    try {
      const preview = await previewModeration(file, {
        platforms: ["bluesky_square"],
        moderation_mode: moderationMode,
      });
      setState((prev) => ({
        ...prev,
        status: "idle",
        previewDetections: preview,
      }));
    } catch (e) {
      setState((prev) => ({
        ...prev,
        status: "error",
        error: e instanceof Error ? e.message : "Preview failed",
      }));
    }
  }, [state]);

  const process = useCallback(async () => {
    const { file, selectedPlatforms, moderationMode, watermarkText } = state;
    if (!file) return;
    if (selectedPlatforms.length === 0) {
      setState((prev) => ({ ...prev, error: "Select at least one platform." }));
      return;
    }

    const config: ProcessingConfig = {
      platforms: selectedPlatforms,
      moderation_mode: moderationMode,
      watermark_text: watermarkText || undefined,
    };

    setState((prev) => ({ ...prev, status: "processing", error: null }));

    try {
      const { metadata, downloadUrl } = await processImage(file, config);
      setState((prev) => ({
        ...prev,
        status: "done",
        result: metadata,
        downloadUrl,
      }));
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

  return { ...state, setFile, togglePlatform, setModerationMode, setWatermarkText, runPreview, process, reset };
}
