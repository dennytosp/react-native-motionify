import { AppStyles } from '@/styles';
import { MetricsSizes, moderateScale } from '@/utils/scale';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {},
  wrapContent: {
    ...AppStyles.rowVCenter,
    paddingVertical: MetricsSizes.regular,
    paddingHorizontal: 0,
  },
  textContent: {
    fontSize: moderateScale(12),
  },
});
