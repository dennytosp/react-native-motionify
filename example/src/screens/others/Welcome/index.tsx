import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { Button, Image } from '@/components';
import { BoldText, RegularText } from '@/components/Text';
import { RoutesAuthStack, RoutesRootStack } from '@/navigators/routes';
import { appActions } from '@/stores/slices';
import { useAppDispatch } from '@/stores/types';
import { AppStyles } from '@/styles';
import { Icons } from '@/theme';
import { translate } from '@/translations/translate';
import { moderateScale, moderateVerticalScale } from '@/utils/scale';
import { styles } from './style';

type NavigationProps =
  ReactNavigation.RootStackScreenProps<RoutesRootStack.OTHER_STACK>;

const Welcome = () => {
  const navigation = useNavigation<NavigationProps['navigation']>();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const onGetStarted = () => {
    dispatch(appActions.onSetIsFirstTimeLaunch(false));
    navigation.navigate(RoutesRootStack.AUTH_STACK, {
      screen: RoutesAuthStack.SIGN_IN,
    });
  };

  return (
    <View style={[styles.container]}>
      <View style={[AppStyles.columnCenter, styles.wrapperWelcome]}>
        <Image
          source={Icons.logo}
          customStyle={[{ width: moderateScale(136) }]}
        />

        <BoldText style={[styles.textTitle]}>
          {translate('taskify.getStarted.title')}
        </BoldText>
        <BoldText style={[styles.textAppName]}>
          {translate('app.name')}
        </BoldText>
      </View>

      <RegularText style={[styles.textContent]}>
        {translate('taskify.getStarted.content')}
      </RegularText>

      <Button
        title={translate('taskify.getStarted.button')}
        style={[
          styles.button,
          { bottom: moderateVerticalScale(40 + insets.bottom) },
        ]}
        onPress={onGetStarted}
      />
    </View>
  );
};

export default Welcome;
