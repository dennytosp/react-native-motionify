## React Native Motionify

A lightweight, production-ready toolkit for smooth, scroll-driven UI with Reanimated 3.

- **UI-thread animations** at 60 FPS
- **Automatic direction detection** with threshold
- **Simple context + hooks** API
- **Ready-made components**: motionify views and bottom tab
- **Typed TypeScript API**

---

https://github.com/user-attachments/assets/133b5ddf-9a9a-48a1-9697-ab40de0534a1

---

## Installation

```bash
# npm
npm install react-native-motionify

# yarn
yarn add react-native-motionify

# pnpm
pnpm add react-native-motionify

# bun
bun add react-native-motionify

# peer deps
npm install react-native-reanimated@^3.0.0
```

Follow Reanimated 3 setup: `https://docs.swmansion.com/react-native-reanimated/docs/3.x/fundamentals/getting-started`.

---

## Quick Start

```tsx
import { MotionifyProvider } from "react-native-motionify";

export default function App() {
  return (
    <MotionifyProvider threshold={8} supportIdle={false}>
      <YourApp />
    </MotionifyProvider>
  );
}
```

```tsx
import { ScrollView, Text, View } from "react-native";
import { useMotionify } from "react-native-motionify";

function Screen() {
  const { onScroll, direction } = useMotionify();
  return (
    <ScrollView onScroll={onScroll} scrollEventThrottle={16}>
      <Text>Direction: {direction}</Text>
      <View style={{ height: 2000 }} />
    </ScrollView>
  );
}
```

```tsx
import { MotionifyBottomTab } from "react-native-motionify";

function AppShell() {
  return (
    <>
      <Screen />
      <MotionifyBottomTab hideOn="down" translateRange={{ from: 0, to: 80 }}>
        <TabBar />
      </MotionifyBottomTab>
    </>
  );
}
```

### Important: wire onScroll in every scrollable screen

Any screen that participates in motionify behavior must attach the `onScroll` from `useMotionify()` to its `ScrollView`/`FlatList`/`SectionList` and set `scrollEventThrottle={16}`.

```tsx
// ScrollView example
const { onScroll } = useMotionify();

<ScrollView onScroll={onScroll} scrollEventThrottle={16} />;
```

```tsx
// FlatList example
const { onScroll } = useMotionify();

<FlatList
  data={items}
  keyExtractor={(it) => it.id}
  renderItem={renderItem}
  onScroll={onScroll}
  scrollEventThrottle={16}
/>;
```

```tsx
// FlashList (shopify/flash-list) example
import { FlashList } from "@shopify/flash-list";
const { onScroll } = useMotionify();

<FlashList
  data={items}
  renderItem={renderItem}
  estimatedItemSize={72}
  onScroll={onScroll}
  scrollEventThrottle={16}
/>;
```

```tsx
// LegendList example
import { LegendList } from "legendapp-ui";
const { onScroll } = useMotionify();

<LegendList
  data={items}
  renderItem={renderItem}
  onScroll={onScroll}
  scrollEventThrottle={16}
/>;
```

### Normal Screen (no bottom tab)

Use this when you only need views to react to scroll (e.g., headers, FABs, content blocks).

```tsx
import { ScrollView } from "react-native";
import {
  MotionifyProvider,
  useMotionify,
  MotionifyView,
} from "react-native-motionify";

function Screen() {
  const { onScroll } = useMotionify();
  return (
    <ScrollView onScroll={onScroll} scrollEventThrottle={16}>
      {/* content */}
      <MotionifyView
        animatedY
        hideOn="down"
        translateRange={{ from: 0, to: 60 }}
      >
        <FAB />
      </MotionifyView>
    </ScrollView>
  );
}

export default function App() {
  return (
    <MotionifyProvider>
      <Screen />
    </MotionifyProvider>
  );
}
```

Note: Attach `onScroll` only once per scrollable container. Child motionify components consume context automatically.

### Bottom Tab Behavior

Use this when you want a bottom tab to hide/show with scroll.

```tsx
import {
  MotionifyProvider,
  MotionifyBottomTab,
  useMotionify,
} from "react-native-motionify";

function Screen() {
  const { onScroll } = useMotionify();
  return (
    <ScrollView onScroll={onScroll} scrollEventThrottle={16}>
      {/* content */}
    </ScrollView>
  );
}

function AppShell() {
  return (
    <>
      <Screen />
      <MotionifyBottomTab hideOn="down" translateRange={{ from: 0, to: 80 }}>
        <TabBar />
      </MotionifyBottomTab>
    </>
  );
}

export default function App() {
  return (
    <MotionifyProvider>
      <AppShell />
    </MotionifyProvider>
  );
}
```

Notes:

- Ensure each screen that should control the tab wires `onScroll`.
- Use `exclude` and `currentId` on `MotionifyBottomTab` to keep the tab visible on specific routes.

