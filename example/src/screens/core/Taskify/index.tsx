import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RoutesRootStack } from '@/navigators/routes';
import { styles } from './style';

type NavigationProps =
  ReactNavigation.RootStackScreenProps<RoutesRootStack.MAIN_STACK>;

const Taskify = () => {
  const navigation = useNavigation<NavigationProps['navigation']>();

  return (
    <View style={[styles.container]}>
      <Text>Taskify</Text>
    </View>
  );
};

export default Taskify;
