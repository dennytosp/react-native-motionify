import { describe, expect, it } from "bun:test";

import {
  createScrollTracker,
  detectScrollDirection,
  resolveMotionifyConfig,
  updateScrollTracker,
} from "../src/scroll";

describe("detectScrollDirection", () => {
  it("requires the threshold before switching down", () => {
    expect(detectScrollDirection(7, 8)).toBeNull();
    expect(detectScrollDirection(8, 8)).toBeNull();
    expect(detectScrollDirection(9, 8)).toBe("down");
  });

  it("requires the threshold before switching up", () => {
    expect(detectScrollDirection(-7, 8)).toBeNull();
    expect(detectScrollDirection(-8, 8)).toBeNull();
    expect(detectScrollDirection(-9, 8)).toBe("up");
  });
});

describe("updateScrollTracker", () => {
  it("keeps mounted consumers' scroll offsets independent", () => {
    let first = createScrollTracker();
    let second = createScrollTracker();

    first = updateScrollTracker(first, 0, 30).tracker;
    first = updateScrollTracker(first, 20, 30).tracker;

    const secondStart = updateScrollTracker(second, 100, 12);
    second = secondStart.tracker;

    expect(secondStart.direction).toBeNull();
    expect(updateScrollTracker(second, 105, 12).direction).toBeNull();
    expect(updateScrollTracker(first, 40, 30).direction).toBe("down");
  });

  it("starts a fresh accumulation after becoming idle", () => {
    let tracker = createScrollTracker();
    tracker = updateScrollTracker(tracker, 100, 8).tracker;
    tracker = updateScrollTracker(tracker, 120, 8).tracker;

    const restarted = updateScrollTracker(tracker, 200, 8, 1);

    expect(restarted.startedScrolling).toBe(true);
    expect(restarted.direction).toBeNull();
    expect(restarted.tracker.scrollStartY).toBe(200);
    expect(restarted.tracker.idleGeneration).toBe(1);
  });
});

describe("resolveMotionifyConfig", () => {
  const providerConfig = {
    threshold: 30,
    supportIdle: true,
  };

  it("inherits provider defaults when a consumer has no overrides", () => {
    expect(resolveMotionifyConfig(providerConfig, {})).toEqual(providerConfig);
  });

  it("lets each consumer override the provider independently", () => {
    const first = resolveMotionifyConfig(providerConfig, {
      threshold: 12,
      supportIdle: false,
    });
    const second = resolveMotionifyConfig(providerConfig, {
      threshold: 24,
    });

    expect(first).toEqual({ threshold: 12, supportIdle: false });
    expect(second).toEqual({ threshold: 24, supportIdle: true });
    expect(providerConfig).toEqual({ threshold: 30, supportIdle: true });
  });

  it("allows a consumer to explicitly select the library defaults", () => {
    expect(
      resolveMotionifyConfig(providerConfig, {
        threshold: 8,
        supportIdle: false,
      }),
    ).toEqual({ threshold: 8, supportIdle: false });
  });

  it("ignores non-positive consumer thresholds like setThreshold", () => {
    expect(resolveMotionifyConfig(providerConfig, { threshold: 0 })).toEqual(
      providerConfig,
    );
    expect(resolveMotionifyConfig(providerConfig, { threshold: -10 })).toEqual(
      providerConfig,
    );
  });
});
