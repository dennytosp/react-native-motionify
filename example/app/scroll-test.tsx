import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  SectionList,
  Pressable,
  Alert,
} from "react-native";
import { Stack } from "expo-router";
import {
  useMotionifyValue,
  useGlobalMotionifyValue,
  MotionifyView,
  MotionifyViewAdvanced,
  combineHandlers,
} from "react-native-motionify";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

// Test data
const generateScrollViewData = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    title: `ScrollView Item ${i + 1}`,
    content: `Content for item ${
      i + 1
    }. This is a longer text to demonstrate scrolling behavior with various content lengths.`,
  }));

const generateFlatListData = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i.toString(),
    name: `FlatList Item ${i + 1}`,
    description: `Description for FlatList item ${i + 1}`,
  }));

const generateSectionData = () => [
  {
    title: "Section A",
    data: Array.from({ length: 10 }, (_, i) => ({
      id: `a${i}`,
      name: `A Item ${i + 1}`,
    })),
  },
  {
    title: "Section B",
    data: Array.from({ length: 15 }, (_, i) => ({
      id: `b${i}`,
      name: `B Item ${i + 1}`,
    })),
  },
  {
    title: "Section C",
    data: Array.from({ length: 8 }, (_, i) => ({
      id: `c${i}`,
      name: `C Item ${i + 1}`,
    })),
  },
];

type TestMode =
  | "scrollview"
  | "flatlist"
  | "sectionlist"
  | "global"
  | "advanced";

