import { AppLanguage } from '@/types';

export type AppState = {
  isInternet: boolean;
  isDebugging: boolean;
  appLanguage: AppLanguage;
  isFirstTimeLaunch: boolean;
};
