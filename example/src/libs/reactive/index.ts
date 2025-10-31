/**
 * Reactive View Library
 *
 * A mini library for creating reactive UI components that respond to scroll events
 * in React Native applications. Built without Reanimated dependency, using only
 * React Native's built-in Animated API.
 *
 * Features:
 * - Scroll direction detection with configurable threshold
 * - Reactive components that respond to animated values
 * - Bottom tab components that hide/show based on scroll
 * - Optional provider for sharing state across components
 * - Fabric/New Architecture compatible
 * - TypeScript support with full type safety
 *
 * @version 1.0.0
 * @author Taskify Team
 */

// Auto-reactive hooks
export { useReactiveScroll, useReactiveContext } from "./ReactiveProvider";

// Reactive view components
export {
  ReactiveView,
  ReactiveViewWithInterpolation,
  type ReactiveViewProps,
  type ReactiveViewWithInterpolationProps,
  type InterpolationConfig,
} from "./ReactiveView";

// Bottom tab components
export {
  ReactiveBottomTab,
  ReactiveBottomTabWithInterpolation,
  type ReactiveBottomTabProps,
  type ReactiveBottomTabWithInterpolationProps,
} from "./ReactiveBottomTab";

// Auto-reactive provider
export {
  ReactiveProvider,
  type ReactiveProviderProps,
  type ReactiveContextValue,
} from "./ReactiveProvider";

/**
 * Auto-Reactive Library - Clean & Simple
 *
 * @example Auto usage
 * ```tsx
 * // 1. Wrap app with provider
 * <ReactiveProvider threshold={8}>
 *   <App />
 * </ReactiveProvider>
 *
 * // 2. Use in screens (auto-reactive)
 * const { onScroll } = useReactiveScroll();
 * <ScrollView onScroll={onScroll} scrollEventThrottle={16}>
 *   <Content />
 * </ScrollView>
 *
 * // 3. Components auto-react (no props needed)
 * <ReactiveBottomTab hideOn="down">
 *   <TabContent />
 * </ReactiveBottomTab>
 * ```
 */
