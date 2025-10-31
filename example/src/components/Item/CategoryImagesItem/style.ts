import { AppStyles } from '@/styles';
import { height, MetricsSizes, moderateScale, width } from '@/utils/scale';
import { StyleSheet } from 'react-native';

const WIDTH_ITEM = (width - moderateScale(40)) / 2;

export const styles = StyleSheet.create({
  container: {},
  wrapContent: {
    ...AppStyles.rowVCenter,
    // paddingVertical: MetricsSizes.regular,
    width: WIDTH_ITEM,
  },
  textContent: {
    fontSize: moderateScale(12),
  },
  image: {
    width: WIDTH_ITEM,
    height: height / 5,
    borderRadius: 6,
  },
});
