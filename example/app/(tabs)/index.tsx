import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useMotionifyValue, MotionifyView } from "react-native-motionify";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

// Generate sample data
const generateData = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i.toString(),
    title: `Item ${i + 1}`,
    description: `This is the description for item ${
      i + 1
    }. It contains some sample text to demonstrate scrolling behavior.`,
  }));

const data = generateData(50);

export default function MotionifyViewDemo() {
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");

  const { scrollY, direction, isScrollingDown, isScrollingUp, onScroll } =
    useMotionifyValue({
      threshold: 10,
      onScrollUp: () => console.log("📈 Scrolling up!"),
      onScrollDown: () => console.log("📉 Scrolling down!"),
      onDirectionChange: (dir) => console.log("🔄 Direction changed to:", dir),
    });

  const renderItem = ({ item }: { item: (typeof data)[0] }) => (
    <ThemedView style={[styles.item, { borderBottomColor: tintColor + "20" }]}>
      <ThemedText type="defaultSemiBold" style={styles.itemTitle}>
        {item.title}
      </ThemedText>
      <ThemedText style={styles.itemDescription}>{item.description}</ThemedText>
    </ThemedView>
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Main Content */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <MotionifyView
        scrollY={scrollY}
        direction={direction}
        hideOn="down"
        showOn="up"
        translateRange={{ from: 0, to: 150 }}
        scaleRange={{ from: 1, to: 0.8 }}
        opacityRange={{ from: 1, to: 0 }}
        style={styles.fab}
      >
        <Pressable
          style={[styles.fabButton, { backgroundColor: tintColor }]}
          onPress={() => console.log("FAB pressed!")}
        >
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      </MotionifyView>

      {/* Status Bar */}
      <MotionifyView
        scrollY={scrollY}
        direction={direction}
        hideOn="down"
        showOn="up"
        translateRange={{ from: 0, to: -100 }}
        style={styles.statusBar}
      >
        <ThemedView
          style={[
            styles.statusBarContent,
            { backgroundColor: tintColor + "90" },
          ]}
        >
          <ThemedText style={styles.statusText}>
            Direction: {direction.value} | Scrolling:{" "}
            {isScrollingDown.value ? "⬇️" : isScrollingUp.value ? "⬆️" : "⏸️"}
          </ThemedText>
        </ThemedView>
      </MotionifyView>

      {/* Bottom Info Bar */}
      <MotionifyView
        scrollY={scrollY}
        direction={direction}
        hideOn="down"
        showOn="up"
        translateRange={{ from: 0, to: 100 }}
        style={styles.bottomBar}
      >
        <ThemedView
          style={[
            styles.bottomBarContent,
            {
              backgroundColor: tintColor + "10",
              borderTopColor: tintColor + "30",
            },
          ]}
        >
          <ThemedText style={styles.bottomText}>
            Scroll Y: {Math.round(scrollY.value)}px
          </ThemedText>
        </ThemedView>
      </MotionifyView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingTop: 60, // Space for status bar
    paddingBottom: 100, // Space for bottom bar and FAB
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
  },
  itemTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
  fab: {
    position: "absolute",
    bottom: 100,
    right: 20,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  statusBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  statusBarContent: {
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  statusText: {
    fontSize: 12,
    textAlign: "center",
    color: "white",
    fontWeight: "600",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomBarContent: {
    padding: 16,
    borderTopWidth: 1,
  },
  bottomText: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
  },
});
