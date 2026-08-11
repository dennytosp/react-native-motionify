import React, { useCallback, useState } from "react";
import { StatusBar } from "react-native";

import { AppLoader } from "@/components";
import { Splash } from "@/screens/others";
import { getAppState, getTaskState } from "@/stores/slices";
import { useAppSelector } from "@/stores/types";
import { appLoaderHolder } from "@/utils/holder";

type InitializeAppProps = {
  navigationReady: boolean;
};

const InitializeApp = ({ navigationReady }: InitializeAppProps) => {
  const { isFirstTimeLaunch } = useAppSelector(getAppState);
  const { initialLoadSettled } = useAppSelector(getTaskState);
  const [visibleBootSplash, setVisibleBootSplash] = useState(true);

  const appReady =
    navigationReady && (isFirstTimeLaunch || initialLoadSettled);

  const onBootSplashCompleted = useCallback(() => {
    setVisibleBootSplash(false);
  }, []);

  return (
    <>
      <StatusBar
        animated={true}
        barStyle={"dark-content"}
        translucent={true}
        backgroundColor="transparent"
        showHideTransition={"fade"}
      />

      {visibleBootSplash && (
        <Splash ready={appReady} onAnimationEnd={onBootSplashCompleted} />
      )}

      <AppLoader ref={appLoaderHolder} />
    </>
  );
};

export default InitializeApp;
