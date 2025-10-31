import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useRef } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppStyles } from "@/styles";
import { COLORS, Images } from "@/theme";
import { scale } from "@/utils/scale";
import {
  MotionifyView,
  MotionifyViewWithInterpolation,
  useMotionify,
} from "react-native-motionify";
import { styles } from "./style";

const Profile = () => {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const { direction, onScroll, isScrolling } = useMotionify({
    threshold: 30,
  });

  const handleScrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <View style={styles.container}>
      <MotionifyView
        style={[styles.floatingHeader, { paddingTop: insets.top }]}
        fadeScale
        hideOn="down"
        animationDuration={300}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.profilePicture}>
              <Image
                source={Images.avatar}
                style={styles.profilePictureImage}
              />
            </View>
            <View style={styles.headerTextContent}>
              <Text style={styles.headerName}>Mad Dinh</Text>
              <Text style={styles.headerEmail}>phong.dinh2108@gmail.com</Text>
            </View>
          </View>
          <Pressable style={styles.headerButton} hitSlop={8}>
            <Ionicons name="settings-outline" size={24} color={COLORS.text} />
          </Pressable>
        </View>
      </MotionifyView>

      <ScrollView
        ref={scrollViewRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={[AppStyles.fill]}
        contentContainerStyle={[
          {
            paddingTop: insets.top + scale(90),
            paddingBottom: insets.bottom + scale(120),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <MotionifyViewWithInterpolation
          interpolations={{
            translateY: { inputRange: [0, 200], outputRange: [0, -80] },
            scale: { inputRange: [0, 150], outputRange: [1, 0.92] },
            opacity: { inputRange: [0, 100, 200], outputRange: [1, 0.85, 0.4] },
          }}
        >
          <View style={styles.heroSection}>
            <View style={styles.heroIcon}>
              <MaterialCommunityIcons
                name="rocket-launch"
                size={40}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.heroTitle}>Reactive Animation Showcase</Text>
            <Text style={styles.heroSubtitle}>
              Explore scroll-driven animations with ReactiveView and
              MotionifyViewWithInterpolation
            </Text>
          </View>
        </MotionifyViewWithInterpolation>

        <View style={styles.statusSection}>
          <MotionifyView
            style={styles.statusCard}
            animatedY
            hideOn="down"
            translateRange={{ from: 0, to: -30 }}
            animationDuration={300}
          >
            <View style={styles.statusIcon}>
              <Ionicons
                name={
                  direction === "up"
                    ? "arrow-up-circle"
                    : direction === "down"
                      ? "arrow-down-circle"
                      : "pause-circle"
                }
                size={32}
                color={
                  direction === "up"
                    ? "#10B981"
                    : direction === "down"
                      ? "#EF4444"
                      : "#94A3B8"
                }
              />
            </View>
            <Text style={styles.statusTitle}>Scroll Direction</Text>
            <Text style={styles.statusValue}>{direction.toUpperCase()}</Text>
            <Text style={styles.statusDescription}>
              This card slides up when scrolling down
            </Text>
          </MotionifyView>

          <MotionifyView style={styles.statusCard} animationDuration={350}>
            <View style={styles.statusIcon}>
              <MaterialCommunityIcons
                name={isScrolling ? "motion-play" : "motion-pause"}
                size={32}
                color={isScrolling ? COLORS.primary : "#94A3B8"}
              />
            </View>
            <Text style={styles.statusTitle}>Scroll State</Text>
            <Text style={styles.statusValue}>
              {isScrolling ? "ACTIVE" : "IDLE"}
            </Text>
            <Text style={styles.statusDescription}>
              This card fades and scales when scrolling up
            </Text>
          </MotionifyView>
        </View>

        <View style={styles.section}>
          <MotionifyViewWithInterpolation
            interpolations={{
              scale: {
                inputRange: [100, 300, 500],
                outputRange: [1, 0.96, 0.92],
              },
              opacity: {
                inputRange: [100, 300, 500],
                outputRange: [1, 0.85, 0.6],
              },
            }}
          >
            <View style={[styles.featureCard, { backgroundColor: "#F0FDF4" }]}>
              <View
                style={[
                  styles.featureIconContainer,
                  { backgroundColor: "#10B981" },
                ]}
              >
                <MaterialCommunityIcons
                  name="resize"
                  size={24}
                  color="#FFFFFF"
                />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Scale Transform</Text>
                <Text style={styles.featureDescription}>
                  Dynamic scaling based on scroll position
                </Text>
              </View>
            </View>
          </MotionifyViewWithInterpolation>

          <MotionifyViewWithInterpolation
            interpolations={{
              rotate: {
                inputRange: [200, 400, 600],
                outputRange: [0, -2, -5],
              },
              translateX: {
                inputRange: [200, 400, 600],
                outputRange: [0, 5, 10],
              },
            }}
          >
            <View style={[styles.featureCard, { backgroundColor: "#FEF3C7" }]}>
              <View
                style={[
                  styles.featureIconContainer,
                  { backgroundColor: "#F59E0B" },
                ]}
              >
                <MaterialCommunityIcons
                  name="rotate-3d"
                  size={24}
                  color="#FFFFFF"
                />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Rotation Effect</Text>
                <Text style={styles.featureDescription}>
                  Subtle rotation and translation animation
                </Text>
              </View>
            </View>
          </MotionifyViewWithInterpolation>

          <MotionifyViewWithInterpolation
            interpolations={{
              translateY: {
                inputRange: [300, 500, 700],
                outputRange: [0, -20, -40],
              },
              scale: {
                inputRange: [300, 500, 700],
                outputRange: [1, 0.95, 0.9],
              },
              opacity: {
                inputRange: [300, 500, 700],
                outputRange: [1, 0.8, 0.5],
              },
            }}
          >
            <View style={[styles.featureCard, { backgroundColor: "#FCE7F3" }]}>
              <View
                style={[
                  styles.featureIconContainer,
                  { backgroundColor: "#EC4899" },
                ]}
              >
                <MaterialCommunityIcons
                  name="animation-play"
                  size={24}
                  color="#FFFFFF"
                />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Combined Effects</Text>
                <Text style={styles.featureDescription}>
                  Multiple animations working together seamlessly
                </Text>
              </View>
            </View>
          </MotionifyViewWithInterpolation>
        </View>

        <View style={styles.section}>
          <MotionifyViewWithInterpolation
            interpolations={{
              opacity: { inputRange: [250, 600], outputRange: [0, 1] },
              translateY: { inputRange: [250, 600], outputRange: [30, 0] },
            }}
          >
            <Text style={styles.sectionTitle}>Performance Stats</Text>
          </MotionifyViewWithInterpolation>

          <View style={styles.statsGrid}>
            <MotionifyViewWithInterpolation
              interpolations={{
                translateY: { inputRange: [350, 600], outputRange: [30, 0] },
                opacity: { inputRange: [350, 550], outputRange: [0, 1] },
                scale: {
                  inputRange: [350, 550, 600],
                  outputRange: [0.8, 1.05, 1],
                },
              }}
            >
              <View style={styles.statCard}>
                <Text style={styles.statValue}>60</Text>
                <Text style={styles.statLabel}>FPS</Text>
                <Text style={styles.statDescription}>Smooth animations</Text>
              </View>
            </MotionifyViewWithInterpolation>

            <MotionifyViewWithInterpolation
              interpolations={{
                translateY: { inputRange: [350, 650], outputRange: [30, 0] },
                opacity: { inputRange: [400, 600], outputRange: [0, 1] },
                scale: {
                  inputRange: [400, 600, 650],
                  outputRange: [0.8, 1.05, 1],
                },
              }}
            >
              <View style={styles.statCard}>
                <Text style={styles.statValue}>100%</Text>
                <Text style={styles.statLabel}>UI Thread</Text>
                <Text style={styles.statDescription}>Native performance</Text>
              </View>
            </MotionifyViewWithInterpolation>
          </View>

          <View style={styles.statsGrid}>
            <MotionifyViewWithInterpolation
              interpolations={{
                translateY: {
                  inputRange: [450, 700],
                  outputRange: [30, 0],
                },
                opacity: {
                  inputRange: [450, 650],
                  outputRange: [0, 1],
                },
                scale: {
                  inputRange: [450, 650, 700],
                  outputRange: [0.8, 1.05, 1],
                },
              }}
            >
              <View style={styles.statCard}>
                <Text style={styles.statValue}>0ms</Text>
                <Text style={styles.statLabel}>JS Bridge</Text>
                <Text style={styles.statDescription}>Worklet optimized</Text>
              </View>
            </MotionifyViewWithInterpolation>

            <MotionifyViewWithInterpolation
              interpolations={{
                translateY: { inputRange: [500, 750], outputRange: [30, 0] },
                opacity: { inputRange: [500, 700], outputRange: [0, 1] },
                scale: {
                  inputRange: [500, 700, 750],
                  outputRange: [0.8, 1.05, 1],
                },
              }}
            >
              <View style={styles.statCard}>
                <Text style={styles.statValue}>∞</Text>
                <Text style={styles.statLabel}>Possibilities</Text>
                <Text style={styles.statDescription}>Fully customizable</Text>
              </View>
            </MotionifyViewWithInterpolation>
          </View>
        </View>

        <MotionifyViewWithInterpolation
          interpolations={{
            opacity: { inputRange: [575, 800], outputRange: [0, 1] },
            translateY: { inputRange: [575, 800], outputRange: [40, 0] },
          }}
        >
          <View style={styles.infoSection}>
            <View style={styles.infoIconContainer}>
              <Ionicons
                name="information-circle"
                size={28}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.infoTitle}>How It Works</Text>
            <Text style={styles.infoDescription}>
              All animations run on the UI thread using React Native Reanimated
              worklets. The ReactiveProvider automatically tracks scroll
              direction and position, enabling components to react smoothly to
              user interactions without any JS bridge overhead.
            </Text>
            <View style={styles.infoBadges}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Reanimated 3</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>TypeScript</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>60 FPS</Text>
              </View>
            </View>
          </View>
        </MotionifyViewWithInterpolation>

        <View style={{ height: scale(40) }} />
      </ScrollView>

      <MotionifyViewWithInterpolation
        style={[styles.fab, { bottom: scale(120) }]}
        interpolations={{
          opacity: { inputRange: [0, 150, 300], outputRange: [0, 0.3, 1] },
          scale: { inputRange: [0, 120, 300], outputRange: [0.4, 0.8, 1] },
        }}
      >
        <Pressable
          style={styles.fabButton}
          onPress={handleScrollToTop}
          hitSlop={12}
        >
          <Ionicons name="arrow-up" size={28} color={COLORS.white} />
        </Pressable>
      </MotionifyViewWithInterpolation>

      <MotionifyViewWithInterpolation
        style={styles.scrollProgress}
        interpolations={{
          scaleX: {
            inputRange: [0, 500, 1000, 1500],
            outputRange: [0, 0.33, 0.66, 1],
          },
          opacity: { inputRange: [0, 50], outputRange: [0, 1] },
        }}
      >
        <View style={styles.scrollProgressBar} />
      </MotionifyViewWithInterpolation>
    </View>
  );
};

export default Profile;
