import { COLORS } from '@/theme';
import { AppStyles } from '@/styles';
import { StyleSheet } from 'react-native';
import { moderateScale, moderateVerticalScale, width } from '@/utils/scale';

export const styles = StyleSheet.create({
  wrapperButton: {
    ...AppStyles.columnCenter,
    maxWidth: width - moderateScale(16 * 2),
    marginTop: moderateVerticalScale(16),
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: moderateScale(16),
  },
  shadow: {
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: moderateVerticalScale(8),
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textButton: {
    fontSize: moderateScale(14),
    color: COLORS.white,
  },
});
