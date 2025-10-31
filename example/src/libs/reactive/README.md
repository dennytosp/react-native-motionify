# Reactive View Library

A mini library for creating reactive UI components that respond to scroll events in React Native applications. Built without Reanimated dependency, using only React Native's built-in Animated API.

## Features

- ✅ Scroll direction detection with configurable threshold
- ✅ Reactive components that respond to animated values
- ✅ Bottom tab components that hide/show based on scroll
- ✅ Optional provider for sharing state across components
- ✅ Fabric/New Architecture compatible
- ✅ TypeScript support with full type safety
- ✅ No Reanimated dependency - uses only React Native's Animated API

## Installation

Since this is an internal library, simply import from the relative path:

```tsx
import { useReactiveScroll, ReactiveBottomTab } from "@/libs/reactive";
```

## Quick Start

### Basic Scroll Tracking

```tsx
import React from "react";
import { ScrollView, Text } from "react-native";
import { useReactiveScroll } from "@/libs/reactive";

const MyScreen = () => {
  const { scrollY, direction, onScroll, isScrolling } = useReactiveScroll({
    threshold: 60, // Change direction after 60px scroll
    enabled: true,
  });

  return (
    <ScrollView onScroll={onScroll} scrollEventThrottle={16}>
      <Text>Direction: {direction}</Text>
      <Text>Is Scrolling: {isScrolling ? "Yes" : "No"}</Text>
      {/* Your content here */}
    </ScrollView>
  );
};
```

### Reactive Bottom Tab

```tsx
import React from "react";
import { ScrollView, View, Text } from "react-native";
import { useReactiveScroll, ReactiveBottomTab } from "@/libs/reactive";

const MyScreen = () => {
  const scroll = useReactiveScroll({ threshold: 60 });

  return (
    <>
      <ScrollView
        onScroll={scroll.onScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {/* Your scrollable content */}
        <View style={{ height: 2000 }}>
          <Text>Scroll down to hide the bottom tab</Text>
        </View>
      </ScrollView>

      <ReactiveBottomTab
        scroll={scroll}
        height={80}
        hideOn="down"
        style={{
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#E5E5E5",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            height: 80,
          }}
        >
          <Text>Home</Text>
          <Text>Search</Text>
          <Text>Profile</Text>
        </View>
      </ReactiveBottomTab>
    </>
  );
};
```

### Using with Provider (Advanced)

```tsx
import React from "react";
import { ScrollView, View, Text } from "react-native";
import {
  ReactiveProvider,
  useReactiveScrollWithProvider,
  ReactiveBottomTab,
} from "@/libs/reactive";

const App = () => (
  <ReactiveProvider>
    <MyScreen />
  </ReactiveProvider>
);

const MyScreen = () => {
  const scroll = useReactiveScrollWithProvider({ threshold: 60 });

  return (
    <>
      <ScrollView
        onScroll={scroll.onScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        <View style={{ height: 2000 }}>
          <Text>Content with shared reactive state</Text>
        </View>
      </ScrollView>

      <ReactiveBottomTab scroll={scroll} height={80}>
        <BottomTabContent />
      </ReactiveBottomTab>
    </>
  );
};
```

### Advanced Interpolation

```tsx
import React from "react";
import { ScrollView, View } from "react-native";
import {
  useReactiveScroll,
  ReactiveViewWithInterpolation,
} from "@/libs/reactive";

const MyScreen = () => {
  const { scrollY, onScroll } = useReactiveScroll();

  return (
    <>
      <ScrollView onScroll={onScroll} scrollEventThrottle={16}>
        <View style={{ height: 2000 }}>{/* Your content */}</View>
      </ScrollView>

      <ReactiveViewWithInterpolation
        value={scrollY}
        style={{
          position: "absolute",
          bottom: 100,
          right: 20,
          width: 60,
          height: 60,
          backgroundColor: "#007AFF",
          borderRadius: 30,
        }}
        interpolations={{
          opacity: {
            inputRange: [0, 100, 200],
            outputRange: [1, 0.5, 0],
            extrapolate: "clamp",
          },
          scale: {
            inputRange: [0, 100],
            outputRange: [1, 0.8],
            extrapolate: "clamp",
          },
        }}
      >
        {/* Floating Action Button */}
      </ReactiveViewWithInterpolation>
    </>
  );
};
```

## API Reference

### `useReactiveScroll(config?)`

Hook for tracking scroll direction and position.

**Parameters:**

- `config.threshold?: number` - Pixels to scroll before changing direction (default: 60)
- `config.initialY?: number` - Initial scroll position (default: 0)
- `config.enabled?: boolean` - Enable/disable tracking (default: true)

**Returns:**

- `scrollY: Animated.Value` - Current scroll position
- `direction: 'up' | 'down' | 'idle'` - Scroll direction
- `onScroll: (event) => void` - Scroll event handler
- `isScrolling: boolean` - Whether currently scrolling

### `ReactiveBottomTab`

Component that hides/shows based on scroll direction.

**Props:**

- `scroll: ReactiveScrollReturn` - Result from useReactiveScroll
- `height?: number` - Tab height (default: 80)
- `hideOn?: 'down' | 'up'` - Direction to hide on (default: 'down')
- `translateRange?: { from: number; to: number }` - Animation range
- `animationDuration?: number` - Animation duration (default: 300ms)
- `style?: ViewStyle | ViewStyle[]` - Custom styles
- `children?: ReactNode` - Tab content

### `ReactiveView`

Animated view that responds to reactive values.

**Props:**

- `value?: Animated.Value` - Animated value to respond to
- `reactiveStyle?: (value: number) => ViewStyle` - Function returning styles
- `style?: ViewStyle | ViewStyle[]` - Base styles
- `children?: ReactNode` - Content

### `ReactiveProvider`

Context provider for sharing reactive state.

**Props:**

- `children: ReactNode` - Child components
- `initialScrollY?: number` - Initial scroll position
- `initialDirection?: 'up' | 'down' | 'idle'` - Initial direction

## Performance Tips

1. **Use `scrollEventThrottle={16}`** for smooth 60fps animations
2. **Enable native driver** - All animations use `useNativeDriver: true`
3. **Optimize threshold** - Higher values reduce direction changes
4. **Use provider** for multiple reactive components sharing state
5. **Memoize scroll handlers** if needed for complex components

## iOS Bounce Handling

The library automatically handles iOS scroll bounce by clamping scroll values:

- Negative scroll values are set to 0
- Values beyond content size are clamped to maximum scroll position

## Android Compatibility

All animations use the native driver and are fully compatible with Android, including proper elevation/shadow handling in `ReactiveBottomTabContainer`.

## TypeScript Support

Full TypeScript support with comprehensive type definitions for all components and hooks.

## Examples

Check the `/examples` folder for complete implementation examples including:

- Basic scroll tracking
- Bottom tab navigation
- Floating action buttons
- Header animations
- Multi-component synchronization

## License

Internal use only - Taskify Project
