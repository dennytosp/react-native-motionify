import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { useReactiveScroll } from "./ReactiveProvider";

export interface ReactiveBottomTabProps {
  hideOn?: "down" | "up"; // default: 'down'
  translateRange?: { from: number; to: number }; // e.g., { from: 0, to: 100 }
  children?: React.ReactNode;
  animationDuration?: number; // default: 300ms
  supportIdle?: boolean; // default: false
  testID?: string;
  style?: StyleProp<ViewStyle>;
  /**
   * Exclude certain bottom tab items from reactive behavior.
   * If the current route key or name matches any in this array,
   * the component will ignore direction changes and stay at translateRange.from.
   */
  exclude?: string[];
  /**
   * The current tab identifier to compare with exclude list.
   * Pass either the route key or the route name from the parent.
   */
  currentId?: string;
}

/**
 * ReactiveBottomTab - A bottom tab component that hides/shows based on scroll direction
 *
 * This component automatically animates its position based on the scroll direction
 * from useReactiveScroll. It's perfect for hiding bottom navigation bars when
 * scrolling down and showing them when scrolling up.
 *
 * OPTIMIZED: Runs entirely on UI thread using worklets for 60 FPS performance
 *
 * @example
 * ```tsx
 * <ReactiveProvider>
 *   <ReactiveBottomTab
 *     hideOn="down"
 *     translateRange={{ from: 0, to: 100 }}
 *   >
 *     <BottomTabContent />
 *   </ReactiveBottomTab>
 * </ReactiveProvider>
 * ```
 */
export const ReactiveBottomTab: React.FC<ReactiveBottomTabProps> = ({
  hideOn = "down",
  translateRange = { from: 0, to: 0 },
  children,
  animationDuration = 300,
  supportIdle,
  testID,
  style,
  exclude,
  currentId,
}) => {
  const { directionShared } = useReactiveScroll({ supportIdle });

  const isExcluded =
    Array.isArray(exclude) && exclude.length > 0 && !!currentId
      ? exclude.indexOf(currentId) !== -1
      : false;

  const prevIdRef = React.useRef<string | undefined>(undefined);
  const idChanged = prevIdRef.current !== currentId;
  React.useEffect(() => {
    prevIdRef.current = currentId;
  }, [currentId]);

  const translateY = useDerivedValue(() => {
    "worklet";

    if (isExcluded) {
      return withTiming(translateRange.from, { duration: animationDuration });
    }

    if (idChanged) {
      return withTiming(translateRange.from, { duration: animationDuration });
    }

    if (directionShared.value === hideOn) {
      return withTiming(translateRange.to, { duration: animationDuration });
    }
    if (directionShared.value !== hideOn) {
      return withTiming(translateRange.from, { duration: animationDuration });
    }
    return translateRange.from;
  }, [
    hideOn,
    translateRange.from,
    translateRange.to,
    animationDuration,
    isExcluded,
    idChanged,
  ]);

  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    return { transform: [{ translateY: translateY.value }] };
  }, []);

  return (
    <Animated.View style={[style, animatedStyle]} testID={testID}>
      {children}
    </Animated.View>
  );
};

/**
 * ReactiveBottomTabWithInterpolation - Advanced version using scroll value interpolation
 *
 * This version directly uses the scroll value to create smooth interpolated animations
 * instead of discrete show/hide animations based on direction.
 *
 * @example
 * ```tsx
 * <ReactiveBottomTabWithInterpolation
 *   scrollValue={scrollY}
 *   height={80}
 *   inputRange={[0, 100, 200]}
 *   outputRange={[0, 0, 80]}
 * >
 *   <BottomTabContent />
 * </ReactiveBottomTabWithInterpolation>
 * ```
 */
export interface ReactiveBottomTabWithInterpolationProps {
  scrollValue?: SharedValue<number>;
  inputRange: number[];
  outputRange: number[];
  extrapolate?: "extend" | "identity" | "clamp";
  children?: React.ReactNode;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

export const ReactiveBottomTabWithInterpolation: React.FC<
  ReactiveBottomTabWithInterpolationProps
> = ({
  scrollValue,
  inputRange,
  outputRange,
  extrapolate = "clamp",
  children,
  testID,
  style,
}) => {
  const { scrollY: providerScrollY } = useReactiveScroll();
  const actualScrollValue = scrollValue || providerScrollY;

  const animatedStyle = useAnimatedStyle(() => {
    const extrapolateMode =
      extrapolate === "extend"
        ? Extrapolation.EXTEND
        : extrapolate === "identity"
          ? Extrapolation.IDENTITY
          : Extrapolation.CLAMP;

    const translateY = interpolate(
      actualScrollValue.value,
      inputRange,
      outputRange,
      extrapolateMode
    );

    return { transform: [{ translateY }] };
  });

  return (
    <Animated.View style={[style, animatedStyle]} testID={testID}>
      {children}
    </Animated.View>
  );
};