---

## API (Essential)

### Provider

`<MotionifyProvider threshold={8} supportIdle={false}>`

- **threshold**: number — pixels to switch direction
- **supportIdle**: boolean — emit `idle` after inactivity

### Hook

`useMotionify(config?)`

Returns:

- **scrollY**: SharedValue<number>
- **direction**: 'up' | 'down' | 'idle'
- **directionShared**: SharedValue<'up' | 'down' | 'idle'>
- **isScrolling**: boolean
- **onScroll**: Scroll handler for `ScrollView`/`FlatList`
- **setThreshold(threshold)**
- **setSupportIdle(enabled)**

Optional config: `{ threshold?: number; supportIdle?: boolean }`

### Components

- `<MotionifyView>`

  - Quick direction-based animations
  - Props: `animatedY?`, `fadeScale?`, `customEffects?`, `hideOn='down'|'up'`, `translateRange={from,to}`, `animationDuration`, `supportIdle`, `easing`

- `<MotionifyViewWithInterpolation>`

  - Interpolate styles from scroll position
  - Props: `interpolations`, `value?`, `customAnimatedStyle?`

- `<MotionifyBottomTab>`

  - Hide/show on scroll
  - Props: `hideOn`, `translateRange`, `animationDuration`, `supportIdle`, `exclude?`, `currentId?`

- `<MotionifyBottomTabWithInterpolation>`
  - Smooth, range-based translation
  - Props: `inputRange`, `outputRange`, `extrapolate`, `scrollValue?`

### Presets & Utils

- `DEFAULTS`: threshold, durations, idle timeout, throttle
- `TRANSLATION_PRESETS`: common ranges (e.g., `BOTTOM_TAB`, `FAB_*`, `HEADER`)
- `INTERPOLATION_PRESETS`: fade/scale/parallax/rotate/sticky presets
- Helpers: `createInterpolation`, `createFadeInterpolation`, `createScaleInterpolation`, `createParallaxInterpolation`, `createRotationInterpolation`, `clamp`, `lerp`, `mapRange`

---

## Examples

### Hide Bottom Tab on Scroll

```tsx
<MotionifyProvider>
  <Screen />
  <MotionifyBottomTab hideOn="down" translateRange={{ from: 0, to: 80 }}>
    <TabBar />
  </MotionifyBottomTab>
</MotionifyProvider>
```

### Parallax Header

```tsx
<MotionifyViewWithInterpolation
  interpolations={{
    translateY: {
      inputRange: [0, 200],
      outputRange: [0, -100],
      extrapolate: "extend",
    },
    opacity: { inputRange: [0, 150, 200], outputRange: [1, 0.5, 0] },
  }}
>
  <Image source={headerImage} />
</MotionifyViewWithInterpolation>
```

### Fade on Scroll

```tsx
const { onScroll } = useMotionify({ threshold: 20 });

<MotionifyView fadeScale hideOn="down" animationDuration={400}>
  <FAB />
</MotionifyView>;
```

### Custom: build your own animations (no Motionify components)

You can skip `MotionifyView`/`MotionifyBottomTab` and drive your own `Animated.*` components using values from the hook.

```tsx
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { useMotionify } from "react-native-motionify";

function CustomScreen() {
  const { onScroll, scrollY, directionShared } = useMotionify();

  const animatedHeaderStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 200],
      [0, -100],
      Extrapolation.CLAMP
    );
    const opacity = directionShared.value === "down" ? 0.7 : 1;
    return { transform: [{ translateY }], opacity };
  });

  return (
    <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16}>
      <Animated.View style={animatedHeaderStyle}>
        <Header />
      </Animated.View>
      <Content />
    </Animated.ScrollView>
  );
}
```

Notes:

- Use `scrollY` and/or `directionShared` to derive your own animations.
- Works with `Animated.ScrollView`, `Animated.FlatList`, or any `Animated.View`.
- Keep worklets light; precompute heavy values outside.

---

## Usage recap

- Wrap your app with `MotionifyProvider` once.
- In each scrollable screen, call `useMotionify()` and wire `onScroll` + `scrollEventThrottle={16}`.
- Choose either:
  - Normal screens: use `MotionifyView` for direction-based effects.
  - Bottom tabs: use `MotionifyBottomTab` (optionally with `exclude`/`currentId`).
  - Fully custom: use `scrollY`/`directionShared` with Reanimated styles.

---

## Performance

- Use `scrollEventThrottle={16}`
- Keep worklets light; precompute heavy values
- Prefer interpolation for smoother motion
- Use `LegendList`, `FlashList` or `FlatList` for long content

---

## Contributing

To contribute to this library:

1. Make changes to the implementation in `react-native-motionify`.
2. Test with various build configurations.
3. Submit pull requests with clear descriptions of changes and benefits.

---

## License

MIT
