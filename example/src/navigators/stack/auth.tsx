import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RoutesAuthStack } from '../routes';
import { ForgotPassword, SignIn, SignUp } from '@/screens';

export type AuthStackParamsList = {
  [RoutesAuthStack.SIGN_IN]: undefined;
  [RoutesAuthStack.SIGN_UP]: undefined;
  [RoutesAuthStack.FORGOT_PASSWORD]: undefined;
};

const Auth = createNativeStackNavigator<AuthStackParamsList>();

const AuthStack = () => {
  return (
    <Auth.Navigator screenOptions={{ headerShown: false }}>
      <Auth.Screen name={RoutesAuthStack.SIGN_IN} component={SignIn} />
      <Auth.Screen name={RoutesAuthStack.SIGN_UP} component={SignUp} />
      <Auth.Screen
        name={RoutesAuthStack.FORGOT_PASSWORD}
        component={ForgotPassword}
      />
    </Auth.Navigator>
  );
};

export default AuthStack;
