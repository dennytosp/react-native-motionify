import { StyleSheet } from 'react-native';
import { AppStyles } from '@/styles';
import { COLORS } from '@/theme';
import { moderateScale, moderateVerticalScale } from '@/utils/scale';

export const styles = StyleSheet.create({
  container: {
    ...AppStyles.fill,
    ...AppStyles.columnCenter,
    backgroundColor: COLORS.white,
  },
  wrapperWelcome: {},
  textTitle: {
    fontSize: moderateScale(36),
  },
  textAppName: {
    fontSize: moderateScale(40),
    color: COLORS.primary,
  },
  textContent: {
    marginTop: moderateVerticalScale(24),
    textAlign: 'center',
    color: COLORS.grey,
  },
  button: {
    marginTop: 0,
    position: 'absolute',
    bottom: 80,
  },
});
