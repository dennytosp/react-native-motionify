import React, { memo } from 'react';
import equals from 'react-fast-compare';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { AppStyles } from '@/styles';
import { COLORS } from '@/theme';

interface IndicatorProps {
  visible: boolean;
  children: React.ReactNode;
}

const Indicator = memo((props: IndicatorProps) => {
  const { visible, children } = props;

  if (visible) {
    return (
      <ActivityIndicator
        style={[StyleSheet.absoluteFillObject, AppStyles.columnCenter]}
        color={COLORS.primary}
        size="small"
      />
    );
  }

  return <>{children}</>;
}, equals);

export default Indicator;
