/**
 * MotionifyView - Animated view components that respond to scroll
 *
 * This module provides two variants of motionify view components:
 * 1. MotionifyView - Direction-based animations (hide/show based on scroll direction)
 * 2. MotionifyViewWithInterpolation - Scroll position-based interpolated animations
 *
 * @packageDocumentation
 */

import React from "react";
import type { ViewProps, ViewStyle, StyleProp } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
  type SharedValue,
  type WithTimingConfig,
  type EasingFunction,
} from "react-native-reanimated";
import { useMotionify } from "./MotionifyProvider";
import type { Direction, InterpolationConfig, TransformStyle } from "./types";

/**
 * Props for MotionifyView component
 */
export interface MotionifyViewProps extends Omit<ViewProps, "style"> {
  /**
   * Child components to render inside the animated view
   */
  children?: React.ReactNode;

  /**
   * Style prop (can include both static and animated styles)
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Enable translateY animation based on scroll direction
   * @default false
   */
  animatedY?: boolean;

  /**
   * Enable fade and scale animation based on scroll direction
   * @default false
   */
  fadeScale?: boolean;

  /**
   * Custom function to generate animated styles based on direction
   * Runs as a worklet on the UI thread for optimal performance
   */
  customEffects?: (direction: Direction) => Partial<ViewStyle>;

  /**
   * Direction on which to hide the component
   * @default 'down'
   */
  hideOn?: "down" | "up";

  /**
   * Translation range for hide/show animation
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

  /**
   * Easing function for timing animations
   * @example Easing.out(Easing.ease)
   */
  easing?: EasingFunction;
}

/**
 * MotionifyView - An animated view that responds to scroll direction
 *
 * This component automatically applies animations based on scroll direction
 * from the MotionifyProvider. It supports translateY, fade/scale, and custom
 * effects that run entirely on the UI thread for 60 FPS performance.
 *
 * @example
 * ```tsx
 * // Simple translateY animation
 * <MotionifyView
 *   animatedY
 *   hideOn="down"
 *   translateRange={{ from: 0, to: 50 }}
 * >
 *   <Text>Slides up when scrolling down</Text>
 * </MotionifyView>
 *
 * // Fade and scale animation
 * <MotionifyView
 *   fadeScale
 *   hideOn="down"
 *   animationDuration={400}
 * >
 *   <Text>Fades out when scrolling down</Text>
 * </MotionifyView>
 *
 * // Custom effects
 * <MotionifyView
 *   customEffects={(direction) => ({
 *     opacity: direction === "down" ? 0.3 : 1,
 *     transform: [{ rotate: direction === "down" ? "10deg" : "0deg" }],
 *   })}
 * >
 *   <Text>Custom animation</Text>
 * </MotionifyView>
 * ```
 */
export const MotionifyView: React.FC<MotionifyViewProps> = ({
  children,
  style,
  animatedY = false,
  fadeScale = false,
  customEffects,
  hideOn = "down",
  translateRange = { from: 0, to: 160 },
  animationDuration = 300,
  supportIdle = false,
  easing,
  ...restProps
}) => {
  const { directionShared } = useMotionify({ supportIdle });

  const animatedStyle = useAnimatedStyle(() => {
    "worklet";

    const animatedStyles: Record<
      string,
      number | string | undefined | ViewStyle["transform"]
    > = {};
    const transform: TransformStyle[] = [];

    // Timing configuration
    const timingConfig: WithTimingConfig = {
      duration: animationDuration,
      ...(easing && { easing }),
    };

    // TranslateY animation
    if (animatedY) {
      const shouldHide = directionShared.value === hideOn;
      const translateY = withTiming(
        shouldHide ? translateRange.to : translateRange.from,
        timingConfig
      );
      transform.push({ translateY });
    }

    // Fade and scale animation
    if (fadeScale) {
      const shouldHide = directionShared.value === hideOn;
      animatedStyles.opacity = withTiming(shouldHide ? 0 : 1, timingConfig);
      transform.push({
        scale: withTiming(shouldHide ? 0.9 : 1, timingConfig),
      });
    }

    // Apply transform if we have any
    if (transform.length > 0) {
      animatedStyles.transform = transform as ViewStyle["transform"];
    }

    // Apply custom effects (should be defined as a worklet)
    if (customEffects) {
      const customStyles = customEffects(directionShared.value);
      Object.assign(animatedStyles, customStyles);
    }

    return animatedStyles;
  }, [
    animatedY,
    fadeScale,
    customEffects,
    hideOn,
    translateRange.from,
    translateRange.to,
    animationDuration,
    easing,
    directionShared,
  ]);

  return (
    <Animated.View style={[style, animatedStyle]} {...restProps}>
      {children}
    </Animated.View>
  );
};

/**
 * Props for MotionifyViewWithInterpolation component
 */
export interface MotionifyViewWithInterpolationProps
  extends Omit<ViewProps, "style"> {
  /**
   * Child components to render inside the animated view
   */
  children?: React.ReactNode;

  /**
   * Style prop (can include both static and animated styles)
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Optional explicit scroll value (overrides provider's scrollY)
   */
  value?: SharedValue<number>;

  /**
   * Interpolation configurations for various animated properties
   */
  interpolations?: {
    opacity?: InterpolationConfig;
    translateX?: InterpolationConfig;
    translateY?: InterpolationConfig;
    scale?: InterpolationConfig;
    scaleX?: InterpolationConfig;
    scaleY?: InterpolationConfig;
    rotate?: InterpolationConfig;
  };

  /**
   * Custom animated style function that receives scroll value
   * Runs as a worklet on the UI thread
   */
  customAnimatedStyle?: (scrollValue: number) => Partial<ViewStyle>;
}

