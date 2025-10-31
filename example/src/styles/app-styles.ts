import { StyleSheet } from 'react-native';
import { MetricsSizes } from '../utils/scale';

export const AppStyles = StyleSheet.create({
  // column
  column: {
    flexDirection: 'column',
  },
  columnCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnCenterTop: {
    alignItems: 'center',
  },
  columnCenterBottom: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  columnCenterLeft: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  columnCenterRight: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  columnCenterVertical: {
    justifyContent: 'center',
  },
  // row
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowVCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowCenterTop: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  rowCenterBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rowCenterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowCenterRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  rowCenterBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowTopBetween: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  rowBottomBetween: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  iconSize: {
    width: MetricsSizes.large,
    aspectRatio: 1,
  },
  underline: {
    borderBottomWidth: 1,
    alignSelf: 'flex-start',
  },
  viewShadow: {
    borderColor: 'white',
    shadowOpacity: 0.4,
    shadowRadius: 2,
    shadowOffset: { height: 2, width: 0 },
    elevation: 5,
  },
  fillAbsolute: {
    flex: 1,
    position: 'absolute',
    zIndex: 999,
  },
  override: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    zIndex: 999,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fill: { flex: 1 },
  fullSize: {
    height: '100%',
    width: '100%',
  },
  /* Operation Layout */
  mirror: {
    transform: [{ scaleX: -1 }],
  },
  rotate90: {
    transform: [{ rotate: '90deg' }],
  },
  rotate90Inverse: {
    transform: [{ rotate: '-90deg' }],
  },

  /* Shadow Layout */
  boxShadow: {
    shadowColor: 'black',
    shadowOpacity: 0.09,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});
