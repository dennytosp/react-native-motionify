import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { COLORS, FONTS } from '@/theme';
import { moderateScale } from '@/utils/scale';

const RegularText = (props: TextProps) => {
  return (
    <Text
      allowFontScaling={false}
      {...props}
      style={[styles.text, { color: COLORS.text }, props.style]}>
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: FONTS.regular,
    fontSize: moderateScale(14),
  },
});

export default RegularText;
