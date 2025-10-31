import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Canvas, RoundedRect, Shadow, LinearGradient, vec } from "@shopify/react-native-skia";
import Animated, {
  useAnimatedStyle,
  useAnimatedProps,
  interpolate,
  SharedValue,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { scale, moderateScale } from "@/utils/scale";
import { COLORS } from "@/theme";

interface DynamicIslandProps {
  scrollY: SharedValue<number>;
  direction: "up" | "down" | "idle";
  isScrolling: boolean;
  topInset: number;
}

/**
 * Dynamic Island Component with Skia
 *
 * Mimics iOS 14 Pro+ Dynamic Island behavior with smooth morphing animations
 * Uses Skia for high-performance rendering of the rounded capsule shape
 */
export const DynamicIsland: React.FC<DynamicIslandProps> = ({
  scrollY,
  direction,
  isScrolling,
  topInset,
}) => {
  // Animated style for the container
  const containerStyle = useAnimatedStyle(() => {
    "worklet";

    const translateY = interpolate(
      scrollY.value,
      [0, 50, 100],
      [0, -10, -80],
      "clamp"
    );

    return {
      transform: [{ translateY }],
    };
  });

  // Animated style for the island morphing
  const islandStyle = useAnimatedStyle(() => {
    "worklet";

    // Morph from expanded to compact when scrolling
    const scaleX = interpolate(
      scrollY.value,
      [0, 30, 60],
      [1, 0.85, 0.7],
      "clamp"
    );

    const scaleY = interpolate(
      scrollY.value,
      [0, 30, 60],
      [1, 0.9, 0.75],
      "clamp"
    );

    return {
      transform: [{ scaleX }, { scaleY }],
    };
  });

  // Animated opacity for content
  const contentOpacity = useAnimatedStyle(() => {
    "worklet";

    const opacity = interpolate(
      scrollY.value,
      [0, 20, 40],
      [1, 0.5, 0],
      "clamp"
    );

    return { opacity };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { paddingTop: topInset },
        containerStyle,
      ]}
    >
      <Animated.View style={[styles.island, islandStyle]}>
        {/* Skia Canvas for the island background */}
        <Canvas style={styles.canvas}>
          <RoundedRect
            x={0}
            y={0}
            width={scale(340)}
            height={scale(60)}
            r={scale(30)}
          >
            <LinearGradient
              start={vec(0, 0)}
              end={vec(scale(340), scale(60))}
              colors={["#0EA5E9", "#38BDF8", "#7DD3FC"]}
            />
            <Shadow dx={0} dy={4} blur={12} color="rgba(14, 165, 233, 0.3)" />
          </RoundedRect>
        </Canvas>

        {/* Island Content */}
        <Animated.View style={[styles.content, contentOpacity]}>
          <View style={styles.leftContent}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={20} color={COLORS.white} />
            </View>
            <View style={styles.textContent}>
              <Text style={styles.name}>John Taskify</Text>
              <Text style={styles.status}>
                {isScrolling ? "Scrolling..." : direction === "up" ? "↑ Scrolling up" : direction === "down" ? "↓ Scrolling down" : "Profile"}
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable style={styles.actionButton} hitSlop={8}>
              <Ionicons name="notifications-outline" size={18} color={COLORS.white} />
            </Pressable>
            <Pressable style={styles.actionButton} hitSlop={8}>
              <Ionicons name="settings-outline" size={18} color={COLORS.white} />
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    alignItems: "center",
    paddingHorizontal: scale(16),
    paddingBottom: scale(12),
  },
  island: {
    width: scale(340),
    height: scale(60),
    position: "relative",
  },
  canvas: {
    position: "absolute",
    top: 0,
    left: 0,
    width: scale(340),
    height: scale(60),
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    paddingVertical: scale(10),
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: scale(12),
  },
  avatar: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  textContent: {
    flex: 1,
  },
  name: {
    fontSize: moderateScale(14),
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: scale(2),
  },
  status: {
    fontSize: moderateScale(11),
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: scale(8),
  },
  actionButton: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
});
