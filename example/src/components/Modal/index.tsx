import React, {
  Ref,
  forwardRef,
  memo,
  useImperativeHandle,
  useState,
} from "react";
import equals from "react-fast-compare";
import { StyleProp, View, ViewStyle } from "react-native";
import ReactNativeModal from "react-native-modal";

import { height } from "@/utils/scale";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";

export interface ModalRef {
  showModal: () => void;
  hideModal: () => void;
}

interface ModalProps {
  isScroll?: boolean;
  isFullScreen?: boolean;
  children?: () => React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const ModalComponent = forwardRef((props: ModalProps, ref: Ref<ModalRef>) => {
  useImperativeHandle(
    ref,
    () => ({
      showModal,
      hideModal,
    }),
    []
  );
  const insets = useSafeAreaInsets();
  const { isScroll, isFullScreen, children, style } = props;

  const [visible, setVisible] = useState<boolean>(false);

  const showModal = () => {
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  return (
    <ReactNativeModal
      isVisible={visible}
      animationIn={"fadeIn"}
      animationOut={"fadeOut"}
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
      backdropOpacity={0.7}
      onBackdropPress={hideModal}
      style={[styles.modalStyle]}
    >
      <View
        style={[
          styles.container,
          isScroll && { paddingHorizontal: 0 },
          isFullScreen && {
            height,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
          style,
        ]}
      >
        {children && children()}
      </View>
    </ReactNativeModal>
  );
});

export const Modal = memo(ModalComponent, equals);
