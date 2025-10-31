import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';

import { getAppState } from '@/stores/slices';
import { useAppSelector } from '@/stores/types';
import { AuthStack, BottomTabStack, OtherStack } from '../stack';
import { RoutesRootStack } from '../routes';
import { AuthStackParamsList } from './auth';
import MainStack, { MainStackParamsList } from './main';

export type RootStackParamList = {
  [RoutesRootStack.AUTH_STACK]:
    | NavigatorScreenParams<AuthStackParamsList>
    | undefined;
  [RoutesRootStack.BOTTOM_TAB_STACK]:
    | NavigatorScreenParams<MainStackParamsList>
    | undefined;
  [RoutesRootStack.MAIN_STACK]:
    | NavigatorScreenParams<MainStackParamsList>
    | undefined;
  [RoutesRootStack.OTHER_STACK]:
    | NavigatorScreenParams<MainStackParamsList>
    | undefined;
};

const Root = createNativeStackNavigator<ReactNavigation.RootParamList>();

const RootStack = () => {
  const { isFirstTimeLaunch } = useAppSelector(getAppState);
  const routeName = isFirstTimeLaunch
    ? RoutesRootStack.OTHER_STACK
    : RoutesRootStack.BOTTOM_TAB_STACK;

  return (
    <Root.Navigator
      initialRouteName={routeName}
      screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Root.Screen
        name={RoutesRootStack.BOTTOM_TAB_STACK}
        component={BottomTabStack}
      />
      <Root.Screen name={RoutesRootStack.AUTH_STACK} component={AuthStack} />
      <Root.Screen name={RoutesRootStack.MAIN_STACK} component={MainStack} />
      <Root.Screen name={RoutesRootStack.OTHER_STACK} component={OtherStack} />
    </Root.Navigator>
  );
};
export default RootStack;
