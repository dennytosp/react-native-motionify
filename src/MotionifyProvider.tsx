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
import { useSharedValue } from "react-native-reanimated";
import type {
  Direction,
  MotionifyContextValue,
  MotionifyConfig,
  ScrollEventHandler,
  TabBarControls,
} from "./types";
import {
  createScrollTracker,
  resolveMotionifyConfig,
  updateScrollTracker,
  type ScrollTracker,
} from "./scroll";

/**
 * Default configuration values
 */
const DEFAULT_THRESHOLD = 8;
const DEFAULT_SUPPORT_IDLE = false;
const IDLE_TIMEOUT_MS = 200;

/**
 * React Context for motionify scroll state
 */
interface ScrollTrackerRef {
  current: ScrollTracker;
}

interface MotionifyInternalContextValue extends MotionifyContextValue {
  handleScroll: (
    event: Parameters<ScrollEventHandler>[0],
    trackerRef: ScrollTrackerRef,
    config: MotionifyConfig,
  ) => void;
  registerSupportIdle: () => () => void;
}

const MotionifyContext = createContext<MotionifyInternalContextValue | null>(
  null,
);

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
 * Tracks scroll position and direction, then publishes SharedValues for
 * UI-thread animations.
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
  const tabBarOverride = useSharedValue<"show" | "hide" | "none">("none");

  // React state (JS thread)
  const [direction, setDirection] = useState<Direction>("idle");
  const [isScrolling, setIsScrolling] = useState(false);
  const [threshold, setThresholdState] = useState(initialThreshold);
  const [supportIdle, setSupportIdleState] = useState(initialSupportIdle);

  // Refs for tracking scroll state
  const providerScrollTrackerRef = useRef(createScrollTracker());
  // `ReturnType<typeof setTimeout>` rather than `NodeJS.Timeout`: React Native
  // has no NodeJS namespace, and its setTimeout returns a number.
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleGenerationRef = useRef(0);
  const supportIdleRequestCountRef = useRef(0);
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
    idleGenerationRef.current += 1;
    directionShared.value = "idle";
    setDirection("idle");
    setIsScrolling(false);
  }, [directionShared]);

  const clearScrollTimeout = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }
  }, []);

  /**
   * Handle scroll timeout for idle state detection
   */
  const resetScrollTimeout = useCallback(() => {
    clearScrollTimeout();

    scrollTimeoutRef.current = setTimeout(() => {
      resetToIdle();
    }, IDLE_TIMEOUT_MS);
  }, [clearScrollTimeout, resetToIdle]);

  /**
   * Keep component-level idle requests active while at least one requesting
   * MotionifyView or MotionifyBottomTab is mounted.
   */
  const registerSupportIdle = useCallback(() => {
    supportIdleRequestCountRef.current += 1;

    return () => {
      supportIdleRequestCountRef.current = Math.max(
        0,
        supportIdleRequestCountRef.current - 1,
      );
    };
  }, []);

  /**
   * Main scroll event handler.
   *
   * Direction detection runs on the React Native JS event thread. Shared
   * values publish its output to UI-thread animations.
   */
  const handleScroll = useCallback(
    (
      event: NativeSyntheticEvent<NativeScrollEvent>,
      trackerRef: ScrollTrackerRef,
      consumerConfig: MotionifyConfig,
    ) => {
      const currentY = event.nativeEvent.contentOffset.y;
      const contentHeight = event.nativeEvent.contentSize.height;
      const layoutHeight = event.nativeEvent.layoutMeasurement.height;

      // Clamp scroll position to valid range
      const maxScrollY = Math.max(0, contentHeight - layoutHeight);
      const clampedY = Math.max(0, Math.min(currentY, maxScrollY));

      // Update shared value (UI thread)
      scrollY.value = clampedY;

      const activeConfig = resolveMotionifyConfig(
        {
          threshold: thresholdRef.current,
          supportIdle:
            supportIdleRef.current || supportIdleRequestCountRef.current > 0,
        },
        consumerConfig,
      );

      const trackerUpdate = updateScrollTracker(
        trackerRef.current,
        clampedY,
        activeConfig.threshold,
        idleGenerationRef.current,
      );
      trackerRef.current = trackerUpdate.tracker;

      if (trackerUpdate.startedScrolling) {
        updateIsScrolling(true);
      }

      // Handle idle timeout if enabled for this scroll handler
      if (activeConfig.supportIdle) {
        resetScrollTimeout();
      } else if (scrollTimeoutRef.current) {
        clearScrollTimeout();
      }

      const newDirection = trackerUpdate.direction;

      // Update direction if changed
      if (newDirection && newDirection !== directionShared.value) {
        directionShared.value = newDirection;
        updateDirection(newDirection);

        // Reset tab bar override when scroll direction changes
        // This allows scroll-based behavior to resume after programmatic control
        if (tabBarOverride.value !== "none") {
          tabBarOverride.value = "none";
        }
      }
    },
    [
      scrollY,
      directionShared,
      tabBarOverride,
      clearScrollTimeout,
      resetScrollTimeout,
      updateDirection,
      updateIsScrolling,
    ],
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
   * Tab bar visibility controls
   * Programmatically control tab bar show/hide/reset
   *
   * Uses SharedValue.set() for React Compiler compatibility. That method was
   * added in Reanimated 3.16, which is why it is the minimum peer version.
   */
  const showTabBar = useCallback(() => {
    tabBarOverride.set("show");
  }, [tabBarOverride]);

  const hideTabBar = useCallback(() => {
    tabBarOverride.set("hide");
  }, [tabBarOverride]);

  const resetTabBar = useCallback(() => {
    tabBarOverride.set("none");
  }, [tabBarOverride]);

  const tabBarControls: TabBarControls = useMemo(
    () => ({
      show: showTabBar,
      hide: hideTabBar,
      reset: resetTabBar,
    }),
    [showTabBar, hideTabBar, resetTabBar],
  );

  /**
   * Memoized context value
   */
  const onScroll = useCallback<ScrollEventHandler>(
    (event) => {
      handleScroll(event, providerScrollTrackerRef, {});
    },
    [handleScroll],
  );

  const contextValue = useMemo<MotionifyInternalContextValue>(
    () => ({
      scrollY,
      direction,
      directionShared,
      isScrolling,
      onScroll,
      handleScroll,
      setThreshold,
      setSupportIdle,
      registerSupportIdle,
      tabBar: tabBarControls,
      tabBarOverride,
    }),
    [
      scrollY,
      direction,
      directionShared,
      isScrolling,
      onScroll,
      handleScroll,
      setThreshold,
      setSupportIdle,
      registerSupportIdle,
      tabBarControls,
      tabBarOverride,
    ],
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return clearScrollTimeout;
  }, [clearScrollTimeout]);

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
const useMotionifyInternalContext = (): MotionifyInternalContextValue => {
  const context = useContext(MotionifyContext);

  if (!context) {
    throw new Error(
      "useMotionifyContext must be used within a MotionifyProvider. " +
        "Wrap your component tree with <MotionifyProvider>.",
    );
  }

  return context;
};

