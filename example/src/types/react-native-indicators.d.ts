declare module "react-native-indicators" {
  import type { ComponentType } from "react";
  import type { ColorValue, ViewStyle } from "react-native";

  interface IndicatorProps {
    animationDuration?: number;
    color?: ColorValue;
    count?: number;
    size?: number;
    style?: ViewStyle;
    waveFactor?: number;
  }

  export const WaveIndicator: ComponentType<IndicatorProps>;
}
