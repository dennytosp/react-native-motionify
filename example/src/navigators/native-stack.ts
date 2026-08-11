// Expo Router SDK 56+ owns the React Navigation runtime used by the app.
// Keep this compatibility import centralized because native-stack has no
// public codemod target while the app still uses an explicit NavigationContainer.
export { createNativeStackNavigator } from "expo-router/build/react-navigation/native-stack";
export type { NativeStackScreenProps } from "expo-router";
