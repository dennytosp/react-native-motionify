import { BlurView } from "@react-native-community/blur";
import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet } from "react-native";

import { MotionifyBottomTabBar } from "@/components";
import { Categories, Completed, Home, Profile } from "@/screens";
import { translate } from "@/translations/translate";
import { RoutesBottomTabStack } from "../routes";

export type BottomTabStackParamsList = {
  [RoutesBottomTabStack.HOME]: undefined;
  [RoutesBottomTabStack.CATEGORIES]: undefined;
  [RoutesBottomTabStack.PROFILE]: undefined;
  [RoutesBottomTabStack.COMPLETED]: undefined;
};

export type RootTabScreenProps<Screen extends keyof BottomTabStackParamsList> =
  CompositeScreenProps<
    BottomTabScreenProps<BottomTabStackParamsList, Screen>,
    NativeStackScreenProps<BottomTabStackParamsList>
  >;

const Tab = createBottomTabNavigator<BottomTabStackParamsList>();

const BottomTabStack = () => {
  return (
    <Tab.Navigator
      initialRouteName={RoutesBottomTabStack.HOME}
      tabBar={(props) => <MotionifyBottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarBackground: () => (
          <BlurView
            style={[
              {
                ...StyleSheet.absoluteFillObject,
                backgroundColor: "transparent",
              },
            ]}
            blurAmount={10}
          />
        ),
      }}
    >
      <Tab.Screen
        name={RoutesBottomTabStack.HOME}
        component={Home}
        options={{ tabBarLabel: translate("taskify.bottomTab.tab1") }}
      />
      <Tab.Screen
        name={RoutesBottomTabStack.COMPLETED}
        component={Completed}
        options={{ tabBarLabel: translate("taskify.bottomTab.tab2") }}
      />
      <Tab.Screen
        name={RoutesBottomTabStack.CATEGORIES}
        component={Categories}
        options={{ tabBarLabel: translate("taskify.bottomTab.tab3") }}
      />
      <Tab.Screen
        name={RoutesBottomTabStack.PROFILE}
        component={Profile}
        options={{ tabBarLabel: translate("taskify.bottomTab.tab4") }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabStack;
