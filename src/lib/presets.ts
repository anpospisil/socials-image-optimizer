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
  instagram_square: {
    label: "Instagram (Square)",
    width: 1080,
    height: 1080,
    maxFileSizeKb: 8000,
    notes: "1:1 feed post, the most universally safe crop for Instagram.",
  },
  instagram_portrait: {
    label: "Instagram (Portrait)",
    width: 1080,
    height: 1350,
    maxFileSizeKb: 8000,
    notes: "4:5 feed post. Taller aspect gets more vertical space in-feed.",
  },
  instagram_story: {
    label: "Instagram (Story/Reel)",
    width: 1080,
    height: 1920,
    maxFileSizeKb: 8000,
    notes: "9:16 full-screen format for Stories and Reels covers.",
  },
  facebook_square: {
    label: "Facebook (Square)",
    width: 1080,
    height: 1080,
    maxFileSizeKb: 8000,
    notes: "1:1 for direct photo/feed posts.",
  },
  facebook_landscape: {
    label: "Facebook (Link Preview)",
    width: 1200,
    height: 630,
    maxFileSizeKb: 8000,
    notes: "1.91:1 — the standard link-share preview size on Facebook.",
  },
};