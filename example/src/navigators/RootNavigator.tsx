import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MenuProvider } from "react-native-popup-menu";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { NavigationContainer } from "expo-router/react-navigation";

import { AppStyles } from "@/styles";
import { navigationRef } from "@/utils/holder";
import InitializeApp from "./InitializeApp";
import { RootStack } from "./stack";

const RootNavigator = () => {
  const [navigationReady, setNavigationReady] = useState(false);

  return (
    <GestureHandlerRootView style={[AppStyles.fill]}>
      <MenuProvider>
        <BottomSheetModalProvider>
          <NavigationContainer
            ref={navigationRef}
            onReady={() => setNavigationReady(true)}
          >
            <RootStack />
          </NavigationContainer>
          <InitializeApp navigationReady={navigationReady} />
        </BottomSheetModalProvider>
      </MenuProvider>
    </GestureHandlerRootView>
  );
};

export default RootNavigator;
