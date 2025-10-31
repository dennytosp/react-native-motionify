import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import { runOnJS } from "react-native-worklets";
import { Direction } from "./types";

/**
 * Auto-Reactive Context - Provides scroll detection without manual hooks
 */
export interface ReactiveContextValue {
  scrollY: any; // Reanimated SharedValue
  direction: Direction;
  directionShared: SharedValue<Direction>; // Reanimated SharedValue for UI thread
  isScrolling: boolean;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  setThreshold: (threshold: number) => void;
  setSupportIdle: (supportIdle: boolean) => void;
}

const ReactiveContext = createContext<ReactiveContextValue | null>(null);

export interface ReactiveProviderProps {
  children: ReactNode;
}

/**
 * Auto-Reactive Provider
 *
 * Automatically handles scroll detection. Screens just use context.onScroll.
 * No need to call useReactiveScrollWithProvider in each screen.
 */
export const ReactiveProvider: React.FC<ReactiveProviderProps> = ({
  children,
}) => {
  const scrollY = useSharedValue(0);
  const directionShared = useSharedValue<Direction>("idle");

  const [direction, setDirection] = useState<Direction>("idle");
  const [isScrolling, setIsScrolling] = useState(false);
  const [threshold, setThresholdState] = useState(8);
  const [supportIdle, setSupportIdleState] = useState(false);

  const directionRef = useRef<Direction>("idle");
  const isScrollingRef = useRef(false);
  const thresholdRef = useRef(8);

  // Scroll tracking
  const previousYRef = useRef(0);
  const lastTimestampRef = useRef(Date.now());
  const scrollStartYRef = useRef(0);
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (Boolean(threshold)) {
      thresholdRef.current = threshold;
    }
  }, [threshold]);

  const setThreshold = useCallback((newThreshold: number) => {
    setThresholdState(newThreshold);
  }, []);

  const setSupportIdle = useCallback((newSupportIdle: boolean) => {
    setSupportIdleState(newSupportIdle);
  }, []);

  const resetScrollTimeout = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      isUserScrollingRef.current = false;
      directionShared.value = "idle";
      runOnJS(() => {
        isScrollingRef.current = false;
        setIsScrolling(false);
        directionRef.current = "idle";
        setDirection("idle");
      })();
    }, 200);
  }, [directionShared]);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentY = event.nativeEvent.contentOffset.y;
      const contentHeight = event.nativeEvent.contentSize.height;
      const layoutHeight = event.nativeEvent.layoutMeasurement.height;

      const maxScrollY = Math.max(0, contentHeight - layoutHeight);
      const clampedY = Math.max(0, Math.min(currentY, maxScrollY));

      scrollY.value = clampedY;

      const deltaY = clampedY - previousYRef.current;

      if (!isUserScrollingRef.current) {
        isUserScrollingRef.current = true;
        scrollStartYRef.current = clampedY;
      }

      // Detect direction change: if delta changes sign compared to current totalDelta
      const currentTotalDelta = clampedY - scrollStartYRef.current;
      const isDirectionChange =
        (currentTotalDelta > 0 && deltaY < 0) || // Scrolling down but started scrolling up
        (currentTotalDelta < 0 && deltaY > 0) || // Scrolling up but started scrolling down
        (currentTotalDelta === 0 && Math.abs(deltaY) > 0); // At the start and started scrolling

      if (isDirectionChange) {
        scrollStartYRef.current = clampedY;
      }

      // Mark as scrolling
      runOnJS(() => {
        if (!isScrollingRef.current) {
          isScrollingRef.current = true;
          setIsScrolling(true);
        }
      })();

      if (supportIdle) resetScrollTimeout();

      const totalDelta = clampedY - scrollStartYRef.current;
      let newDirection: Direction | null = null;

      if (totalDelta > 0) {
        newDirection = "down";
      } else if (totalDelta < -thresholdRef.current) {
        newDirection = "up";
      }

      if (newDirection && newDirection !== directionRef.current) {
        directionShared.value = newDirection;
        runOnJS(() => {
          directionRef.current = newDirection!;
          setDirection(newDirection!);
        })();
      }

      previousYRef.current = clampedY;
      lastTimestampRef.current = Date.now();
    },
    [resetScrollTimeout, scrollY, directionShared, supportIdle]
  );

  const contextValue: ReactiveContextValue = {
    scrollY,
    direction,
    directionShared,
    isScrolling,
    onScroll,
    setThreshold,
    setSupportIdle,
  };

  return (
    <ReactiveContext.Provider value={contextValue}>
      {children}
    </ReactiveContext.Provider>
  );
};

/**
 * Hook to access reactive scroll context
 */
export const useReactiveContext = (): ReactiveContextValue => {
  const context = useContext(ReactiveContext);
  if (!context) {
    throw new Error("useReactiveContext must be used within ReactiveProvider");
  }
  return context;
};

/**
 * Hook for components that need reactive scroll state
 *
 * @param props - Optional parameters object
 * @param props.threshold - Optional custom threshold for scroll up detection (default: 8)
 *
 * @example
 * // Use default threshold (8)
 * const { direction, onScroll } = useReactiveScroll();
 *
 * @example
 * // Use custom threshold (15)
 * const { direction, onScroll } = useReactiveScroll({ threshold: 15 });
 */
export const useReactiveScroll = (
  props: { threshold?: number; supportIdle?: boolean } = {}
) => {
  const { threshold = 8, supportIdle = false } = props;
  const context = useReactiveContext();

  useEffect(() => {
    if (threshold !== undefined) {
      context.setThreshold(threshold);
    }

    return () => {
      if (threshold !== undefined) {
        context.setThreshold(8);
      }
    };
  }, [threshold, context]);

  useEffect(() => {
    if (supportIdle) {
      context.setSupportIdle(true);
    }

    return () => {
      if (supportIdle) {
        context.setSupportIdle(false);
      }
    };
  }, [supportIdle, context]);

  return context;
};
