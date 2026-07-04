import { PLATFORM_PRESETS } from "@/lib/presets";

describe("PLATFORM_PRESETS", () => {
  const keys = Object.keys(PLATFORM_PRESETS);

  it("defines at least one preset", () => {
    expect(keys.length).toBeGreaterThan(0);
  });

  it.each(keys)("%s has valid dimensions", (key) => {
    const preset = PLATFORM_PRESETS[key as keyof typeof PLATFORM_PRESETS];
    expect(preset.width).toBeGreaterThan(0);
    expect(preset.height).toBeGreaterThan(0);
  });

  it.each(keys)("%s has a non-empty label", (key) => {
    const preset = PLATFORM_PRESETS[key as keyof typeof PLATFORM_PRESETS];
    expect(preset.label.trim().length).toBeGreaterThan(0);
  });

  it.each(keys)("%s has a positive file size limit", (key) => {
    const preset = PLATFORM_PRESETS[key as keyof typeof PLATFORM_PRESETS];
    expect(preset.maxFileSizeKb).toBeGreaterThan(0);
  });
}); 