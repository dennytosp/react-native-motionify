import React, {
  useEffect
} from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';

import { AppStyles } from '@/styles';
import { COLORS, Icons } from '@/theme';
import { MetricsSizes } from '@/utils/scale';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Image } from '../Image';
import { styles } from './styles';

interface Props {
  disable?: boolean;
  value?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  renderCustom?: () => React.ReactNode;
  onChange?: () => void;
}

const CheckBox = (props: Props) => {
  const { value, disable, containerStyle, renderCustom, onChange } = props;

  const focusedAnim = useSharedValue(0);

  useEffect(() => {
    focusedAnim.value = withSpring(value ? 1 : 0);
  }, [value]);

  // const onPress = () => {
  //   focusedAnim.value = withSpring(!value ? 1 : 0);
  //   onChange?.();
  // };

  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      focusedAnim.value,
      [0, 1],
      [COLORS.gray300, COLORS.text],
    );

    const opacity = interpolate(
      focusedAnim.value,
      [0, MetricsSizes.large],
      [1, 0],
      Extrapolation.CLAMP,
    );

    return { backgroundColor, opacity };
  });

  const animatedScaleStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      focusedAnim.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ scale }],
    };
  });

  return (
    <>
      <View style={[containerStyle]}>
        <Animated.View style={[styles.container, animatedContainerStyle]}>
          <TouchableOpacity
            disabled={disable}
            activeOpacity={1}
            onPress={onChange}
            style={[AppStyles.fill, AppStyles.columnCenter]}>
            <Animated.View style={[animatedScaleStyle]}>
              <Image source={Icons.tick} style={[styles.icon]} />
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>

        {renderCustom && renderCustom()}
      </View>
    </>
  );
};

// export const CheckBox = memo(CheckBoxComponent, equals);
export default CheckBox;
