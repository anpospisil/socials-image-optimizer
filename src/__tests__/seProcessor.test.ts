import { renderHook, act } from "@testing-library/react";
import { useProcessor } from "@/hooks/useProcessor";



// Mock the API module
jest.mock("@/lib/api", () => ({
  fetchPresets: jest.fn(),
  processImage: jest.fn(),
  previewModeration: jest.fn(),
}));

// Mock useAnalytics
jest.mock("@/hooks/useAnalytics", () => ({
  useAnalytics: () => ({
    trackFileUploaded: jest.fn(),
    trackPlatformSelected: jest.fn(),
    trackModerationToggled: jest.fn(),
    trackSensitivityChanged: jest.fn(),
    trackBlurIntensityChanged: jest.fn(),
    trackPreviewRun: jest.fn(),
    trackPreviewComplete: jest.fn(),
    trackProcessingStarted: jest.fn(),
    trackProcessingComplete: jest.fn(),
    trackDownloadClicked: jest.fn(),
    trackProcessingError: jest.fn(),
  }),
}));

const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });

// jsdom doesn't implement URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => "blob:mock-url");
global.URL.revokeObjectURL = jest.fn();

describe("useProcessor", () => {
  it("initialises with correct default state", () => {
    const { result } = renderHook(() => useProcessor());
    expect(result.current.file).toBeNull();
    expect(result.current.status).toBe("idle");
    expect(result.current.moderationMode).toBe("off");
    expect(result.current.selectedPlatforms).toEqual(["bluesky_square", "twitter_square"]);
    expect(result.current.scoreThreshold).toBe(0.35);
    expect(result.current.blurIntensity).toBe(25);
  });

  it("sets file and creates preview URL", () => {
    const { result } = renderHook(() => useProcessor());
    act(() => { result.current.setFile(mockFile); });
    expect(result.current.file).toBe(mockFile);
    expect(result.current.previewUrl).not.toBeNull();
    expect(result.current.status).toBe("idle");
  });

  it("toggles platform on and off", () => {
    const { result } = renderHook(() => useProcessor());
    act(() => { result.current.togglePlatform("pixiv"); });
    expect(result.current.selectedPlatforms).toContain("pixiv");
    act(() => { result.current.togglePlatform("pixiv"); });
    expect(result.current.selectedPlatforms).not.toContain("pixiv");
  });

  it("clears detection preview when moderation mode changes", () => {
    const { result } = renderHook(() => useProcessor());
    act(() => { result.current.setModerationMode("blur"); });
    expect(result.current.detectionPreview).toBeNull();
  });

  it("clears detection preview when score threshold changes", () => {
    const { result } = renderHook(() => useProcessor());
    act(() => { result.current.setScoreThreshold(0.5); });
    expect(result.current.detectionPreview).toBeNull();
  });

  it("resets to initial state", () => {
    const { result } = renderHook(() => useProcessor());
    act(() => { result.current.setFile(mockFile); });
    act(() => { result.current.togglePlatform("pixiv"); });
    act(() => { result.current.reset(); });
    expect(result.current.file).toBeNull();
    expect(result.current.selectedPlatforms).toEqual(["bluesky_square", "twitter_square"]);
    expect(result.current.status).toBe("idle");
  });

  it("does not process if no platforms selected", async () => {
    const { result } = renderHook(() => useProcessor());
    act(() => { result.current.setFile(mockFile); });
    act(() => {
      result.current.togglePlatform("bluesky_square");
      result.current.togglePlatform("twitter_square");
    });
    await act(async () => { await result.current.process(); });
    expect(result.current.error).toBe("Select at least one platform.");
  });
});