export default function ScrollTestScreen() {
  const [testMode, setTestMode] = useState<TestMode>("scrollview");
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");

  return (
    <>
      <Stack.Screen options={{ title: "Scroll Test", headerShown: true }} />
      <View style={[styles.container, { backgroundColor }]}>
        {/* Test Mode Selector */}
        <View
          style={[styles.modeSelector, { borderBottomColor: tintColor + "30" }]}
        >
          <ThemedText type="subtitle">Test Mode:</ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.modeScroll}
          >
            {(
              [
                "scrollview",
                "flatlist",
                "sectionlist",
                "global",
                "advanced",
              ] as TestMode[]
            ).map((mode) => (
              <Pressable
                key={mode}
                style={[
                  styles.modeButton,
                  {
                    backgroundColor:
                      testMode === mode ? tintColor : "transparent",
                    borderColor: tintColor,
                  },
                ]}
                onPress={() => setTestMode(mode)}
              >
                <Text
                  style={[
                    styles.modeButtonText,
                    { color: testMode === mode ? "white" : tintColor },
                  ]}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Test Content */}
        {testMode === "scrollview" && <ScrollViewTest />}
        {testMode === "flatlist" && <FlatListTest />}
        {testMode === "sectionlist" && <SectionListTest />}
        {testMode === "global" && <GlobalScrollTest />}
        {testMode === "advanced" && <AdvancedScrollTest />}
      </View>
    </>
  );
}

// ScrollView Test
function ScrollViewTest() {
  const tintColor = useThemeColor({}, "tint");
  const [eventCount, setEventCount] = useState(0);

  const { scrollY, direction, onScroll } = useMotionifyValue({
    threshold: 10,
    onScrollUp: () => console.log("ScrollView: Up"),
    onScrollDown: () => console.log("ScrollView: Down"),
  });

  const customHandler = () => setEventCount((prev) => prev + 1);
  const combinedHandler = combineHandlers(onScroll, customHandler);

  const data = generateScrollViewData(25);

  return (
    <View style={styles.testContainer}>
      <ScrollView
        onScroll={combinedHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.testHeader}>
          <ThemedText type="title">ScrollView Test</ThemedText>
          <ThemedText>
            Events: {eventCount} | Y: {Math.round(scrollY.value)}px
          </ThemedText>
        </ThemedView>

        {data.map((item) => (
          <ThemedView
            key={item.id}
            style={[styles.scrollItem, { borderLeftColor: tintColor }]}
          >
            <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
            <ThemedText style={styles.itemContent}>{item.content}</ThemedText>
          </ThemedView>
        ))}
      </ScrollView>

      {/* Floating Stats */}
      <MotionifyView
        scrollY={scrollY}
        direction={direction}
        hideOn="down"
        showOn="up"
        translateRange={{ from: 0, to: 100 }}
        style={styles.floatingStats}
      >
        <ThemedView
          style={[styles.statsContent, { backgroundColor: tintColor + "90" }]}
        >
          <ThemedText style={styles.statsText}>
            📊 Direction: {direction.value} | Events: {eventCount}
          </ThemedText>
        </ThemedView>
      </MotionifyView>
    </View>
  );
}

// FlatList Test
function FlatListTest() {
  const tintColor = useThemeColor({}, "tint");

  const { scrollY, direction, onScroll } = useMotionifyValue({
    threshold: 15,
    debounceMs: 80,
  });

  const data = generateFlatListData(40);

  const renderItem = ({
    item,
    index,
  }: {
    item: (typeof data)[0];
    index: number;
  }) => (
    <ThemedView
      style={[
        styles.flatListItem,
        {
          backgroundColor: index % 2 === 0 ? "transparent" : tintColor + "05",
          borderLeftColor: tintColor,
        },
      ]}
    >
      <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
      <ThemedText style={styles.itemDescription}>{item.description}</ThemedText>
    </ThemedView>
  );

  return (
    <View style={styles.testContainer}>
      <FlatList
        data={data}
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
        translateRange={{ from: 0, to: -80 }}
        style={styles.toolbar}
      >
        <ThemedView
          style={[styles.toolbarContent, { backgroundColor: tintColor }]}
        >
          <ThemedText style={styles.toolbarText}>
            📋 FlatList Toolbar
          </ThemedText>
          <ThemedText style={styles.toolbarSubtext}>
            Y: {Math.round(scrollY.value)}px
          </ThemedText>
        </ThemedView>
      </MotionifyView>
    </View>
  );
}

// SectionList Test
function SectionListTest() {
  const tintColor = useThemeColor({}, "tint");

  const { scrollY, direction, onScroll } = useMotionifyValue({
    threshold: 8,
  });

  const sections = generateSectionData();

  const renderItem = ({ item }: { item: { id: string; name: string } }) => (
    <ThemedView style={styles.sectionItem}>
      <ThemedText>{item.name}</ThemedText>
    </ThemedView>
  );

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <ThemedView
      style={[styles.sectionHeader, { backgroundColor: tintColor + "20" }]}
    >
      <ThemedText type="defaultSemiBold">{section.title}</ThemedText>
    </ThemedView>
  );

  return (
    <View style={styles.testContainer}>
      <SectionList
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.sectionListContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Side Indicator */}
      <MotionifyView
        scrollY={scrollY}
        direction={direction}
        hideOn="down"
        showOn="up"
        translateRange={{ from: 0, to: 50 }}
        scaleRange={{ from: 1, to: 0.8 }}
        style={styles.sideIndicator}
      >
        <ThemedView
          style={[styles.indicatorContent, { backgroundColor: tintColor }]}
        >
          <ThemedText style={styles.indicatorText}>
            {direction.value === "up"
              ? "⬆️"
              : direction.value === "down"
              ? "⬇️"
              : "⏸️"}
          </ThemedText>
        </ThemedView>
      </MotionifyView>
    </View>
  );
}

// Global Scroll Test
function GlobalScrollTest() {
  const tintColor = useThemeColor({}, "tint");

  const { scrollY, direction, registerHandler } = useGlobalMotionifyValue();
  const [globalEvents, setGlobalEvents] = useState(0);

  React.useEffect(() => {
    const cleanup = registerHandler(() => {
      setGlobalEvents((prev) => prev + 1);
    });
    return cleanup;
  }, [registerHandler]);

  const data = generateScrollViewData(20);

  return (
    <View style={styles.testContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.testHeader}>
          <ThemedText type="title">Global Context Test</ThemedText>
          <ThemedText>
            This uses the global MotionifyProvider context
          </ThemedText>
          <ThemedText>
            Global Events: {globalEvents} | Y: {Math.round(scrollY.value)}px
          </ThemedText>
        </ThemedView>

        {data.map((item) => (
          <ThemedView
            key={item.id}
            style={[styles.scrollItem, { borderLeftColor: tintColor }]}
          >
            <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
            <ThemedText style={styles.itemContent}>{item.content}</ThemedText>
          </ThemedView>
        ))}
      </ScrollView>

      {/* Global Status */}
      <View style={styles.globalStatus}>
        <ThemedView
          style={[styles.statusContent, { backgroundColor: tintColor + "15" }]}
        >
          <ThemedText style={styles.statusText}>
            🌐 Global Direction: {direction.value}
          </ThemedText>
        </ThemedView>
      </View>
    </View>
  );
}

