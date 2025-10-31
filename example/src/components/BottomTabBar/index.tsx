import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { MotionifyBottomTab } from "react-native-motionify";

import { Image } from "@/components";
import { AppStyles } from "@/styles";
import { COLORS, Icons } from "@/theme";
import { translate } from "@/translations/translate";
import { isIos } from "@/utils/device";
import {
  MetricsSizes,
  moderateScale,
  moderateVerticalScale,
  width,
} from "@/utils/scale";
import { RoutesBottomTabStack } from "@/navigators/routes";

type BottomTabVariant = "floating" | "material";

type MotionifyBottomTabBarProps = BottomTabBarProps & {
  variant?: BottomTabVariant;
};

const ICON_MAP = {
  [translate("taskify.bottomTab.tab1")]: Icons.home,
  [translate("taskify.bottomTab.tab2")]: Icons.wallet,
  [translate("taskify.bottomTab.tab3")]: Icons.categories,
  [translate("taskify.bottomTab.tab4")]: Icons.profile,
};

const getIconForLabel = (label: string) => ICON_MAP[label] || Icons.wallet;

const TAB_INACTIVE_COLOR = "#8EDFEB";
const FLOATING_WIDTH_OFFSET = 48;
const TAB_BAR_HORIZONTAL_PADDING = 32;

const MotionifyBottomTabBar = (props: MotionifyBottomTabBarProps) => {
  const {
    state,
    descriptors,
    navigation,
    insets,
    variant = "floating",
  } = props;

  const isMaterial = variant === "material";
  const bottomSize = isIos ? insets.bottom : moderateVerticalScale(24);
  const tabBarWidth =
    width -
    (isMaterial ? 0 : FLOATING_WIDTH_OFFSET) -
    moderateScale(TAB_BAR_HORIZONTAL_PADDING);
  const tabBarItemWidth = tabBarWidth / state.routes.length;

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(
            tabBarItemWidth * state.index +
              (isMaterial ? MetricsSizes.regular : MetricsSizes.big)
          ),
        },
      ],
    };
  }, [state.index, tabBarItemWidth, isMaterial]);

  return (
    <MotionifyBottomTab
      hideOn="down"
      translateRange={{ from: 0, to: bottomSize + moderateScale(100) }}
      exclude={[RoutesBottomTabStack.PROFILE]}
      currentId={state.routes[state.index].name}
      testID="reactive-bottom-tab-bar"
    >
      <Animated.View
        style={[
          isMaterial ? styles.containerMaterial : styles.container,
          {
            bottom: isMaterial ? 0 : bottomSize,
            paddingVertical: isMaterial
              ? bottomSize
              : moderateVerticalScale(24),
            width: isMaterial ? "100%" : width - moderateScale(48),
          },
        ]}
      >
        <Animated.View
          style={[
            styles.tabContainer,
            { justifyContent: isMaterial ? "center" : "flex-end" },
            animatedContainerStyle,
          ]}
        >
          <View
            style={[
              isMaterial ? styles.tabItemMaterial : styles.tabItem,
              {
                backgroundColor: COLORS.primary,
                width: isMaterial ? tabBarItemWidth : moderateScale(48),
              },
            ]}
          />
        </Animated.View>

        <View
          style={[
            AppStyles.rowCenterBetween,
            { justifyContent: "space-evenly" },
          ]}
        >
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                  ? options.title
                  : route.name;

            const isFocused = state.index === index;
            const isLastIndex = Number(state.routes.length - 1) === index;
            const iconName = getIconForLabel(String(label));

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: "tabLongPress",
                target: route.key,
              });
            };

            return (
              <Pressable
                key={"bottom-tab-" + route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                onLongPress={onLongPress}
                style={[
                  styles.button,
                  index === 0 && { marginLeft: MetricsSizes.regular },
                  isLastIndex && { marginRight: MetricsSizes.regular },
                ]}
              >
                <View style={AppStyles.columnCenter}>
                  <Image
                    source={iconName}
                    imageType={"large"}
                    tintColor={isFocused ? COLORS.white : TAB_INACTIVE_COLOR}
                  />
                </View>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>
    </MotionifyBottomTab>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignSelf: "center",
    borderRadius: 20,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: moderateVerticalScale(8),
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  containerMaterial: {
    backgroundColor: COLORS.white,
    width: "100%",
    position: "absolute",
  },
  tabContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  tabItem: {
    borderTopLeftRadius: 44,
    borderTopRightRadius: 44,
    height: "80%",
  },
  tabItemMaterial: {
    borderRadius: 12,
    height: moderateVerticalScale(44),
  },
  button: {
    flex: 1,
  },
  textDefaultButton: {
    marginTop: moderateVerticalScale(6),
    fontSize: moderateScale(12),
  },
});

export default MotionifyBottomTabBar;
