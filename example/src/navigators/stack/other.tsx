import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RoutesOtherStack } from '../routes';
import { Onboard, Welcome } from '@/screens';

export type OtherStackParamsList = {
  [RoutesOtherStack.ONBOARD]: undefined;
  [RoutesOtherStack.WELCOME]: undefined;
};

const Other = createNativeStackNavigator<OtherStackParamsList>();

const OtherStack = () => {
  return (
    <Other.Navigator
      initialRouteName={RoutesOtherStack.WELCOME}
      screenOptions={{ headerShown: false }}>
      <Other.Screen name={RoutesOtherStack.ONBOARD} component={Onboard} />
      <Other.Screen name={RoutesOtherStack.WELCOME} component={Welcome} />
    </Other.Navigator>
  );
};

export default OtherStack;
