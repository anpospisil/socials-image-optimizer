    export interface PlatformPreset {
  label: string;
  width: number;
  height: number;
  maxFileSizeKb: number;
  notes: string;
}

export const PLATFORM_PRESETS: Record<string, PlatformPreset> = {
  bluesky_square: {
    label: "Bluesky (Square)",
    width: 1000,
    height: 1000,
    maxFileSizeKb: 1000,
    notes: "Primary discovery platform. Square performs best.",
  },
  bluesky_landscape: {
    label: "Bluesky (Landscape)",
    width: 1200,
    height: 675,
    maxFileSizeKb: 1000,
    notes: "16:9 landscape for Bluesky.",
  },
  twitter_square: {
    label: "Twitter/X (Square)",
    width: 900,
    height: 900,
    maxFileSizeKb: 5000,
    notes: "Square format for Twitter/X.",
  },
  twitter_landscape: {
    label: "Twitter/X (Landscape)",
    width: 1200,
    height: 675,
    maxFileSizeKb: 5000,
    notes: "16:9 landscape for Twitter/X.",
  },
  pixiv: {
    label: "Pixiv",
    width: 2048,
    height: 2048,
    maxFileSizeKb: 32000,
    notes: "2048px longest side is the sweet spot for quality.",
  },
  fanbox: {
    label: "Pixiv Fanbox",
    width: 2048,
    height: 2048,
    maxFileSizeKb: 8000,
    notes: "Fanbox has a tighter file size limit than Pixiv.",
  },
};