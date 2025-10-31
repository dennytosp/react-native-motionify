import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MenuProvider } from "react-native-popup-menu";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { NavigationContainer } from "@react-navigation/native";

import { AppStyles } from "@/styles";
import { navigationRef } from "@/utils/holder";
import InitializeApp from "./InitializeApp";
import { RootStack } from "./stack";

const RootNavigator = () => {
  return (
    <GestureHandlerRootView style={[AppStyles.fill]}>
      <MenuProvider>
        <BottomSheetModalProvider>
          <NavigationContainer ref={navigationRef}>
            <RootStack />
            <InitializeApp />
          </NavigationContainer>
        </BottomSheetModalProvider>
      </MenuProvider>
    </GestureHandlerRootView>
  );
};

export default RootNavigator;
