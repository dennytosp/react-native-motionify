/**
 * Utility functions and constants for React Native Motionify Scroll
 *
 * This module provides helper functions, constants, and utilities
 * that can be used throughout the library or by library consumers.
 *
 * @packageDocumentation
 */

import { Extrapolation } from "react-native-reanimated";
import type { InterpolationConfig } from "./types";

/**
 * Default configuration constants
 */
export const DEFAULTS = {
  /**
   * Default threshold for scroll direction detection (in pixels)
   */
  THRESHOLD: 8,

  /**
   * Default animation duration (in milliseconds)
   */
  ANIMATION_DURATION: 300,

  /**
   * Default timeout for idle state detection (in milliseconds)
   */
  IDLE_TIMEOUT: 200,

  /**
   * Default support for idle state
   */
  SUPPORT_IDLE: false,

  /**
   * Default scroll event throttle (recommended for ScrollView)
   */
  SCROLL_EVENT_THROTTLE: 16,
} as const;

/**
 * Common translation ranges for motionify components
 */
export const TRANSLATION_PRESETS = {
  /**
   * Hide bottom tab bar (typical height: 80px)
   */
  BOTTOM_TAB: {
    from: 0,
    to: 100,
  },

  /**
   * Hide small floating action button
   */
  FAB_SMALL: {
    from: 0,
    to: 60,
  },

  /**
   * Hide large floating action button
   */
  FAB_LARGE: {
    from: 0,
    to: 80,
  },

  /**
   * Hide header (typical height: 60px)
   */
  HEADER: {
    from: 0,
    to: -60,
  },

  /**
   * Hide toolbar (typical height: 56px)
   */
  TOOLBAR: {
    from: 0,
    to: -56,
  },

  /**
   * Slide content slightly (subtle effect)
   */
  SUBTLE: {
    from: 0,
    to: 20,
  },

  /**
   * Slide content moderately
   */
  MODERATE: {
    from: 0,
    to: 50,
  },

  /**
   * Slide content significantly
   */
  SIGNIFICANT: {
    from: 0,
    to: 160,
  },
} as const;

/**
 * Common interpolation configurations
 */
export const INTERPOLATION_PRESETS = {
  /**
   * Fade out as you scroll down
   */
  FADE_OUT: {
    inputRange: [0, 100, 200],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  } as InterpolationConfig,

  /**
   * Fade in as you scroll down
   */
  FADE_IN: {
    inputRange: [0, 100, 200],
    outputRange: [0, 0.5, 1],
    extrapolate: "clamp",
  } as InterpolationConfig,

  /**
   * Scale down as you scroll
   */
  SCALE_DOWN: {
    inputRange: [0, 200],
    outputRange: [1, 0.8],
    extrapolate: "clamp",
  } as InterpolationConfig,

  /**
   * Scale up as you scroll
   */
  SCALE_UP: {
    inputRange: [0, 200],
    outputRange: [0.8, 1],
    extrapolate: "clamp",
  } as InterpolationConfig,

  /**
   * Parallax effect (slow scroll)
   */
  PARALLAX_SLOW: {
    inputRange: [0, 200],
    outputRange: [0, -50],
    extrapolate: "extend",
  } as InterpolationConfig,

  /**
   * Parallax effect (medium scroll)
   */
  PARALLAX_MEDIUM: {
    inputRange: [0, 200],
    outputRange: [0, -100],
    extrapolate: "extend",
  } as InterpolationConfig,

  /**
   * Parallax effect (fast scroll)
   */
  PARALLAX_FAST: {
    inputRange: [0, 200],
    outputRange: [0, -150],
    extrapolate: "extend",
  } as InterpolationConfig,

  /**
   * Rotate 360 degrees over scroll range
   */
  ROTATE_FULL: {
    inputRange: [0, 360],
    outputRange: [0, 360],
    extrapolate: "clamp",
  } as InterpolationConfig,

  /**
   * Sticky header effect (shrink on scroll)
   */
  STICKY_HEADER: {
    inputRange: [0, 100],
    outputRange: [0, -60],
    extrapolate: "clamp",
  } as InterpolationConfig,
} as const;

