import { mock } from "bun:test";

/**
 * `react-native-reanimated` pulls in the React Native runtime, which cannot be
 * evaluated outside a native/Metro environment. The pure helpers in `src/utils`
 * only need the `Extrapolation` enum, so we stub it with the same string values
 * Reanimated 3 uses.
 */
mock.module("react-native-reanimated", () => ({
  Extrapolation: {
    CLAMP: "clamp",
    EXTEND: "extend",
    IDENTITY: "identity",
  },
}));
