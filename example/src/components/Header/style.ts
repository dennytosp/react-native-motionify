import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '@/theme';
import { AppStyles } from '@/styles';
import { moderateScale, moderateVerticalScale } from '@/utils/scale';

export const styles = StyleSheet.create({
  wrapperFullHeader: {
    paddingBottom: moderateVerticalScale(16),
  },
  wrapperHeader: {
    ...AppStyles.rowCenterBetween,
  },
  wrapperLeft: {
    ...AppStyles.rowVCenter,
  },
  wrapperLeftIcon: {
    backgroundColor: COLORS.primary,
    paddingVertical: moderateVerticalScale(6),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(20),
    marginRight: moderateScale(16),
  },
  wrapperRight: {
    ...AppStyles.rowVCenter,
  },
  textCenterHeader: {
    right: moderateScale(32),
    flex: 1,
    textAlign: 'center',
  },
});
