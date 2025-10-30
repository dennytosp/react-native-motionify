/**
 * MotionifyBottomTab - Bottom tab components that respond to scroll
 *
 * This module provides components specifically designed for bottom navigation
 * bars that hide/show based on scroll behavior. Perfect for tab bars,
 * bottom sheets, and floating action buttons.
 *
 * @packageDocumentation
 */

import React, { useEffect, useRef } from "react";
import type { ViewProps, ViewStyle, StyleProp } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
  interpolate,
  Extrapolation,
  type SharedValue,
  type WithTimingConfig,
} from "react-native-reanimated";
import { useMotionify } from "./MotionifyProvider";
import type { InterpolationConfig } from "./types";

/**
 * Props for MotionifyBottomTab component
 */
export interface MotionifyBottomTabProps extends Omit<ViewProps, "style"> {
  /**
   * Child components to render inside the tab bar
   */
  children?: React.ReactNode;

  /**
   * Style prop for the tab bar container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Direction on which to hide the tab bar
   * @default 'down'
   */
  hideOn?: "down" | "up";

  /**
   * Translation range for hide/show animation
   * Use positive values to move down (typical for bottom tabs)
   * @example { from: 0, to: 100 } - moves 100px down when hiding
   * @default { from: 0, to: 0 }
   */
  translateRange?: {
    from: number;
    to: number;
  };

  /**
   * Animation duration in milliseconds
   * @default 300
   */
  animationDuration?: number;

  /**
   * Enable idle state detection
   * @default false
   */
  supportIdle?: boolean;

  /**
   * Exclude certain routes from motionify behavior
   * Tab bar will remain visible when on these routes
   * @example ['Home', 'Settings']
   */
  exclude?: string[];

  /**
   * Current route identifier (name or key)
   * Used with exclude prop to determine if tab should be motionify
   */
  currentId?: string;
}

/**
 * MotionifyBottomTab - A bottom tab bar that hides/shows based on scroll
 *
 * Specifically optimized for bottom navigation bars. Runs entirely on the
 * UI thread using Reanimated for smooth 60 FPS animations.
 *
 * Features:
 * - Automatic hide/show based on scroll direction
 * - Route exclusion support (keep visible on certain screens)
 * - Configurable animation timing and range
 * - Zero JS thread overhead during animations
 *
 * @example
 * ```tsx
 * // Basic usage
 * <MotionifyBottomTab
 *   hideOn="down"
 *   translateRange={{ from: 0, to: 80 }}
 * >
 *   <MyTabBar />
 * </MotionifyBottomTab>
 *
 * // With route exclusion
 * <MotionifyBottomTab
 *   hideOn="down"
 *   translateRange={{ from: 0, to: 80 }}
 *   exclude={['Home', 'Profile']}
 *   currentId={route.name}
 * >
 *   <MyTabBar />
 * </MotionifyBottomTab>
 *
 * // Custom animation timing
 * <MotionifyBottomTab
 *   hideOn="down"
 *   translateRange={{ from: 0, to: 100 }}
 *   animationDuration={250}
 * >
 *   <MyTabBar />
 * </MotionifyBottomTab>
 * ```
 */
export const MotionifyBottomTab: React.FC<MotionifyBottomTabProps> = ({
  children,
  style,
  hideOn = "down",
  translateRange = { from: 0, to: 0 },
  animationDuration = 300,
  supportIdle = false,
  exclude = [],
  currentId,
  ...restProps
}) => {
  const { directionShared } = useMotionify({ supportIdle });

  // Track previous route ID to detect route changes
  const prevIdRef = useRef<string | undefined>(currentId);
  const idChanged = prevIdRef.current !== currentId;

  useEffect(() => {
    prevIdRef.current = currentId;
  }, [currentId]);

  // Check if current route is excluded
  const isExcluded =
    Array.isArray(exclude) &&
    exclude.length > 0 &&
    currentId !== undefined &&
    exclude.includes(currentId);

  // Timing configuration
  const timingConfig: WithTimingConfig = {
    duration: animationDuration,
  };

  /**
   * Derived value for translateY animation
   * Runs entirely on UI thread using worklets
   */
  const translateY = useDerivedValue(() => {
    "worklet";

    // Always show when route is excluded
    if (isExcluded) {
      return withTiming(translateRange.from, timingConfig);
    }

    // Reset to visible position on route change
    if (idChanged) {
      return withTiming(translateRange.from, timingConfig);
    }

    // Hide when scrolling in hideOn direction
    if (directionShared.value === hideOn) {
      return withTiming(translateRange.to, timingConfig);
    }

    // Show when scrolling in opposite direction
    if (directionShared.value !== hideOn) {
      return withTiming(translateRange.from, timingConfig);
    }

    // Default to visible
    return translateRange.from;
  }, [hideOn, translateRange, isExcluded, idChanged, directionShared]);

  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    return {
      transform: [{ translateY: translateY.value }],
    };
  }, [translateY]);

  return (
    <Animated.View style={[style, animatedStyle]} {...restProps}>
      {children}
    </Animated.View>
  );
};

