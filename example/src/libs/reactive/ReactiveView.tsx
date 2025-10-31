import React from "react";
import { StyleProp, ViewProps, ViewStyle } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  withTiming,
  EasingFunction,
  EasingFunctionFactory,
} from "react-native-reanimated";
import { useReactiveScroll } from "./ReactiveProvider";
import { Direction } from "./types";

export interface ReactiveViewProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  pointerEvents?: ViewProps["pointerEvents"];
  testID?: string;

  // Animation control props
  animatedY?: boolean;
  fadeScale?: boolean;
  customEffects?: (direction: Direction) => ViewStyle;

  // Configuration props (similar to ReactiveBottomTab)
  hideOn?: "down" | "up"; // default: 'down'
  translateRange?: { from: number; to: number }; // e.g., { from: 0, to: 100 }
  animationDuration?: number; // default: 300ms
  supportIdle?: boolean; // default: false
  /** Easing function for withTiming (default: undefined, linear). Example: Easing.out(Easing.ease) */
  easing?: EasingFunction | EasingFunctionFactory;
}

/**
 * ReactiveView - An Animated.View that automatically reacts to scroll direction
 *
 * This component behaves like a regular Animated.View but can automatically
 * apply reactive animations based on scroll direction from ReactiveProvider.
 * It only activates when used inside a ReactiveProvider.
 *
 * @example
 * ```tsx
 * <ReactiveProvider>
 *   <ScrollView onScroll={onScroll}>
 *     <ReactiveView
 *       animatedY
 *       hideOn="down"
 *       translateRange={{ from: 0, to: 50 }}
 *     >
 *       <Text>This view slides up when scrolling down</Text>
 *     </ReactiveView>
 *   </ScrollView>
 * </ReactiveProvider>
 * ```
 *
 * @example
 * ```tsx
 * <ReactiveView
 *   fadeScale
 *   hideOn="down"
 *   animationDuration={400}
 * >
 *   <Text>This view fades and scales when scrolling down</Text>
 * </ReactiveView>
 * ```
 *
 * @example
 * ```tsx
 * <ReactiveView
 *   customEffects={(direction) => ({
 *     opacity: direction === "down" ? 0.3 : 1,
 *     transform: [{ rotate: direction === "down" ? "10deg" : "0deg" }],
 *   })}
 * >
 *   <Text>Custom animation based on direction</Text>
 * </ReactiveView>
 * ```
 */
export const ReactiveView: React.FC<ReactiveViewProps> = ({
  children,
  style,
  pointerEvents,
  testID,
  animatedY,
  fadeScale,
  customEffects,
  hideOn = "down",
  translateRange = { from: 0, to: 160 },
  animationDuration = 300,
  supportIdle,
  easing,
  ...restProps
}) => {
  const { directionShared } = useReactiveScroll({ supportIdle });

  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    if (!directionShared) return {};
    const animatedStyles: Record<
      string,
      number | string | undefined | ViewStyle["transform"]
    > = {};
    const transform: NonNullable<ViewStyle["transform"]> = [];

    if (animatedY) {
      const withTimingConfig = {
        duration: animationDuration,
        ...(easing ? { easing } : {}),
      };
      const translateY =
        directionShared.value === hideOn
          ? withTiming(translateRange.to, withTimingConfig)
          : withTiming(translateRange.from, withTimingConfig);

      if (Array.isArray(transform)) transform.push({ translateY });
    }

    if (fadeScale) {
      const withTimingConfig = {
        duration: animationDuration,
        ...(easing ? { easing } : {}),
      };
      const isHidden = directionShared.value === hideOn;
      animatedStyles.opacity = withTiming(isHidden ? 0 : 1, withTimingConfig);
      if (Array.isArray(transform)) {
        transform.push({
          scale: withTiming(isHidden ? 0.9 : 1, withTimingConfig),
        });
      }
    }
    if (transform.length > 0) {
      animatedStyles.transform = transform as ViewStyle["transform"];
    }

    // Apply optional custom effects inside the worklet to avoid reading shared values during render
    if (customEffects) {
      // Note: for best performance, define customEffects as a worklet if it performs calculations
      const extra = customEffects(directionShared.value);
      Object.assign(animatedStyles, extra);
    }
    return animatedStyles;
  }, [
    animatedY,
    fadeScale,
    hideOn,
    translateRange.from,
    translateRange.to,
    animationDuration,
    easing,
    // do not depend on directionShared.value to avoid reading during render
    directionShared,
  ]);

  const combinedStyle: StyleProp<ViewStyle> = [style, animatedStyle];

  return (
    <Animated.View
      style={combinedStyle}
      pointerEvents={pointerEvents}
      testID={testID}
      {...restProps}
    >
      {children}
    </Animated.View>
  );
};

/**
 * ReactiveViewWithInterpolation - A more advanced version that uses interpolation
 *
 * This version allows for more complex animations using scroll value interpolation.
 * It automatically uses scrollY from ReactiveProvider if not explicitly provided.
 *
 * @example
 * ```tsx
 * <ReactiveProvider>
 *   <ScrollView onScroll={onScroll}>
 *     <ReactiveViewWithInterpolation
 *       interpolations={{
 *         opacity: {
 *           inputRange: [0, 100, 200],
 *           outputRange: [1, 0.5, 0],
 *           extrapolate: 'clamp'
 *         },
 *         translateY: {
 *           inputRange: [0, 100],
 *           outputRange: [0, -50],
 *           extrapolate: 'extend'
 *         },
 *         scale: {
 *           inputRange: [0, 200],
 *           outputRange: [1, 0.8],
 *           extrapolate: 'clamp'
 *         }
 *       }}
 *     >
 *       <Text>Content with smooth interpolated animations</Text>
 *     </ReactiveViewWithInterpolation>
 *   </ScrollView>
 * </ReactiveProvider>
 * ```
 */
