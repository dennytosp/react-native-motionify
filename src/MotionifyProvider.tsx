/**
 * MotionifyProvider - Core context provider for motionify scroll behavior
 *
 * This module provides a context-based approach to share scroll state across
 * the component tree. It handles scroll direction detection and exposes both
 * JS thread state (for React components) and UI thread state (for Reanimated animations).
 *
 * @packageDocumentation
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { runOnJS, useSharedValue } from "react-native-reanimated";
import type {
  Direction,
  MotionifyContextValue,
  MotionifyConfig,
} from "./types";

/**
 * Default configuration values
 */
const DEFAULT_THRESHOLD = 8;
const DEFAULT_SUPPORT_IDLE = false;
const IDLE_TIMEOUT_MS = 200;

/**
 * React Context for motionify scroll state
 */
const MotionifyContext = createContext<MotionifyContextValue | null>(null);

/**
 * Props for MotionifyProvider component
 */
export interface MotionifyProviderProps {
  /**
   * Child components that can access motionify scroll context
   */
  children: ReactNode;

  /**
   * Initial threshold for scroll direction detection (can be changed later)
   * @default 8
   */
  threshold?: number;

  /**
   * Enable idle state support by default
   * @default false
   */
  supportIdle?: boolean;
}

/**
 * MotionifyProvider - Context provider for motionify scroll animations
 *
 * Wraps your app or screen to provide motionify scroll state to all child components.
 * Automatically tracks scroll position and direction using Reanimated worklets
 * for optimal performance.
 *
 * @example
 * ```tsx
 * // Wrap your app
 * function App() {
 *   return (
 *     <MotionifyProvider threshold={10} supportIdle={true}>
 *       <YourApp />
 *     </MotionifyProvider>
 *   );
 * }
 *
 * // Use in any screen
 * function Screen() {
 *   const { onScroll } = useMotionify();
 *
 *   return (
 *     <ScrollView
 *       onScroll={onScroll}
 *       scrollEventThrottle={16}
 *     >
 *       <Content />
 *     </ScrollView>
 *   );
 * }
 * ```
 */
export const MotionifyProvider: React.FC<MotionifyProviderProps> = ({
  children,
  threshold: initialThreshold = DEFAULT_THRESHOLD,
  supportIdle: initialSupportIdle = DEFAULT_SUPPORT_IDLE,
}) => {
  // Reanimated shared values (UI thread)
  const scrollY = useSharedValue(0);
  const directionShared = useSharedValue<Direction>("idle");

  // React state (JS thread)
  const [direction, setDirection] = useState<Direction>("idle");
  const [isScrolling, setIsScrolling] = useState(false);
  const [threshold, setThresholdState] = useState(initialThreshold);
  const [supportIdle, setSupportIdleState] = useState(initialSupportIdle);

  // Refs for tracking scroll state
  const previousYRef = useRef(0);
  const scrollStartYRef = useRef(0);
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const thresholdRef = useRef(threshold);
  const supportIdleRef = useRef(supportIdle);

  // Keep refs in sync with state
  useEffect(() => {
    thresholdRef.current = threshold;
  }, [threshold]);

  useEffect(() => {
    supportIdleRef.current = supportIdle;
  }, [supportIdle]);

  /**
   * Update direction on JS thread
   */
  const updateDirection = useCallback((newDirection: Direction) => {
    setDirection(newDirection);
  }, []);

  /**
   * Update scrolling state on JS thread
   */
  const updateIsScrolling = useCallback((scrolling: boolean) => {
    setIsScrolling(scrolling);
  }, []);

  /**
   * Reset scroll state to idle after timeout
   */
  const resetToIdle = useCallback(() => {
    isUserScrollingRef.current = false;
    directionShared.value = "idle";
    setDirection("idle");
    setIsScrolling(false);
  }, [directionShared]);

  /**
   * Handle scroll timeout for idle state detection
   */
  const resetScrollTimeout = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      resetToIdle();
    }, IDLE_TIMEOUT_MS);
  }, [resetToIdle]);

  /**
   * Main scroll event handler
   * Runs on UI thread using Reanimated worklets for optimal performance
   */
  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      "worklet";

      const currentY = event.nativeEvent.contentOffset.y;
      const contentHeight = event.nativeEvent.contentSize.height;
      const layoutHeight = event.nativeEvent.layoutMeasurement.height;

      // Clamp scroll position to valid range
      const maxScrollY = Math.max(0, contentHeight - layoutHeight);
      const clampedY = Math.max(0, Math.min(currentY, maxScrollY));

      // Update shared value (UI thread)
      scrollY.value = clampedY;

      // Calculate delta from previous position
      const deltaY = clampedY - previousYRef.current;

      // Initialize scroll start position on first scroll
      if (!isUserScrollingRef.current) {
        isUserScrollingRef.current = true;
        scrollStartYRef.current = clampedY;

        // Update scrolling state on JS thread
        runOnJS(updateIsScrolling)(true);
      }

      // Detect direction change
      const currentTotalDelta = clampedY - scrollStartYRef.current;
      const isDirectionChange =
        (currentTotalDelta > 0 && deltaY < 0) || // Was scrolling down, now up
        (currentTotalDelta < 0 && deltaY > 0) || // Was scrolling up, now down
        (currentTotalDelta === 0 && Math.abs(deltaY) > 0); // Started scrolling

      // Reset scroll start on direction change
      if (isDirectionChange) {
        scrollStartYRef.current = clampedY;
      }

      // Handle idle timeout if enabled
      if (supportIdleRef.current) {
        runOnJS(resetScrollTimeout)();
      }

      // Determine new direction based on total delta from scroll start
      const totalDelta = clampedY - scrollStartYRef.current;
      let newDirection: Direction | null = null;

      if (totalDelta > 0) {
        newDirection = "down";
      } else if (totalDelta < -thresholdRef.current) {
        newDirection = "up";
      }

      // Update direction if changed
      if (newDirection && newDirection !== directionShared.value) {
        directionShared.value = newDirection;
        runOnJS(updateDirection)(newDirection);
      }

      // Update previous position for next frame
      previousYRef.current = clampedY;
    },
    [
      scrollY,
      directionShared,
      resetScrollTimeout,
      updateDirection,
      updateIsScrolling,
    ]
  );

  /**
   * Update threshold value
   */
  const setThreshold = useCallback((newThreshold: number) => {
    if (newThreshold > 0) {
      setThresholdState(newThreshold);
    }
  }, []);

  /**
   * Enable/disable idle state support
   */
  const setSupportIdle = useCallback((enabled: boolean) => {
    setSupportIdleState(enabled);
  }, []);

  /**
   * Memoized context value
   */
  const contextValue = useMemo<MotionifyContextValue>(
    () => ({
      scrollY,
      direction,
      directionShared,
      isScrolling,
      onScroll,
      setThreshold,
      setSupportIdle,
    }),
    [
      scrollY,
      direction,
      directionShared,
      isScrolling,
      onScroll,
      setThreshold,
      setSupportIdle,
    ]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <MotionifyContext.Provider value={contextValue}>
      {children}
    </MotionifyContext.Provider>
  );
};

