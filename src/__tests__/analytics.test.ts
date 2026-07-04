import { pushToDataLayer } from "@/lib/analytics";
import type { AnalyticsEvent } from "@/lib/analytics";

// Mock window.dataLayer
beforeEach(() => {
  window.dataLayer! = [];
});

describe("pushToDataLayer", () => {
  it("initialises dataLayer if it does not exist", () => {
    delete window.dataLayer;
    pushToDataLayer({ event_name: "file_uploaded", file_type: "image/jpeg", file_size_kb: 100 });
    expect(window.dataLayer!).toBeDefined();
  });

  it("pushes event_name as event key for GTM", () => {
    pushToDataLayer({ event_name: "file_uploaded", file_type: "image/jpeg", file_size_kb: 100 });
    expect(window.dataLayer![0]).toMatchObject({ event: "file_uploaded" });
  });

  it("preserves all event properties", () => {
    const event: AnalyticsEvent = {
      event_name: "file_uploaded",
      file_type: "image/png",
      file_size_kb: 512,
    };
    pushToDataLayer(event);
    expect(window.dataLayer![0]).toMatchObject({
      event: "file_uploaded",
      event_name: "file_uploaded",
      file_type: "image/png",
      file_size_kb: 512,
    });
  });

  it("pushes multiple events in order", () => {
    pushToDataLayer({ event_name: "file_uploaded", file_type: "image/jpeg", file_size_kb: 100 });
    pushToDataLayer({ event_name: "moderation_toggled", mode: "blur" });
    expect(window.dataLayer!).toHaveLength(2);
    expect(window.dataLayer![0]).toMatchObject({ event: "file_uploaded" });
    expect(window.dataLayer![1]).toMatchObject({ event: "moderation_toggled" });
  });

it("does not throw when called server-side", () => {
  const original = globalThis.window;
  // @ts-expect-error simulating SSR
  delete globalThis.window;
  expect(() => {
    pushToDataLayer({ event_name: "file_uploaded", file_type: "image/jpeg", file_size_kb: 100 });
  }).not.toThrow();
  globalThis.window = original;
});
});