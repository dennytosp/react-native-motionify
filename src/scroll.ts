import type { Direction, MotionifyConfig } from "./types";

export interface ResolvedMotionifyConfig {
  threshold: number;
  supportIdle: boolean;
}

export interface ScrollTracker {
  previousY: number;
  scrollStartY: number;
  isUserScrolling: boolean;
  idleGeneration: number;
}

export interface ScrollTrackerUpdate {
  tracker: ScrollTracker;
  direction: Direction | null;
  startedScrolling: boolean;
}

/**
 * Resolve a consumer's scroll configuration without mutating provider state.
 */
export const resolveMotionifyConfig = (
  providerConfig: ResolvedMotionifyConfig,
  consumerConfig: MotionifyConfig,
): ResolvedMotionifyConfig => {
  const consumerThreshold = consumerConfig.threshold;

  return {
    threshold:
      consumerThreshold !== undefined && consumerThreshold > 0
        ? consumerThreshold
        : providerConfig.threshold,
    supportIdle: consumerConfig.supportIdle ?? providerConfig.supportIdle,
  };
};

/**
 * Detect direction only after movement exceeds the configured threshold.
 */
export const detectScrollDirection = (
  totalDelta: number,
  threshold: number,
): Direction | null => {
  if (totalDelta > threshold) {
    return "down";
  }

  if (totalDelta < -threshold) {
    return "up";
  }

  return null;
};

export const createScrollTracker = (idleGeneration = 0): ScrollTracker => ({
  previousY: 0,
  scrollStartY: 0,
  isUserScrolling: false,
  idleGeneration,
});

/**
 * Advance one consumer's direction detector without sharing scroll offsets
 * with other mounted consumers.
 */
export const updateScrollTracker = (
  tracker: ScrollTracker,
  currentY: number,
  threshold: number,
  idleGeneration = tracker.idleGeneration,
): ScrollTrackerUpdate => {
  const activeTracker =
    tracker.idleGeneration === idleGeneration
      ? tracker
      : createScrollTracker(idleGeneration);
  const deltaY = currentY - activeTracker.previousY;
  const startedScrolling = !activeTracker.isUserScrolling;
  let scrollStartY = startedScrolling ? currentY : activeTracker.scrollStartY;

  const currentTotalDelta = currentY - scrollStartY;
  const isDirectionChange =
    (currentTotalDelta > 0 && deltaY < 0) ||
    (currentTotalDelta < 0 && deltaY > 0) ||
    (currentTotalDelta === 0 && Math.abs(deltaY) > 0);

  if (isDirectionChange) {
    scrollStartY = currentY;
  }

  return {
    tracker: {
      previousY: currentY,
      scrollStartY,
      isUserScrolling: true,
      idleGeneration,
    },
    direction: detectScrollDirection(currentY - scrollStartY, threshold),
    startedScrolling,
  };
};
