import { ExpoConfig } from "expo/config";

const appVersion = "1.0.0";
const appName = "Taskify";
const appId = "com.denny.taskify";
const appScheme = "taskify";
const appSlug = "taskify";
const buildNumber = 1;
const deploymentTarget = "16.0";
const plugins: ExpoConfig["plugins"] = [];

const appIcon = {
  default: {
    icon: "./assets/icons/app-icon/app-icon.png",
    backgroundColor: "#ffffff",
  },
  dark: {
    icon: "./assets/icons/app-icon/app-icon.png",
    backgroundColor: "#000000",
  },
  ios: {
    light: "./assets/icons/app-icon/app-icon.png",
    dark: "./assets/icons/app-icon/app-icon.png",
    tinted: "./assets/icons/app-icon/app-icon.png",
  },
};

export default (config: ExpoConfig): ExpoConfig => ({
  ...config,
  name: appName,
  slug: appSlug,
  platforms: ["ios", "android"],
  version: appVersion,
  orientation: "portrait",
  icon: appIcon.default.icon,
  scheme: appScheme,
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  runtimeVersion: appVersion,
  ios: {
    icon: {
      light: appIcon.ios.light,
      dark: appIcon.ios.dark,
      tinted: appIcon.ios.tinted,
    },
    supportsTablet: true,
    bundleIdentifier: appId,
    buildNumber: buildNumber.toString(),
    entitlements: {
      "com.apple.developer.networking.wifi-info": true,
    },
    infoPlist: {
      UIBackgroundModes: ["fetch", "remote-notification"],
    },
  },
  android: {
    adaptiveIcon: {
      // backgroundColor: appIcon.default.backgroundColor,
      // foregroundImage: appIcon.default.icon,
      // backgroundImage: appIcon.default.icon,
      // monochromeImage: appIcon.default.icon,
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: appId,
    versionCode: buildNumber,
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    ["react-native-bootsplash", { assetsDir: "./assets/bootsplash" }],
    [
      "expo-build-properties",
      {
        ios: {
          deploymentTarget,
          useFrameworks: "static",
          buildReactNativeFromSource: true,
        },
      },
    ],
    [
      "expo-font",
      {
        fonts: [
          "./assets/fonts/Poppins-Black.otf",
          "./assets/fonts/Poppins-Bold.otf",
          "./assets/fonts/Poppins-Italic.otf",
          "./assets/fonts/Poppins-Light.otf",
          "./assets/fonts/Poppins-Medium.otf",
          "./assets/fonts/Poppins-Regular.otf",
          "./assets/fonts/Poppins-SemiBold.otf",
          "./assets/fonts/Poppins-Thin.otf",
        ],
      },
    ],
    ...plugins,
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
    buildCacheProvider: {
      plugin: "eas-local-cache",
    },
  },
});