/**
 * Props for MotionifyBottomTabWithInterpolation component
 */
export interface MotionifyBottomTabWithInterpolationProps
  extends Omit<ViewProps, "style"> {
  /**
   * Child components to render inside the tab bar
   */
  children?: React.ReactNode;

  /**
   * Style prop for the tab bar container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Optional explicit scroll value (overrides provider's scrollY)
   */
  scrollValue?: SharedValue<number>;

  /**
   * Input range for interpolation (scroll positions)
   * @example [0, 100, 200]
   */
  inputRange: number[];

  /**
   * Output range for translateY values
   * @example [0, 0, 80] - stays at 0 until 100px scroll, then moves to 80px
   */
  outputRange: number[];

  /**
   * Extrapolation mode for values outside input range
   * @default 'clamp'
   */
  extrapolate?: "extend" | "identity" | "clamp";
}

/**
 * MotionifyBottomTabWithInterpolation - Advanced bottom tab with interpolation
 *
 * Provides fine-grained control over tab bar animation using scroll position
 * interpolation. Perfect for creating complex behaviors like gradual hiding,
 * threshold-based animations, or parallax effects.
 *
 * @example
 * ```tsx
 * // Gradual hide starting at 100px scroll
 * <MotionifyBottomTabWithInterpolation
 *   inputRange={[0, 100, 200]}
 *   outputRange={[0, 0, 80]}
 *   extrapolate="clamp"
 * >
 *   <MyTabBar />
 * </MotionifyBottomTabWithInterpolation>
 *
 * // Smooth continuous animation
 * <MotionifyBottomTabWithInterpolation
 *   inputRange={[0, 150]}
 *   outputRange={[0, 100]}
 *   extrapolate="extend"
 * >
 *   <MyTabBar />
 * </MotionifyBottomTabWithInterpolation>
 *
 * // Custom scroll value
 * const customScrollY = useSharedValue(0);
 * <MotionifyBottomTabWithInterpolation
 *   scrollValue={customScrollY}
 *   inputRange={[0, 200]}
 *   outputRange={[0, 80]}
 * >
 *   <MyTabBar />
 * </MotionifyBottomTabWithInterpolation>
 * ```
 */
export const MotionifyBottomTabWithInterpolation: React.FC<
  MotionifyBottomTabWithInterpolationProps
> = ({
  children,
  style,
  scrollValue,
  inputRange,
  outputRange,
  extrapolate = "clamp",
  ...restProps
}) => {
  const { scrollY: providerScrollY } = useMotionify();
  const actualScrollValue = scrollValue || providerScrollY;

  // Get extrapolation mode
  const getExtrapolationMode = (): Extrapolation => {
    switch (extrapolate) {
      case "extend":
        return Extrapolation.EXTEND;
      case "identity":
        return Extrapolation.IDENTITY;
      case "clamp":
      default:
        return Extrapolation.CLAMP;
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    "worklet";

    const translateY = interpolate(
      actualScrollValue.value,
      inputRange,
      outputRange,
      getExtrapolationMode()
    );

    return {
      transform: [{ translateY }],
    };
  }, [actualScrollValue, inputRange, outputRange, extrapolate]);

  return (
    <Animated.View style={[style, animatedStyle]} {...restProps}>
      {children}
    </Animated.View>
  );
};

/**
 * Export types for external use
 */
export type { InterpolationConfig };
