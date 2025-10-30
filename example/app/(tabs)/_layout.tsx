import { Tabs } from "expo-router";
import React from "react";
import { View, StyleSheet } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MotionifyProvider, MotionifyBottomTab } from "react-native-motionify";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <MotionifyProvider
      threshold={8}
      onGlobalDirectionChange={(direction) => {
        console.log("🌐 Global scroll direction changed to:", direction);
      }}
    >
      <View style={styles.container}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
            headerShown: false,
            tabBarButton: HapticTab,
            tabBarStyle: { display: "none" }, // Hide default tab bar
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              tabBarIcon: ({ color }) => (
                <IconSymbol size={28} name="house.fill" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              title: "Explore",
              tabBarIcon: ({ color }) => (
                <IconSymbol size={28} name="paperplane.fill" color={color} />
              ),
            }}
          />
        </Tabs>

        {/* Custom animated bottom tab bar */}
        <MotionifyBottomTab
          translateRange={{ from: 0, to: 100 }}
          animationConfig={{ duration: 250 }}
          style={styles.customTabBar}
        >
          <View
            style={[
              styles.tabBarContent,
              { backgroundColor: Colors[colorScheme ?? "light"].background },
            ]}
          >
            <View style={styles.tabBarIndicator}>
              <View
                style={[
                  styles.indicator,
                  { backgroundColor: Colors[colorScheme ?? "light"].tint },
                ]}
              />
            </View>
            <View style={styles.tabBarItems}>
              <View style={styles.tabItem}>
                <IconSymbol
                  size={24}
                  name="house.fill"
                  color={Colors[colorScheme ?? "light"].tint}
                />
              </View>
              <View style={styles.tabItem}>
                <IconSymbol
                  size={24}
                  name="paperplane.fill"
                  color={Colors[colorScheme ?? "light"].tabIconDefault}
                />
              </View>
            </View>
          </View>
        </MotionifyBottomTab>
      </View>
    </MotionifyProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  customTabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBarContent: {
    paddingBottom: 34, // Safe area padding
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  tabBarIndicator: {
    alignItems: "center",
    marginBottom: 8,
  },
  indicator: {
    width: 40,
    height: 3,
    borderRadius: 2,
  },
  tabBarItems: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
});
