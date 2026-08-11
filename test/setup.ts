import { mock } from "bun:test";
import { useRef } from "react";

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
  useSharedValue: <T>(initialValue: T) => {
    const sharedValue = useRef({
      value: initialValue,
      get() {
        return this.value;
      },
      set(value: T) {
        this.value = value;
      },
    });

    return sharedValue.current;
  },
}));
