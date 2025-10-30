/**
 * Core Types for React Native Motionify Scroll Library
 *
 * This module contains all shared types used throughout the library.
 * The library provides motionify scroll-based animations using Reanimated 3.
 *
 * @packageDocumentation
 */

import type { Extrapolation, SharedValue } from "react-native-reanimated";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

/**
 * Scroll direction state
 * - 'up': User is scrolling upward
 * - 'down': User is scrolling downward
 * - 'idle': No active scrolling (requires supportIdle to be enabled)
 */
export type Direction = "up" | "down" | "idle";

/**
 * Scroll event handler type for React Native scroll components
 */
export type ScrollEventHandler = (
  event: NativeSyntheticEvent<NativeScrollEvent>
) => void;

/**
 * Configuration options for motionify scroll behavior
 */
export interface MotionifyConfig {
  /**
   * Minimum scroll delta required to trigger direction change (in pixels)
   * Higher values make direction changes less sensitive
   * @default 8
   */
  threshold?: number;

  /**
   * Enable 'idle' direction state when user stops scrolling
   * When enabled, direction becomes 'idle' after 200ms of no scrolling
   * @default false
   */
  supportIdle?: boolean;
}

/**
 * Interpolation configuration for animated properties
 */
export interface InterpolationConfig {
  /**
   * Input range for interpolation (scroll values)
   * @example [0, 100, 200]
   */
  inputRange: number[];

  /**
   * Output range for interpolation (animated values)
   * @example [0, 50, 100] for numbers or ['0deg', '45deg', '90deg'] for strings
   */
  outputRange: number[] | string[];

  /**
   * Extrapolation mode for values outside input range
   * - 'extend': Continue the trend beyond input range
   * - 'clamp': Clamp to nearest output value (default)
   * - 'identity': Return input value as-is
   * @default 'clamp'
   */
  extrapolate?: Extrapolation;
}

/**
 * Animation timing configuration
 */
export interface AnimationConfig {
  /**
   * Animation duration in milliseconds
   * @default 300
   */
  duration?: number;

  /**
   * Easing function for animation
   * @example Easing.out(Easing.ease)
   */
  easing?: any; // Using any to avoid importing Reanimated types here
}

/**
 * Transform style types for type-safe animations
 */
export interface TransformStyle {
  translateX?: number;
  translateY?: number;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  rotate?: string;
  rotateX?: string;
  rotateY?: string;
  rotateZ?: string;
  skewX?: string;
  skewY?: string;
}

/**
 * Internal context value shared by MotionifyProvider
 * @internal
 */
export interface MotionifyContextValue {
  /**
   * Current scroll Y position (Reanimated shared value)
   */
  scrollY: SharedValue<number>;

  /**
   * Current scroll direction (React state, runs on JS thread)
   */
  direction: Direction;

  /**
   * Current scroll direction (Reanimated shared value, runs on UI thread)
   */
  directionShared: SharedValue<Direction>;

  /**
   * Whether user is currently scrolling
   */
  isScrolling: boolean;

  /**
   * Scroll event handler to attach to ScrollView/FlatList
   */
  onScroll: ScrollEventHandler;

  /**
   * Update the threshold value
   */
  setThreshold: (threshold: number) => void;

  /**
   * Enable/disable idle state support
   */
  setSupportIdle: (supportIdle: boolean) => void;
}

/**
 * Props for components that support hiding on scroll direction
 */
export interface HideOnScrollProps {
  /**
   * Direction on which to hide the component
   * @default 'down'
   */
  hideOn?: "down" | "up";

  /**
   * Translation range for hide/show animation
   * @example { from: 0, to: 100 } - translates from 0px to 100px when hiding
   * @default { from: 0, to: 160 }
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
}
