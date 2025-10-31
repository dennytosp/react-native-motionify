import { StyleSheet } from 'react-native';
import { AppStyles } from '@/styles';
import { COLORS, FONTS } from '@/theme';
import { moderateScale, moderateVerticalScale } from '@/utils/scale';

export const styles = StyleSheet.create({
  container: {
    ...AppStyles.fill,
    backgroundColor: COLORS.white,
    paddingHorizontal: moderateScale(16),
  },
  textCurrentTime: {
    fontSize: moderateScale(16),
  },
  wrapperSearchInput: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    marginTop: moderateVerticalScale(16),
    ...AppStyles.rowCenterBetween,
    padding: moderateScale(16),
  },
  searchInput: {
    fontFamily: FONTS.regular,
    fontSize: moderateScale(12),
    flex: 1,
    padding: 0,
  },
});
