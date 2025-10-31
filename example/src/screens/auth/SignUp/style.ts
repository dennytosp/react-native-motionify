import { StyleSheet } from 'react-native';
import { AppStyles } from '@/styles';
import { COLORS } from '@/theme';
import { moderateScale, moderateVerticalScale, width } from '@/utils/scale';

export const styles = StyleSheet.create({
  container: {
    ...AppStyles.fill,
    backgroundColor: COLORS.white,
    paddingHorizontal: moderateScale(16),
  },
  wrapHeader: {
    marginBottom: moderateScale(24),
  },
  textLets: {
    fontSize: moderateScale(26),
  },
  textTitle: {
    fontSize: moderateScale(26),
    color: COLORS.secondary,
  },
  textAppName: {
    fontSize: moderateScale(40),
    color: COLORS.primary,
  },
  textSubtitle: {
    color: '#53587A',
    fontSize: moderateScale(12),
    opacity: 0.8,
  },
  button: {
    alignSelf: 'center',
    marginTop: moderateVerticalScale(32),
    width: '100%',
    borderRadius: 8,
  },
  wrapForgotPassword: {
    alignItems: 'flex-end',
    marginTop: moderateVerticalScale(12),
  },
  textForgotPassword: {
    fontSize: moderateScale(12),
    color: COLORS.primary,
    opacity: 0.8,
  },
  wrapOr: {
    ...AppStyles.rowCenter,
    marginTop: moderateVerticalScale(36),
  },
  line: {
    height: 2,
    flex: 1,
    backgroundColor: '#ECEDF3',
  },
  textOr: {
    paddingHorizontal: moderateScale(12),
    color: '#A1A5C1',
  },
  touchSocialButton: {
    backgroundColor: '#F5F4F8',
    marginTop: moderateVerticalScale(32),
    padding: moderateScale(16),
    borderRadius: 60,
  },
  iconSocial: {
    width: moderateScale(32),
  },
  textAlreadyHaveAnAccount: {
    fontSize: moderateScale(12),
    color: COLORS.grey,
  },
  textSignUp: {
    fontSize: moderateScale(12),
    color: COLORS.primary,
  },
});
