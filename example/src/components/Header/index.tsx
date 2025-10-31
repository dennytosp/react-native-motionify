import { Icons } from "@/theme";
import { isAndroid } from "@/utils/device";
import { moderateScale, moderateVerticalScale } from "@/utils/scale";
import { useNavigation } from "@react-navigation/native";
import { ImageProps } from "expo-image";
import React, { FC } from "react";
import {
  ImageRequireSource,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "../Image";
import { SemiBoldText } from "../Text";
import { styles } from "./style";

type HeaderProps = {
  title?: string;
  leftIcon?: ImageProps["source"] | ImageRequireSource;
  rightIcon?: ImageProps["source"] | ImageRequireSource;
  onPressLeft?: () => void;
  onPressRight?: () => void;
  hideLeftIcon?: boolean;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

type NavigationProps = ReactNavigation.RootStackNavigationProps;

const Header: FC<HeaderProps> = ({
  containerStyle,
  style,
  title,
  leftIcon,
  hideLeftIcon,
  rightIcon,
  onPressLeft,
  onPressRight,
}) => {
  const navigation = useNavigation<NavigationProps["navigation"]>();

  const onGoBack = () => {
    if (onPressLeft) {
      return onPressLeft();
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.wrapperFullHeader, containerStyle]}>
      <SafeAreaView
        edges={["top"]}
        style={[
          isAndroid && { marginTop: moderateVerticalScale(16) },
          styles.wrapperHeader,
          style,
        ]}
      >
        <View style={[styles.wrapperLeft]}>
          {!hideLeftIcon && (
            <TouchableOpacity
              style={[styles.wrapperLeftIcon]}
              onPress={onGoBack}
            >
              <Image source={leftIcon ?? Icons.forwardLeft} />
            </TouchableOpacity>
          )}

          {title && (
            <SemiBoldText
              style={[
                !rightIcon && !hideLeftIcon && styles.textCenterHeader,
                { fontSize: moderateScale(16) },
              ]}
            >
              {title}
            </SemiBoldText>
          )}
        </View>

        <View style={[styles.wrapperRight]}>
          <TouchableOpacity
            onPress={onPressRight}
            style={{ marginLeft: moderateScale(16) }}
          >
            <Image source={rightIcon ?? Icons.plus} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Header;
