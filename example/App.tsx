import { I18nextProvider } from "react-i18next";
import "react-native-gesture-handler";

/* Import normal */
import React from "react";
import { MotionifyProvider } from "react-native-motionify";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import RootNavigator from "@/navigators/RootNavigator";
import { persistor, store } from "@/stores";
import i18n from "@/translations/i18n";

if (!__DEV__) {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}

const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <I18nextProvider i18n={i18n}>
            <MotionifyProvider>
              <RootNavigator />
            </MotionifyProvider>
          </I18nextProvider>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
