import { useEffect, useState } from 'react';
import { Animated } from 'react-native';
import AnimatedBootSplash from 'react-native-bootsplash';

import { styles } from './style';

type Props = {
  ready: boolean;
  onAnimationEnd: () => void;
};

const Splash = ({ ready, onAnimationEnd }: Props) => {
  const [contentOpacity] = useState(() => new Animated.Value(1));
  const [nativeSplashHidden, setNativeSplashHidden] = useState(false);

  const { container, logo } = AnimatedBootSplash.useHideAnimation({
    manifest: require('@/assets/bootsplash/manifest.json'),
    logo: require('@/assets/bootsplash/logo.png'),

    statusBarTranslucent: true,
    navigationBarTranslucent: false,

    animate: () => {
      setNativeSplashHidden(true);
    },
  });

  useEffect(() => {
    if (!nativeSplashHidden || !ready) {
      return;
    }

    const animation = Animated.timing(contentOpacity, {
      useNativeDriver: true,
      toValue: 0,
      duration: 150,
    });

    animation.start(({ finished }) => {
      if (finished) {
        onAnimationEnd();
      }
    });

    return () => animation.stop();
  }, [contentOpacity, nativeSplashHidden, onAnimationEnd, ready]);

  return (
    <Animated.View
      {...container}
      style={[container.style, styles.container]}>
      <Animated.Image
        {...logo}
        style={[logo.style, { opacity: contentOpacity }]}
      />
    </Animated.View>
  );
};

export default Splash;