/**
 * Hook to access motionify scroll context
 *
 * Must be used within a MotionifyProvider. Provides access to scroll state
 * and utilities for motionify animations.
 *
 * @throws Error if used outside MotionifyProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { scrollY, direction, onScroll } = useMotionifyContext();
 *
 *   return (
 *     <ScrollView onScroll={onScroll} scrollEventThrottle={16}>
 *       <Text>Direction: {direction}</Text>
 *     </ScrollView>
 *   );
 * }
 * ```
 */
export const useMotionifyContext = (): MotionifyContextValue => {
  const context = useContext(MotionifyContext);

  if (!context) {
    throw new Error(
      "useMotionifyContext must be used within a MotionifyProvider. " +
        "Wrap your component tree with <MotionifyProvider>."
    );
  }

  return context;
};

/**
 * Hook for configuring motionify scroll behavior
 *
 * Provides access to scroll state with optional configuration.
 * Use this hook in screens where you want to attach scroll handlers
 * or customize scroll detection behavior.
 *
 * @param config - Optional configuration for scroll behavior
 * @returns Motionify scroll context value
 *
 * @example
 * ```tsx
 * // Use default configuration
 * function Screen1() {
 *   const { onScroll } = useMotionify();
 *
 *   return <ScrollView onScroll={onScroll} scrollEventThrottle={16} />;
 * }
 *
 * // Use custom threshold
 * function Screen2() {
 *   const { onScroll } = useMotionify({ threshold: 15 });
 *
 *   return <ScrollView onScroll={onScroll} scrollEventThrottle={16} />;
 * }
 *
 * // Enable idle state detection
 * function Screen3() {
 *   const { onScroll, direction } = useMotionify({ supportIdle: true });
 *
 *   return (
 *     <ScrollView onScroll={onScroll} scrollEventThrottle={16}>
 *       <Text>Direction: {direction}</Text>
 *     </ScrollView>
 *   );
 * }
 * ```
 */
export const useMotionify = (
  config: MotionifyConfig = {}
): MotionifyContextValue => {
  const { threshold = DEFAULT_THRESHOLD, supportIdle = DEFAULT_SUPPORT_IDLE } =
    config;
  const context = useMotionifyContext();

  // Apply threshold configuration
  useEffect(() => {
    if (threshold !== undefined && threshold !== DEFAULT_THRESHOLD) {
      context.setThreshold(threshold);

      // Reset to default on cleanup
      return () => {
        context.setThreshold(DEFAULT_THRESHOLD);
      };
    }
  }, [threshold, context]);

  // Apply idle support configuration
  useEffect(() => {
    if (supportIdle !== undefined && supportIdle !== DEFAULT_SUPPORT_IDLE) {
      context.setSupportIdle(supportIdle);

      // Reset to default on cleanup
      return () => {
        context.setSupportIdle(DEFAULT_SUPPORT_IDLE);
      };
    }
  }, [supportIdle, context]);

  return context;
};
