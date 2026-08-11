# Profile Scroll-to-Top Transition Design

## Goal

Make the Profile tab's floating scroll-to-top arrow follow scrolling smoothly without changing the existing Motionify behavior elsewhere on the screen.

## Design

- Render the Profile list with Reanimated's `Animated.ScrollView`.
- Track its native UI-thread offset with `useAnimatedRef` and `useScrollOffset`.
- Pass that shared offset explicitly to the arrow's `MotionifyViewWithInterpolation`.
- Clamp a combined transition over roughly 80–260 px of scroll:
  - opacity: hidden to visible;
  - scale: 0.7 to 1;
  - translateY: 12 to 0.
- Keep the existing `useMotionify` scroll handler attached so the floating header, status cards, and bottom-tab behavior remain unchanged.
- Keep the arrow press behavior: animate the same scroll view back to offset zero.

## Scope

Only `src/screens/core/Profile/index.tsx` should require behavior changes. No navigation, library, or shared animation API changes are planned.

## Verification

- TypeScript type-check passes.
- On iOS Simulator, entering Profile and scrolling through the reveal range produces a continuous arrow transition with no visible jump.
- Scrolling back upward reverses the interpolation smoothly.
- Pressing the visible arrow still animates to the top.
- Existing Profile header and tab-bar reactions continue working.