export interface InterpolationConfig {
  inputRange: number[];
  outputRange: number[] | string[];
  extrapolate?: "extend" | "identity" | "clamp";
}

export interface ReactiveViewWithInterpolationProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  value?: SharedValue<number>; // Optional: explicit scroll value (overrides provider)
  pointerEvents?: "box-none" | "none" | "box-only" | "auto";
  testID?: string;
  interpolations?: {
    opacity?: InterpolationConfig;
    translateX?: InterpolationConfig;
    translateY?: InterpolationConfig;
    scale?: InterpolationConfig;
    scaleX?: InterpolationConfig;
    scaleY?: InterpolationConfig;
    rotate?: InterpolationConfig;
  };
  customAnimatedStyle?: (scrollValue: number) => ViewStyle;
  /** (Optional) Easing function for timing-based custom transitions */
  easing?: EasingFunction | EasingFunctionFactory;
}

export const ReactiveViewWithInterpolation: React.FC<
  ReactiveViewWithInterpolationProps
> = ({
  children,
  style,
  value: explicitValue,
  interpolations,
  customAnimatedStyle,
  pointerEvents,
  testID,
  easing,
  ...restProps
}) => {
  // Try to get scrollY from provider if not explicitly provided
  const { scrollY } = useReactiveScroll();

  // Create animated style using Reanimated
  const animatedStyle = useAnimatedStyle(() => {
    "worklet";

    if (!scrollY) {
      return {};
    }

    const animatedStyles: Record<
      string,
      number | string | undefined | ViewStyle["transform"]
    > = {};
    const transform = [];

    if (interpolations?.opacity) {
      const config = interpolations.opacity;
      const extrapolateMode =
        config.extrapolate === "extend"
          ? Extrapolation.EXTEND
          : config.extrapolate === "identity"
            ? Extrapolation.IDENTITY
            : Extrapolation.CLAMP;

      animatedStyles.opacity = interpolate(
        scrollY.value,
        config.inputRange,
        config.outputRange as number[],
        extrapolateMode
      );
    }

    // Handle transforms
    if (interpolations?.translateX) {
      const config = interpolations.translateX;
      const extrapolateMode =
        config.extrapolate === "extend"
          ? Extrapolation.EXTEND
          : config.extrapolate === "identity"
            ? Extrapolation.IDENTITY
            : Extrapolation.CLAMP;

      transform.push({
        translateX: interpolate(
          scrollY.value,
          config.inputRange,
          config.outputRange as number[],
          extrapolateMode
        ),
      });
    }

    if (interpolations?.translateY) {
      const config = interpolations.translateY;
      const extrapolateMode =
        config.extrapolate === "extend"
          ? Extrapolation.EXTEND
          : config.extrapolate === "identity"
            ? Extrapolation.IDENTITY
            : Extrapolation.CLAMP;

      transform.push({
        translateY: interpolate(
          scrollY.value,
          config.inputRange,
          config.outputRange as number[],
          extrapolateMode
        ),
      });
    }

    if (interpolations?.scale) {
      const config = interpolations.scale;
      const extrapolateMode =
        config.extrapolate === "extend"
          ? Extrapolation.EXTEND
          : config.extrapolate === "identity"
            ? Extrapolation.IDENTITY
            : Extrapolation.CLAMP;

      transform.push({
        scale: interpolate(
          scrollY.value,
          config.inputRange,
          config.outputRange as number[],
          extrapolateMode
        ),
      });
    }

    if (interpolations?.scaleX) {
      const config = interpolations.scaleX;
      const extrapolateMode =
        config.extrapolate === "extend"
          ? Extrapolation.EXTEND
          : config.extrapolate === "identity"
            ? Extrapolation.IDENTITY
            : Extrapolation.CLAMP;

      transform.push({
        scaleX: interpolate(
          scrollY.value,
          config.inputRange,
          config.outputRange as number[],
          extrapolateMode
        ),
      });
    }

    if (interpolations?.scaleY) {
      const config = interpolations.scaleY;
      const extrapolateMode =
        config.extrapolate === "extend"
          ? Extrapolation.EXTEND
          : config.extrapolate === "identity"
            ? Extrapolation.IDENTITY
            : Extrapolation.CLAMP;

      transform.push({
        scaleY: interpolate(
          scrollY.value,
          config.inputRange,
          config.outputRange as number[],
          extrapolateMode
        ),
      });
    }

    if (interpolations?.rotate) {
      const config = interpolations.rotate;
      const extrapolateMode =
        config.extrapolate === "extend"
          ? Extrapolation.EXTEND
          : config.extrapolate === "identity"
            ? Extrapolation.IDENTITY
            : Extrapolation.CLAMP;

      const rotateValue = interpolate(
        scrollY.value,
        config.inputRange,
        config.outputRange as number[],
        extrapolateMode
      );

      transform.push({
        rotate: `${rotateValue}deg`,
      });
    }

    // Add transform array if we have transforms
    if (transform.length > 0) {
      animatedStyles.transform = transform;
    }

    // Handle custom animated style (advanced usage)
    if (customAnimatedStyle) {
      const customStyles = customAnimatedStyle(scrollY.value);
      Object.assign(animatedStyles, customStyles);
    }

    return animatedStyles;
  }, [interpolations, customAnimatedStyle, easing]);

  const combinedStyle = [style, animatedStyle];

  return (
    <Animated.View
      style={combinedStyle}
      pointerEvents={pointerEvents}
      testID={testID}
      {...restProps}
    >
      {children}
    </Animated.View>
  );
};
