import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

let offset = 0;

const onScrollBottomTabHandler = (
  event: NativeSyntheticEvent<NativeScrollEvent>
) => {
  const currentOffset = event.nativeEvent.contentOffset.y;
  const heightSize = event.nativeEvent.contentSize.height;

  if (currentOffset < 0 || currentOffset > heightSize) {
    return;
  }

  const dif = currentOffset - offset;

  if (Math.abs(dif) < 3) {
    return;
  }

  if (dif < 0) {
    // showBottomTab();
  } else {
    // hideBottomTab();
  }

  offset = currentOffset;
};

export { onScrollBottomTabHandler };