/**
 * Helper function to get extrapolation mode
 */
const getExtrapolationMode = (
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
 * MotionifyViewWithInterpolation - Advanced view with scroll-based interpolation
 *
 * This component provides fine-grained control over animations using interpolation
 * of scroll position. Perfect for creating parallax effects, headers that shrink,
 * and other complex scroll-driven animations.
 *
 * All animations run entirely on the UI thread using Reanimated worklets.
 *
 * @example
 * ```tsx
 * // Simple opacity fade
 * <MotionifyViewWithInterpolation
 *   interpolations={{
 *     opacity: {
 *       inputRange: [0, 100, 200],
 *       outputRange: [1, 0.5, 0],
 *       extrapolate: 'clamp'
 *     }
 *   }}
 * >
 *   <Text>Fades as you scroll</Text>
 * </MotionifyViewWithInterpolation>
 *
 * // Parallax effect
 * <MotionifyViewWithInterpolation
 *   interpolations={{
 *     translateY: {
 *       inputRange: [0, 200],
 *       outputRange: [0, -100],
 *       extrapolate: 'extend'
 *     },
 *     scale: {
 *       inputRange: [0, 200],
 *       outputRange: [1, 0.8],
 *       extrapolate: 'clamp'
 *     }
 *   }}
 * >
 *   <Image source={headerImage} />
 * </MotionifyViewWithInterpolation>
 *
 * // Rotation animation
 * <MotionifyViewWithInterpolation
 *   interpolations={{
 *     rotate: {
 *       inputRange: [0, 360],
 *       outputRange: [0, 360],
 *       extrapolate: 'clamp'
 *     }
 *   }}
 * >
 *   <Icon name="refresh" />
 * </MotionifyViewWithInterpolation>
 * ```
 */
export const MotionifyViewWithInterpolation: React.FC<
  MotionifyViewWithInterpolationProps
> = ({
  children,
  style,
  value: explicitValue,
  interpolations,
  customAnimatedStyle,
  ...restProps
}) => {
  // Use explicit value or get from provider
  const { scrollY: providerScrollY } = useMotionify();
  const scrollValue = explicitValue || providerScrollY;

  const animatedStyle = useAnimatedStyle(() => {
    "worklet";

    const animatedStyles: Record<
      string,
      number | string | undefined | ViewStyle["transform"]
    > = {};
    const transform: TransformStyle[] = [];

    // Opacity interpolation
    if (interpolations?.opacity) {
      const { inputRange, outputRange, extrapolate } = interpolations.opacity;
      animatedStyles.opacity = interpolate(
        scrollValue.value,
        inputRange,
        outputRange as number[],
        getExtrapolationMode(extrapolate)
      );
    }

    // TranslateX interpolation
    if (interpolations?.translateX) {
      const { inputRange, outputRange, extrapolate } =
        interpolations.translateX;
      transform.push({
        translateX: interpolate(
          scrollValue.value,
          inputRange,
          outputRange as number[],
          getExtrapolationMode(extrapolate)
        ),
      });
    }

    // TranslateY interpolation
    if (interpolations?.translateY) {
      const { inputRange, outputRange, extrapolate } =
        interpolations.translateY;
      transform.push({
        translateY: interpolate(
          scrollValue.value,
          inputRange,
          outputRange as number[],
          getExtrapolationMode(extrapolate)
        ),
      });
    }

    // Scale interpolation
    if (interpolations?.scale) {
      const { inputRange, outputRange, extrapolate } = interpolations.scale;
      transform.push({
        scale: interpolate(
          scrollValue.value,
          inputRange,
          outputRange as number[],
          getExtrapolationMode(extrapolate)
        ),
      });
    }

    // ScaleX interpolation
    if (interpolations?.scaleX) {
      const { inputRange, outputRange, extrapolate } = interpolations.scaleX;
      transform.push({
        scaleX: interpolate(
          scrollValue.value,
          inputRange,
          outputRange as number[],
          getExtrapolationMode(extrapolate)
        ),
      });
    }

    // ScaleY interpolation
    if (interpolations?.scaleY) {
      const { inputRange, outputRange, extrapolate } = interpolations.scaleY;
      transform.push({
        scaleY: interpolate(
          scrollValue.value,
          inputRange,
          outputRange as number[],
          getExtrapolationMode(extrapolate)
        ),
      });
    }

    // Rotate interpolation
    if (interpolations?.rotate) {
      const { inputRange, outputRange, extrapolate } = interpolations.rotate;
      const rotateValue = interpolate(
        scrollValue.value,
        inputRange,
        outputRange as number[],
        getExtrapolationMode(extrapolate)
      );
      transform.push({ rotate: `${rotateValue}deg` });
    }

    // Apply transform array if we have transforms
    if (transform.length > 0) {
      animatedStyles.transform = transform as ViewStyle["transform"];
    }

    // Apply custom animated style
    if (customAnimatedStyle) {
      const customStyles = customAnimatedStyle(scrollValue.value);
      Object.assign(animatedStyles, customStyles);
    }

    return animatedStyles;
  }, [interpolations, customAnimatedStyle, scrollValue]);

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
