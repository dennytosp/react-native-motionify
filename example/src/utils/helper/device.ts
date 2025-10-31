import { Platform, Dimensions } from "react-native";
import * as Device from "expo-device";

/**
 * Detects if the device supports Dynamic Island
 * Dynamic Island is available on iPhone 14 Pro and newer Pro models
 */
export const hasDynamicIsland = (): boolean => {
  if (Platform.OS !== "ios") {
    return false;
  }

  // Check device model
  const deviceModel = Device.modelName || "";

  // Dynamic Island devices:
  // iPhone 14 Pro, iPhone 14 Pro Max
  // iPhone 15 Pro, iPhone 15 Pro Max, iPhone 15
  // iPhone 16 Pro, iPhone 16 Pro Max, iPhone 16, iPhone 16 Plus
  const dynamicIslandModels = [
    "iPhone 14 Pro",
    "iPhone 14 Pro Max",
    "iPhone 15",
    "iPhone 15 Plus",
    "iPhone 15 Pro",
    "iPhone 15 Pro Max",
    "iPhone 16",
    "iPhone 16 Plus",
    "iPhone 16 Pro",
    "iPhone 16 Pro Max",
  ];

  return dynamicIslandModels.some((model) => deviceModel.includes(model));
};

/**
 * Check if device has notch (iPhone X and newer, except Dynamic Island devices)
 */
export const hasNotch = (): boolean => {
  if (Platform.OS !== "ios") {
    return false;
  }

  const { height, width } = Dimensions.get("window");
  const aspectRatio = height / width;

  // iPhone X and newer have aspect ratio > 2
  // This includes notch devices but also Dynamic Island devices
  return aspectRatio > 2;
};

/**
 * Get device type based on screen size
 */
export const getDeviceType = (): "phone" | "tablet" => {
  const { width } = Dimensions.get("window");
  return width >= 768 ? "tablet" : "phone";
};

/**
 * Check if running on iPhone
 */
export const isIPhone = (): boolean => {
  return Platform.OS === "ios" && getDeviceType() === "phone";
};

/**
 * Check if running on iPad
 */
export const isIPad = (): boolean => {
  return Platform.OS === "ios" && getDeviceType() === "tablet";
};

/**
 * Check if running on Android
 */
export const isAndroid = (): boolean => {
  return Platform.OS === "android";
};
