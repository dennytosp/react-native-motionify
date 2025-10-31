import React, { forwardRef, ComponentProps } from "react";
import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { IconProps as ExpoIconProps } from "@expo/vector-icons/build/createIconSet";

// Define exact icon name types for each icon family
export type AntDesignIconName = ComponentProps<typeof AntDesign>["name"];
export type EntypoIconName = ComponentProps<typeof Entypo>["name"];
export type EvilIconsIconName = ComponentProps<typeof EvilIcons>["name"];
export type FeatherIconName = ComponentProps<typeof Feather>["name"];
export type FontAwesomeIconName = ComponentProps<typeof FontAwesome>["name"];
export type FontAwesome5IconName = ComponentProps<typeof FontAwesome5>["name"];
export type FoundationIconName = ComponentProps<typeof Foundation>["name"];
export type IoniconsIconName = ComponentProps<typeof Ionicons>["name"];
export type MaterialCommunityIconsIconName = ComponentProps<
  typeof MaterialCommunityIcons
>["name"];
export type MaterialIconsIconName = ComponentProps<
  typeof MaterialIcons
>["name"];
export type OcticonsIconName = ComponentProps<typeof Octicons>["name"];
export type SimpleLineIconsIconName = ComponentProps<
  typeof SimpleLineIcons
>["name"];

// Union type for all vector icon families
export type VectorIcons =
  | "MaterialCommunityIcons"
  | "MaterialIcons"
  | "Ionicons"
  | "Feather"
  | "FontAwesome"
  | "FontAwesome5"
  | "AntDesign"
  | "Entypo"
  | "SimpleLineIcons"
  | "Octicons"
  | "Foundation"
  | "EvilIcons";

// Specific interfaces for each icon family with better autocomplete
export interface AntDesignIconProps
  extends Omit<ExpoIconProps<string>, "name"> {
  type: "AntDesign";
  name: AntDesignIconName;
}

export interface EntypoIconProps extends Omit<ExpoIconProps<string>, "name"> {
  type: "Entypo";
  name: EntypoIconName;
}

export interface EvilIconsIconProps
  extends Omit<ExpoIconProps<string>, "name"> {
  type: "EvilIcons";
  name: EvilIconsIconName;
}

export interface FeatherIconProps extends Omit<ExpoIconProps<string>, "name"> {
  type: "Feather";
  name: FeatherIconName;
}

export interface FontAwesomeIconProps
  extends Omit<ExpoIconProps<string>, "name"> {
  type: "FontAwesome";
  name: FontAwesomeIconName;
}

export interface FontAwesome5IconProps
  extends Omit<ExpoIconProps<string>, "name"> {
  type: "FontAwesome5";
  name: FontAwesome5IconName;
}

export interface FoundationIconProps
  extends Omit<ExpoIconProps<string>, "name"> {
  type: "Foundation";
  name: FoundationIconName;
}

export interface IoniconsIconProps extends Omit<ExpoIconProps<string>, "name"> {
  type: "Ionicons";
  name: IoniconsIconName;
}

export interface MaterialCommunityIconsIconProps
  extends Omit<ExpoIconProps<string>, "name"> {
  type: "MaterialCommunityIcons";
  name: MaterialCommunityIconsIconName;
}

export interface MaterialIconsIconProps
  extends Omit<ExpoIconProps<string>, "name"> {
  type: "MaterialIcons";
  name: MaterialIconsIconName;
}

export interface OcticonsIconProps extends Omit<ExpoIconProps<string>, "name"> {
  type: "Octicons";
  name: OcticonsIconName;
}

export interface SimpleLineIconsIconProps
  extends Omit<ExpoIconProps<string>, "name"> {
  type: "SimpleLineIcons";
  name: SimpleLineIconsIconName;
}

// Default props for when no type is specified
export interface DefaultIconProps extends Omit<ExpoIconProps<string>, "name"> {
  type?: "MaterialIcons";
  name: MaterialIconsIconName;
}

// Union of all specific icon props for better autocomplete
export type IconProps =
  | AntDesignIconProps
  | EntypoIconProps
  | EvilIconsIconProps
  | FeatherIconProps
  | FontAwesomeIconProps
  | FontAwesome5IconProps
  | FoundationIconProps
  | IoniconsIconProps
  | MaterialCommunityIconsIconProps
  | MaterialIconsIconProps
  | OcticonsIconProps
  | SimpleLineIconsIconProps
  | DefaultIconProps;

const Icons = (props: IconProps, ref: React.Ref<any>) => {
  const { type = "MaterialIcons", name, ...restProps } = props;

  const renderIconSelected = () => {
    switch (type) {
      case "AntDesign":
        return <AntDesign name={name} {...restProps} ref={ref} />;
      case "Entypo":
        return <Entypo name={name} {...restProps} ref={ref} />;
      case "EvilIcons":
        return <EvilIcons name={name} {...restProps} ref={ref} />;
      case "Feather":
        return <Feather name={name} {...restProps} ref={ref} />;
      case "FontAwesome":
        return <FontAwesome name={name} {...restProps} ref={ref} />;
      case "FontAwesome5":
        return <FontAwesome5 name={name} {...restProps} ref={ref} />;
      case "Foundation":
        return <Foundation name={name} {...restProps} ref={ref} />;
      case "Ionicons":
        return <Ionicons name={name} {...restProps} ref={ref} />;
      case "MaterialCommunityIcons":
        return <MaterialCommunityIcons name={name} {...restProps} ref={ref} />;
      case "MaterialIcons":
        return <MaterialIcons name={name} {...restProps} ref={ref} />;
      case "Octicons":
        return <Octicons name={name} {...restProps} ref={ref} />;
      case "SimpleLineIcons":
        return <SimpleLineIcons name={name} {...restProps} ref={ref} />;
      default:
        return <MaterialIcons name={name} {...restProps} ref={ref} />;
    }
  };

  return renderIconSelected();
};

export default forwardRef(Icons);