/**
 * Helper function to convert extrapolate string to Extrapolation enum
 *
 * @param extrapolate - Extrapolation mode as string
 * @returns Reanimated Extrapolation enum value
 */
export const getExtrapolationMode = (
  extrapolate?: "extend" | "identity" | "clamp"
): Extrapolation => {
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

/**
 * Helper function to create custom translation range
 *
 * @param from - Starting position
 * @param to - Ending position
 * @returns Translation range object
 */
export const createTranslationRange = (from: number, to: number) => ({
  from,
  to,
});

/**
 * Helper function to create custom interpolation config
 *
 * @param inputRange - Input range for interpolation
 * @param outputRange - Output range for interpolation
 * @param extrapolate - Extrapolation mode (default: 'clamp')
 * @returns InterpolationConfig object
 */
export const createInterpolation = (
  inputRange: number[],
  outputRange: number[] | string[],
  extrapolate: "extend" | "identity" | "clamp" = "clamp"
): InterpolationConfig => ({
  inputRange,
  outputRange,
  extrapolate,
});

/**
 * Helper function to create fade interpolation
 *
 * @param scrollDistance - Total scroll distance for fade
 * @param fadeIn - Whether to fade in (true) or fade out (false)
 * @returns InterpolationConfig for opacity
 */
export const createFadeInterpolation = (
  scrollDistance: number,
  fadeIn: boolean = false
): InterpolationConfig => ({
  inputRange: [0, scrollDistance / 2, scrollDistance],
  outputRange: fadeIn ? [0, 0.5, 1] : [1, 0.5, 0],
  extrapolate: "clamp",
});

/**
 * Helper function to create scale interpolation
 *
 * @param scrollDistance - Total scroll distance for scale
 * @param fromScale - Starting scale (default: 1)
 * @param toScale - Ending scale (default: 0.8)
 * @returns InterpolationConfig for scale
 */
export const createScaleInterpolation = (
  scrollDistance: number,
  fromScale: number = 1,
  toScale: number = 0.8
): InterpolationConfig => ({
  inputRange: [0, scrollDistance],
  outputRange: [fromScale, toScale],
  extrapolate: "clamp",
});

/**
 * Helper function to create parallax interpolation
 *
 * @param scrollDistance - Total scroll distance
 * @param parallaxFactor - How much to move (0.5 = half speed, 1 = same speed, 2 = double speed)
 * @returns InterpolationConfig for translateY
 */
export const createParallaxInterpolation = (
  scrollDistance: number,
  parallaxFactor: number = 0.5
): InterpolationConfig => ({
  inputRange: [0, scrollDistance],
  outputRange: [0, -scrollDistance * parallaxFactor],
  extrapolate: "extend",
});

/**
 * Helper function to create rotation interpolation
 *
 * @param scrollDistance - Total scroll distance
 * @param rotationDegrees - Total rotation in degrees (default: 360)
 * @returns InterpolationConfig for rotate
 */
export const createRotationInterpolation = (
  scrollDistance: number,
  rotationDegrees: number = 360
): InterpolationConfig => ({
  inputRange: [0, scrollDistance],
  outputRange: [0, rotationDegrees],
  extrapolate: "clamp",
});

/**
 * Clamp a value between min and max
 *
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export const clamp = (value: number, min: number, max: number): number => {
  "worklet";
  return Math.min(Math.max(value, min), max);
};

/**
 * Linear interpolation between two values
 *
 * @param start - Start value
 * @param end - End value
 * @param progress - Progress (0 to 1)
 * @returns Interpolated value
 */
export const lerp = (start: number, end: number, progress: number): number => {
  "worklet";
  return start + (end - start) * progress;
};

/**
 * Map a value from one range to another
 *
 * @param value - Input value
 * @param inputMin - Input range minimum
 * @param inputMax - Input range maximum
 * @param outputMin - Output range minimum
 * @param outputMax - Output range maximum
 * @returns Mapped value
 */
export const mapRange = (
  value: number,
  inputMin: number,
  inputMax: number,
  outputMin: number,
  outputMax: number
): number => {
  "worklet";
  const progress = (value - inputMin) / (inputMax - inputMin);
  return lerp(outputMin, outputMax, progress);
};
