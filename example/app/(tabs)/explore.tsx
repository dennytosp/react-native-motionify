import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import {
  useMotionifyValue,
  MotionifyView,
  combineHandlers,
} from "react-native-motionify";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Collapsible } from "@/components/ui/collapsible";

// Sample data for different examples
const scrollViewContent = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  title: `ScrollView Item ${i + 1}`,
  content: `This demonstrates MotionifyView with ScrollView. Item ${
    i + 1
  } shows how the library works with different scroll components.`,
}));

const flatListData = Array.from({ length: 30 }, (_, i) => ({
  id: i.toString(),
  name: `FlatList Item ${i + 1}`,
  description: `Advanced example ${i + 1} with FlatList integration`,
}));

export default function ExploreScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");
  const [activeDemo, setActiveDemo] = useState<
    "scrollview" | "flatlist" | "combined"
  >("scrollview");

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Demo Selector */}
      <ThemedView
        style={[styles.selector, { borderBottomColor: tintColor + "30" }]}
      >
        <ThemedText type="subtitle" style={styles.selectorTitle}>
          MotionifyView Examples
        </ThemedText>
        <View style={styles.selectorButtons}>
          {(["scrollview", "flatlist", "combined"] as const).map((demo) => (
            <Pressable
              key={demo}
              style={[
                styles.selectorButton,
                {
                  backgroundColor:
                    activeDemo === demo ? tintColor : "transparent",
                  borderColor: tintColor,
                },
              ]}
              onPress={() => setActiveDemo(demo)}
            >
              <Text
                style={[
                  styles.selectorButtonText,
                  { color: activeDemo === demo ? "white" : tintColor },
                ]}
              >
                {demo.charAt(0).toUpperCase() + demo.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </ThemedView>

      {/* Demo Content */}
      {activeDemo === "scrollview" && <ScrollViewDemo />}
      {activeDemo === "flatlist" && <FlatListDemo />}
      {activeDemo === "combined" && <CombinedHandlersDemo />}
    </View>
  );
}

// ScrollView Demo
function ScrollViewDemo() {
  const tintColor = useThemeColor({}, "tint");

  const { scrollY, direction, onScroll } = useMotionifyValue({
    threshold: 8,
    onScrollUp: () => console.log("ScrollView: Scrolling up"),
    onScrollDown: () => console.log("ScrollView: Scrolling down"),
  });

  return (
    <View style={styles.demoContainer}>
      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.demoHeader}>
          <ThemedText type="title">ScrollView Demo</ThemedText>
          <ThemedText>
            Scroll to see the header and floating button animate
          </ThemedText>
        </ThemedView>

        {scrollViewContent.map((item) => (
          <Collapsible key={item.id} title={item.title}>
            <ThemedText>{item.content}</ThemedText>
          </Collapsible>
        ))}
      </ScrollView>

      {/* Animated Header */}
      <MotionifyView
        scrollY={scrollY}
        direction={direction}
        hideOn="down"
        showOn="up"
        translateRange={{ from: 0, to: -80 }}
        style={styles.animatedHeader}
      >
        <ThemedView
          style={[styles.headerContent, { backgroundColor: tintColor + "95" }]}
        >
          <ThemedText style={styles.headerText}>
            📜 ScrollView Header
          </ThemedText>
        </ThemedView>
      </MotionifyView>

      {/* Floating Info */}
      <MotionifyView
        scrollY={scrollY}
        direction={direction}
        hideOn="down"
        showOn="up"
        translateRange={{ from: 0, to: 100 }}
        opacityRange={{ from: 0.9, to: 0 }}
        style={styles.floatingInfo}
      >
        <ThemedView
          style={[styles.infoContent, { backgroundColor: tintColor + "20" }]}
        >
          <ThemedText style={styles.infoText}>
            Scroll Y: {Math.round(scrollY.value)}px
          </ThemedText>
        </ThemedView>
      </MotionifyView>
    </View>
  );
}

// FlatList Demo
function FlatListDemo() {
  const tintColor = useThemeColor({}, "tint");

  const { scrollY, direction, onScroll } = useMotionifyValue({
    threshold: 12,
    debounceMs: 50,
  });

  const renderItem = ({ item }: { item: (typeof flatListData)[0] }) => (
    <ThemedView style={[styles.flatListItem, { borderLeftColor: tintColor }]}>
      <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
      <ThemedText style={styles.itemDescription}>{item.description}</ThemedText>
    </ThemedView>
  );

  return (
    <View style={styles.demoContainer}>
      <FlatList
        data={flatListData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Animated Toolbar */}
      <MotionifyView
        scrollY={scrollY}
        direction={direction}
        hideOn="down"
        showOn="up"
        translateRange={{ from: 0, to: -100 }}
        style={styles.toolbar}
      >
        <ThemedView
          style={[styles.toolbarContent, { backgroundColor: tintColor }]}
        >
          <ThemedText style={styles.toolbarText}>
            📋 FlatList Toolbar
          </ThemedText>
          <Pressable
            style={styles.toolbarButton}
            onPress={() => Alert.alert("Toolbar", "Button pressed!")}
          >
            <Text style={styles.toolbarButtonText}>Action</Text>
          </Pressable>
        </ThemedView>
      </MotionifyView>

      {/* Side Panel */}
      <MotionifyView
        scrollY={scrollY}
        direction={direction}
        hideOn="down"
        showOn="up"
        translateRange={{ from: 0, to: 60 }}
        scaleRange={{ from: 1, to: 0.9 }}
        style={styles.sidePanel}
      >
        <ThemedView
          style={[
            styles.sidePanelContent,
            { backgroundColor: tintColor + "15" },
          ]}
        >
          <ThemedText style={styles.sidePanelText}>
            Direction: {direction.value}
          </ThemedText>
        </ThemedView>
      </MotionifyView>
    </View>
  );
}

// Combined Handlers Demo
function CombinedHandlersDemo() {
  const tintColor = useThemeColor({}, "tint");
  const [scrollCount, setScrollCount] = useState(0);

  const {
    scrollY,
    direction,
    onScroll: motionifyHandler,
  } = useMotionifyValue({
    threshold: 5,
  });

  // Custom scroll handler
  const customScrollHandler = () => {
    setScrollCount((prev) => prev + 1);
  };

  // Combine handlers
  const combinedHandler = combineHandlers(
    motionifyHandler,
    customScrollHandler
  );

  return (
    <View style={styles.demoContainer}>
      <ScrollView
        onScroll={combinedHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.demoHeader}>
          <ThemedText type="title">Combined Handlers</ThemedText>
          <ThemedText>
            This demo shows how to combine MotionifyView with your existing
            scroll handlers
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.statsContainer}>
          <ThemedText type="subtitle">Live Stats:</ThemedText>
          <ThemedText>Scroll Events: {scrollCount}</ThemedText>
          <ThemedText>Current Y: {Math.round(scrollY.value)}px</ThemedText>
          <ThemedText>Direction: {direction.value}</ThemedText>
        </ThemedView>

        {Array.from({ length: 15 }, (_, i) => (
          <ThemedView
            key={i}
            style={[styles.combinedItem, { borderColor: tintColor + "30" }]}
          >
            <ThemedText type="defaultSemiBold">
              Combined Example {i + 1}
            </ThemedText>
            <ThemedText>
              This demonstrates how MotionifyView can work alongside your
              existing scroll logic without conflicts. Each scroll event
              increments the counter above.
            </ThemedText>
          </ThemedView>
        ))}
      </ScrollView>

      {/* Multi-effect Animation */}
      <MotionifyView
        scrollY={scrollY}
        direction={direction}
        hideOn="down"
        showOn="up"
        translateRange={{ from: 0, to: 120 }}
        opacityRange={{ from: 1, to: 0.3 }}
        scaleRange={{ from: 1, to: 0.85 }}
        style={styles.multiEffectButton}
      >
        <Pressable
          style={[styles.multiButton, { backgroundColor: tintColor }]}
          onPress={() =>
            Alert.alert("Multi-Effect", `Scroll count: ${scrollCount}`)
          }
        >
          <Text style={styles.multiButtonText}>🎭</Text>
          <Text style={styles.multiButtonLabel}>Multi-Effect</Text>
        </Pressable>
      </MotionifyView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selector: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  selectorTitle: {
    marginBottom: 12,
    textAlign: "center",
  },
  selectorButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  selectorButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  selectorButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  demoContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 80,
    paddingBottom: 120,
    paddingHorizontal: 16,
  },
  flatListContent: {
    paddingTop: 100,
    paddingBottom: 120,
  },
  demoHeader: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  flatListItem: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderLeftWidth: 4,
    borderRadius: 8,
  },
  itemDescription: {
    marginTop: 4,
    opacity: 0.7,
  },
  animatedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  headerContent: {
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  headerText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
  floatingInfo: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  infoContent: {
    padding: 12,
    borderRadius: 8,
  },
  infoText: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "500",
  },
  toolbar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  toolbarContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  toolbarText: {
    color: "white",
    fontWeight: "600",
  },
  toolbarButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  toolbarButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  sidePanel: {
    position: "absolute",
    top: 120,
    right: 16,
  },
  sidePanelContent: {
    padding: 8,
    borderRadius: 8,
  },
  sidePanelText: {
    fontSize: 10,
    fontWeight: "500",
  },
  statsContainer: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    gap: 4,
  },
  combinedItem: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  multiEffectButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
  },
  multiButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  multiButtonText: {
    fontSize: 24,
  },
  multiButtonLabel: {
    color: "white",
    fontSize: 8,
    fontWeight: "600",
    marginTop: 2,
  },
});
