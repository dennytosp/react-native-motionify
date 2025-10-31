import { StyleSheet } from 'react-native';
import { moderateScale, width } from '@/utils/scale';
import { COLORS, FONTS } from '@/theme';

export const styles = StyleSheet.create({
  progressBar: {
    width: width - moderateScale(64),
    marginHorizontal: 0,
    justifyContent: 'center',
    position: 'absolute',
  },
  textLogo: {
    fontSize: moderateScale(20),
    textAlign: 'center',
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
});
