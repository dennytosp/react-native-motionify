import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/theme';
import React from 'react';
import { styles } from './style';
import { SemiBoldText } from '../Text';
import { moderateScale } from '@/utils/scale';

type Props = {
  title: string;
  onPress?: () => void;
  outline?: boolean;
  isOriginal?: boolean;
  textButtonStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
};

const Button = (props: Props) => {
  const {
    title,
    onPress,
    outline,
    isOriginal = false,
    textButtonStyle,
    style,
  } = props;
  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.wrapperButton,
        outline ? styles.outline : styles.shadow,
        !isOriginal && { width: moderateScale(168) },
        style,
      ]}>
      <SemiBoldText
        style={[
          styles.textButton,
          outline && { color: COLORS.grey },
          textButtonStyle,
        ]}>
        {title}
      </SemiBoldText>
    </TouchableOpacity>
  );
};

export default Button;
