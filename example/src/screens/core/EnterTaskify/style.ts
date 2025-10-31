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
    marginTop: moderateVerticalScale(24),
    marginBottom: moderateVerticalScale(32),
    alignItems: 'center',
  },
  textContent: {
    color: '#53587A',
    fontSize: moderateScale(12),
    opacity: 0.8,
  },
  button: {
    alignSelf: 'center',
    marginTop: moderateVerticalScale(32),
    marginBottom: moderateVerticalScale(16),
    width: '100%',
    borderRadius: 8,
  },
});
