/**
 * React Native Motionify Scroll
 *
 * A production-ready library for creating motionify scroll-based animations
 * in React Native applications using Reanimated 3.
 *
 * Features:
 * - Automatic scroll direction detection with configurable threshold
 * - Context-based state sharing across components
 * - UI thread animations for 60 FPS performance
 * - Direction-based and interpolation-based animations
 * - Bottom tab components with route exclusion support
 * - TypeScript support with full type safety
 * - Fabric/New Architecture compatible
 * - Zero dependencies (except peer deps)
 *
 * @packageDocumentation
 * @version 2.0.0
 * @author React Native Motionify Scroll Team
 */

// ============================================================================
// Core Provider & Hooks
// ============================================================================

export {
  MotionifyProvider,
  useMotionifyContext,
  useMotionify,
  type MotionifyProviderProps,
} from "./MotionifyProvider";

// ============================================================================
// Motionify View Components
// ============================================================================

export {
  MotionifyView,
  MotionifyViewWithInterpolation,
  type MotionifyViewProps,
  type MotionifyViewWithInterpolationProps,
} from "./MotionifyView";

// ============================================================================
// Bottom Tab Components
// ============================================================================

export {
  MotionifyBottomTab,
  MotionifyBottomTabWithInterpolation,
  type MotionifyBottomTabProps,
  type MotionifyBottomTabWithInterpolationProps,
} from "./MotionifyBottomTab";

// ============================================================================
// Types
// ============================================================================

export type {
  Direction,
  ScrollEventHandler,
  MotionifyConfig,
  InterpolationConfig,
  AnimationConfig,
  TransformStyle,
  MotionifyContextValue,
  HideOnScrollProps,
} from "./types";

// ============================================================================
// Utilities & Constants
// ============================================================================

export {
  DEFAULTS,
  TRANSLATION_PRESETS,
  INTERPOLATION_PRESETS,
  getExtrapolationMode,
  createTranslationRange,
  createInterpolation,
  createFadeInterpolation,
  createScaleInterpolation,
  createParallaxInterpolation,
  createRotationInterpolation,
  clamp,
  lerp,
  mapRange,
} from "./utils";

/**
 * Quick Start Guide
 * =================
 *
 * 1. Wrap your app with MotionifyProvider
 * ---------------------------------------
 * ```tsx
 * import { MotionifyProvider } from 'react-native-motionify';
 *
 * function App() {
 *   return (
 *     <MotionifyProvider threshold={8} supportIdle={false}>
 *       <YourApp />
 *     </MotionifyProvider>
 *   );
 * }
 * ```
 *
 * 2. Use in your screens
 * ----------------------
 * ```tsx
 * import { useMotionify } from 'react-native-motionify';
 *
 * function Screen() {
 *   const { onScroll, direction } = useMotionify();
 *
 *   return (
 *     <ScrollView
 *       onScroll={onScroll}
 *       scrollEventThrottle={16}
 *     >
 *       <Text>Current direction: {direction}</Text>
 *     </ScrollView>
 *   );
 * }
 * ```
 *
 * 3. Add motionify components
 * ---------------------------
 * ```tsx
 * import { MotionifyBottomTab } from 'react-native-motionify';
 *
 * function MyTabBar() {
 *   return (
 *     <MotionifyBottomTab
 *       hideOn="down"
 *       translateRange={{ from: 0, to: 80 }}
 *     >
 *       <TabBarContent />
 *     </MotionifyBottomTab>
 *   );
 * }
 * ```
 *
 * Examples
 * ========
 *
 * Example 1: Basic Bottom Tab
 * ----------------------------
 * ```tsx
 * import { MotionifyProvider, MotionifyBottomTab, useMotionify } from 'react-native-motionify';
 *
 * function App() {
 *   return (
 *     <MotionifyProvider>
 *       <Screen />
 *       <MotionifyBottomTab hideOn="down" translateRange={{ from: 0, to: 80 }}>
 *         <TabBar />
 *       </MotionifyBottomTab>
 *     </MotionifyProvider>
 *   );
 * }
 *
 * function Screen() {
 *   const { onScroll } = useMotionify();
 *   return <ScrollView onScroll={onScroll} scrollEventThrottle={16}>...</ScrollView>;
 * }
 * ```
 *
 * Example 2: Parallax Header
 * --------------------------
 * ```tsx
 * import { MotionifyViewWithInterpolation, useMotionify } from 'react-native-motionify';
 *
 * function ParallaxHeader() {
 *   return (
 *     <MotionifyViewWithInterpolation
 *       interpolations={{
 *         translateY: {
 *           inputRange: [0, 200],
 *           outputRange: [0, -100],
 *           extrapolate: 'extend'
 *         },
 *         opacity: {
 *           inputRange: [0, 150, 200],
 *           outputRange: [1, 0.5, 0],
 *           extrapolate: 'clamp'
 *         }
 *       }}
 *     >
 *       <Image source={headerImage} />
 *     </MotionifyViewWithInterpolation>
 *   );
 * }
 * ```
 *
 * Example 3: Fade on Scroll
 * -------------------------
 * ```tsx
 * import { MotionifyView } from 'react-native-motionify';
 *
 * function FadingElement() {
 *   return (
 *     <MotionifyView
 *       fadeScale
 *       hideOn="down"
 *       animationDuration={300}
 *     >
 *       <Text>Fades when scrolling down</Text>
 *     </MotionifyView>
 *   );
 * }
 * ```
 *
 * Example 4: Using Presets
 * ------------------------
 * ```tsx
 * import {
 *   MotionifyBottomTab,
 *   TRANSLATION_PRESETS,
 *   useMotionify
 * } from 'react-native-motionify';
 *
 * function TabBar() {
 *   return (
 *     <MotionifyBottomTab
 *       hideOn="down"
 *       translateRange={TRANSLATION_PRESETS.BOTTOM_TAB}
 *     >
 *       <TabBarContent />
 *     </MotionifyBottomTab>
 *   );
 * }
 * ```
 *
 * Example 5: Custom Effects
 * -------------------------
 * ```tsx
 * import { MotionifyView } from 'react-native-motionify';
 *
 * function CustomAnimatedView() {
 *   return (
 *     <MotionifyView
 *       customEffects={(direction) => ({
 *         opacity: direction === "down" ? 0.3 : 1,
 *         transform: [
 *           { scale: direction === "down" ? 0.95 : 1 },
 *           { rotate: direction === "down" ? "5deg" : "0deg" }
 *         ],
 *       })}
 *     >
 *       <Content />
 *     </MotionifyView>
 *   );
 * }
 * ```
 *
 * Performance Tips
 * ================
 * - Always use scrollEventThrottle={16} on ScrollView/FlatList for 60 FPS
 * - All animations run on UI thread using Reanimated worklets
 * - Avoid heavy computations in customEffects or customAnimatedStyle
 * - Use memoization for complex children components
 * - Consider using interpolation variants for smoother animations
 *
 * TypeScript Support
 * ==================
 * All components and hooks are fully typed with TypeScript.
 * Import types as needed:
 * ```tsx
 * import type {
 *   Direction,
 *   MotionifyConfig,
 *   InterpolationConfig,
 *   MotionifyViewProps,
 * } from 'react-native-motionify';
 * ```
 */
