import { MetricVariables } from "@/theme/theme";
import { MetricsSizes } from "@/utils/scale";
import {
  Image as ExpoImage,
  ImageProps as ExpoImageProps,
  ImageContentFit,
  ImageStyle,
} from "expo-image";
import React from "react";
import { StyleProp } from "react-native";

interface ImageProps extends Omit<ExpoImageProps, "resizeMode"> {
  imageType?: MetricVariables;
  customStyle?: StyleProp<ImageStyle>;
  resizeMode?: ImageContentFit;
}

export const Image = (props: ImageProps) => {
  const {
    imageType,
    customStyle,
    resizeMode = "contain",
    cachePolicy = "disk",
    transition = 200,
    ...rest
  } = props;
  const imageSize = imageType ?? "icon";

  return (
    <ExpoImage
      style={[{ width: MetricsSizes[imageSize], aspectRatio: 1 }, customStyle]}
      cachePolicy={cachePolicy}
      transition={transition}
      contentFit={resizeMode}
      {...rest}
    />
  );
};
