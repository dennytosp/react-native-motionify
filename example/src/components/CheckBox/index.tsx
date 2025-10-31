import { AppStyles } from "@/styles";
import { COLORS, Icons } from "@/theme";
import { MetricsSizes } from "@/utils/scale";
import React, { memo, useCallback, useEffect, useMemo, useRef } from "react";
import {
  Animated,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Image } from "../Image";
import { styles } from "./styles";

interface Props {
  disable?: boolean;
  value?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  renderCustom?: () => React.ReactNode;
  onChange?: () => void;
}

const CheckBox = ({
  value = false,
  disable,
  containerStyle,
  renderCustom,
  onChange,
}: Props) => {
  const focusedAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(focusedAnim, {
      toValue: value ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [value]);

  const onPress = useCallback(() => {
    if (!disable) {
      onChange?.();
    }
  }, [disable, onChange]);

  const animatedStyles = useMemo(
    () => ({
      backgroundColor: focusedAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [COLORS.gray300, COLORS.text],
        extrapolate: "clamp",
      }),
      scale: focusedAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolate: "clamp",
      }),
      opacity: focusedAnim.interpolate({
        inputRange: [0, MetricsSizes.large],
        outputRange: [disable ? 0.25 : 1, 0],
        extrapolate: "clamp",
      }),
    }),
    [focusedAnim]
  );

  return (
    <View style={[containerStyle]}>
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: animatedStyles.backgroundColor,
            opacity: animatedStyles.opacity,
          },
        ]}
      >
        <TouchableOpacity
          disabled={disable}
          activeOpacity={1}
          onPress={onPress}
          style={[AppStyles.fill, AppStyles.columnCenter]}
        >
          <Animated.View
            style={{
              transform: [
                { scaleX: animatedStyles.scale },
                { scaleY: animatedStyles.scale },
              ],
            }}
          >
            <Image source={Icons.tick} style={styles.icon} />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      {renderCustom?.()}
    </View>
  );
};

export default memo(CheckBox);
