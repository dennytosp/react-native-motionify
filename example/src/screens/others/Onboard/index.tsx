import React from 'react';
import { Text, View } from 'react-native';
import { RoutesRootStack } from '@/navigators/routes';
import { useNavigation } from '@react-navigation/native';
import { styles } from './style';

type NavigationProps =
  ReactNavigation.RootStackScreenProps<RoutesRootStack.MAIN_STACK>;

const Onboard = () => {
  const navigation = useNavigation<NavigationProps['navigation']>();

  return (
    <View style={[styles.container]}>
      <Text>Onboard</Text>
    </View>
  );
};

export default Onboard;
