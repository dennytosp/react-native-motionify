import React from 'react';
import { ScrollView, StyleProp, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Header from '@/components/Header';
import { translate } from '@/translations/translate';
import { moderateScale } from '@/utils/scale';
import { styles } from './style';

interface Props {
  onPressLeftHeader: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const ScrollModalContainer = (props: Props) => {
  const { onPressLeftHeader, children, style } = props;
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, style]}>
      <Header
        title={translate('taskify.common.chooseCategory')}
        style={[{ paddingHorizontal: moderateScale(16) }]}
        onPressLeft={onPressLeftHeader}
      />
      <ScrollView
        contentContainerStyle={[
          {
            paddingHorizontal: moderateScale(16),
            paddingBottom: insets.bottom,
          },
        ]}
        style={[{}]}>
        {children}
      </ScrollView>
    </View>
  );
};

export default ScrollModalContainer;
