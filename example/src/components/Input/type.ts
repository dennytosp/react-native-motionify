import { ImageProps } from "expo-image";
import {
  ImageRequireSource,
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from "react-native";

interface InputProps {
  title?: string;
  inputProps?: TextInputProps;
  placeHolder?: string;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  defaultValue?: string;
  isRequired?: boolean;
  isPickerImage?: boolean;
  isUsingModal?: boolean;
  isPassword?: boolean;
  leftIcon?: ImageProps["source"] | ImageRequireSource;
  rightIcon?: ImageProps["source"] | ImageRequireSource;
  hintError?: string;
  hintErrorEmpty?: string;
  handleChangeText?: (text: string) => void;
  onBlurInput?: () => void;
  onSubmit?: () => void;
  onPressInput?: () => void;
  onPressLeftInput?: () => void;
  onPressRightInput?: () => void;
  renderCustom?: () => React.ReactNode;
}

interface InputRef {
  getErrorStatus: () => boolean;
  changeErrorStatus: (status: boolean) => void;
  changeValue: (val: string) => void;
  getValue: () => string;
  clearValue: () => void;
  getLengthCharacter: () => number;
  focus: () => void;
}

export type { InputProps, InputRef };
