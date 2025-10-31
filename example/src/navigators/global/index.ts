import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../stack/root';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}

    type RootStackNavigationProps = NativeStackScreenProps<RootStackParamList>;

    type RootStackScreenProps<T extends keyof RootStackParamList> =
      NativeStackScreenProps<RootStackParamList, T>;
  }
}
