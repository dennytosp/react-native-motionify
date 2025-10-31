import { COLORS, FONTS } from "@/theme";
import { moderateScale } from "@/utils/scale";
import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";

const SemiBoldText = (props: TextProps) => {
  return (
    <Text
      allowFontScaling={false}
      {...props}
      style={[styles.text, { color: COLORS.text }, props.style]}
    >
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: FONTS.semibold,
    fontSize: moderateScale(14),
  },
});

export default SemiBoldText;
