import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '@/theme';
import {
  MetricsSizes,
  moderateScale,
  moderateVerticalScale,
} from '@/utils/scale';

export const styles = StyleSheet.create({
  container: {
    marginBottom: MetricsSizes.large,
    justifyContent: 'center',
  },
  titleStyle: {
    color: COLORS.black,
    fontSize: moderateScale(12),
  },
  textInput: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: moderateScale(12),
    marginTop: moderateVerticalScale(0),
    color: COLORS.text,
    padding: 0,
  },
  enabledBorderWidth: {
    borderBottomWidth: moderateScale(1),
    zIndex: 99,
  },
  shadowFocus: {
    shadowOffset: { width: moderateScale(4), height: moderateScale(4) },
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  customStyle: {
    marginLeft: MetricsSizes.tiny,
  },
  textErrorWarning: {
    fontFamily: FONTS.regular,
    fontSize: moderateScale(12),
    color: COLORS.red,
    marginTop: moderateVerticalScale(6),
  },
});
