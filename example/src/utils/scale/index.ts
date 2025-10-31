import { Dimensions } from 'react-native';

export const { width, height } = Dimensions.get('window');

const [shortDimension, longDimension] =
  width < height ? [width, height] : [height, width];

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 393;
const guidelineBaseHeight = 852;
/* 430 932 */

const scale = (size: number) => (shortDimension / guidelineBaseWidth) * size;

const verticalScale = (size: number) =>
  (longDimension / guidelineBaseHeight) * size;

const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const moderateVerticalScale = (size: number, factor = 0.5) =>
  size + (verticalScale(size) - size) * factor;

const tiny = moderateScale(4); // 4
const small = tiny * 2; // 8
const mediumSmall = tiny * 3; // 12
const regular = small * 2; // 16
const icon = regular + tiny; // 20
const large = small * 3; // 24
const big = regular * 2; // 32
const huge = large * 2; // 48

export { scale, verticalScale, moderateScale, moderateVerticalScale };

export const MetricsSizes = {
  tiny,
  small,
  mediumSmall,
  regular,
  icon,
  large,
  big,
  huge,
};