export const useMotionifyContext = (): MotionifyContextValue =>
  useMotionifyInternalContext();

/**
 * Register component-level idle support without allowing one component's
 * cleanup to disable another mounted component.
 *
 * @internal
 */
export const useMotionifySupportIdle = (enabled: boolean): void => {
  const { registerSupportIdle } = useMotionifyInternalContext();

  useEffect(() => {
    if (enabled) {
      return registerSupportIdle();
    }
  }, [enabled, registerSupportIdle]);
};

/**
 * Hook for configuring motionify scroll behavior
 *
 * Provides access to scroll state with optional configuration.
 * Use this hook in screens where you want to attach scroll handlers
 * or customize scroll detection behavior. Configuration is scoped to the
 * returned scroll handler, so mounted screens do not overwrite each other.
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
  config: MotionifyConfig = {},
): MotionifyContextValue => {
  const { threshold, supportIdle } = config;
  const context = useMotionifyInternalContext();
  const trackerRef = useRef(createScrollTracker());
  const consumerConfig = useMemo<MotionifyConfig>(
    () => ({ threshold, supportIdle }),
    [supportIdle, threshold],
  );
  const { handleScroll } = context;

  const configuredOnScroll = useCallback<ScrollEventHandler>(
    (event) => {
      handleScroll(event, trackerRef, consumerConfig);
    },
    [consumerConfig, handleScroll],
  );

  return useMemo<MotionifyContextValue>(
    () => ({
      scrollY: context.scrollY,
      direction: context.direction,
      directionShared: context.directionShared,
      isScrolling: context.isScrolling,
      onScroll: configuredOnScroll,
      setThreshold: context.setThreshold,
      setSupportIdle: context.setSupportIdle,
      tabBar: context.tabBar,
      tabBarOverride: context.tabBarOverride,
    }),
    [
      configuredOnScroll,
      context.direction,
      context.directionShared,
      context.isScrolling,
      context.scrollY,
      context.setSupportIdle,
      context.setThreshold,
      context.tabBar,
      context.tabBarOverride,
    ],
  );
};
