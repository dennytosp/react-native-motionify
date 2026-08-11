import { StyleSheet } from 'react-native';
import { COLORS } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 9999,
    elevation: 9999,
    backgroundColor: COLORS.background,
  },
});
