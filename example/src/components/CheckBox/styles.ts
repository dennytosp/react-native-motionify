import { StyleSheet } from 'react-native';
import { COLORS } from '@/theme';
import { MetricsSizes, moderateScale } from '@/utils/scale';

export const styles = StyleSheet.create({
  container: {
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(6),
    marginRight: MetricsSizes.mediumSmall,
  },
  icon: {
    width: moderateScale(12.5),
    height: moderateScale(12.5),
  },
  textErrorWarning: {
    color: COLORS.red,
    marginTop: MetricsSizes.small,
    flex: 1,
  },
});
