import React from 'react';
import {
  CommonActions,
  NavigationContainerRef,
  StackActions,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { RootStackParamList } from '@/navigators/stack/root';

const isReadyRef =
  React.createRef<NavigationContainerRef<RootStackParamList>>();

const navigationRef = createNavigationContainerRef<RootStackParamList>();

function navigate<RouteName extends keyof RootStackParamList>(
  ...args: RouteName extends unknown
    ? undefined extends RootStackParamList[RouteName]
      ?
          | [screen: RouteName]
          | [screen: RouteName, params: RootStackParamList[RouteName]]
      : [screen: RouteName, params: RootStackParamList[RouteName]]
    : never
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(...args);
  }
}

function push(...args: any) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push.apply(null, args));
  }
}

function replace(...args: any) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.replace.apply(null, args));
  }
}

function goBack() {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
}

function navigateAndReset(routes = [], index = 0) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index,
        routes,
      }),
    );
  }
}

function navigateAndSimpleReset(name: string, index = 0) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index,
        routes: [{ name }],
      }),
    );
  }
}

export {
  goBack,
  isReadyRef,
  navigate,
  navigateAndReset,
  navigateAndSimpleReset,
  navigationRef,
  push,
  replace,
};
