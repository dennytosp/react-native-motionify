import type { NativeStackScreenProps } from '@/navigators/native-stack';
import { RootStackParamList } from '../stack/root';

declare global {
  namespace ReactNavigation {
    type RootStackNavigationProps = NativeStackScreenProps<RootStackParamList>;

    type RootStackScreenProps<T extends keyof RootStackParamList> =
      NativeStackScreenProps<RootStackParamList, T>;
  }
}
