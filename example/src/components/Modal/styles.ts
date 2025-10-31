import { StyleSheet } from 'react-native';
import { COLORS } from '@/theme';
import { MetricsSizes } from '@/utils/scale';

export const styles = StyleSheet.create({
  modalStyle: {
    margin: 0,
    padding: 0,
  },
  container: {
    backgroundColor: COLORS.white,
    borderRadius: MetricsSizes.small,
    paddingHorizontal: MetricsSizes.regular,
    paddingVertical: MetricsSizes.regular,
  },
});