// Advanced Scroll Test
function AdvancedScrollTest() {
  const tintColor = useThemeColor({}, "tint");

  const { scrollY, direction, onScroll } = useMotionifyValue({
    threshold: 5,
  });

  const data = generateScrollViewData(30);

  return (
    <View style={styles.testContainer}>
      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.testHeader}>
          <ThemedText type="title">Advanced Features</ThemedText>
          <ThemedText>Demonstrates MotionifyViewAdvanced component</ThemedText>
        </ThemedView>

        {data.map((item) => (
          <ThemedView
            key={item.id}
            style={[styles.scrollItem, { borderLeftColor: tintColor }]}
          >
            <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
            <ThemedText style={styles.itemContent}>{item.content}</ThemedText>
          </ThemedView>
        ))}
      </ScrollView>

      {/* Advanced Animation */}
      <MotionifyViewAdvanced
        scrollY={scrollY}
        direction={direction}
        hideOn="down"
        showOn="up"
        translateRange={{ from: 0, to: 120 }}
        opacityRange={{ from: 1, to: 0.2 }}
        scaleRange={{ from: 1, to: 0.7 }}
        scrollThreshold={100}
        animationConfig={{ duration: 400 }}
        style={styles.advancedButton}
      >
        <Pressable
          style={[styles.advancedButtonContent, { backgroundColor: tintColor }]}
          onPress={() =>
            Alert.alert("Advanced", "MotionifyViewAdvanced button pressed!")
          }
        >
          <Text style={styles.advancedButtonText}>🚀</Text>
          <Text style={styles.advancedButtonLabel}>Advanced</Text>
        </Pressable>
      </MotionifyViewAdvanced>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modeSelector: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  modeScroll: {
    marginTop: 8,
  },
  modeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  testContainer: {
    flex: 1,
  },
  testHeader: {
    padding: 16,
    marginBottom: 16,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 120,
    paddingHorizontal: 16,
  },
  flatListContent: {
    paddingTop: 80,
    paddingBottom: 120,
  },
  sectionListContent: {
    paddingBottom: 120,
  },
  scrollItem: {
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderRadius: 8,
  },
  flatListItem: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderLeftWidth: 4,
    borderRadius: 8,
  },
  sectionItem: {
    padding: 12,
    marginHorizontal: 16,
  },
  sectionHeader: {
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 6,
  },
  itemContent: {
    marginTop: 4,
    opacity: 0.7,
    lineHeight: 18,
  },
  itemDescription: {
    marginTop: 4,
    opacity: 0.7,
  },
  floatingStats: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
  },
  statsContent: {
    padding: 12,
    borderRadius: 8,
  },
  statsText: {
    color: "white",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
  },
  toolbar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  toolbarContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toolbarText: {
    color: "white",
    fontWeight: "600",
  },
  toolbarSubtext: {
    color: "white",
    fontSize: 12,
    opacity: 0.8,
  },
  sideIndicator: {
    position: "absolute",
    top: 100,
    right: 16,
  },
  indicatorContent: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  indicatorText: {
    fontSize: 16,
  },
  globalStatus: {
    position: "absolute",
    top: 20,
    left: 16,
    right: 16,
  },
  statusContent: {
    padding: 12,
    borderRadius: 8,
  },
  statusText: {
    textAlign: "center",
    fontWeight: "600",
  },
  advancedButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
  },
  advancedButtonContent: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  advancedButtonText: {
    fontSize: 20,
  },
  advancedButtonLabel: {
    color: "white",
    fontSize: 8,
    fontWeight: "600",
    marginTop: 2,
  },
});
