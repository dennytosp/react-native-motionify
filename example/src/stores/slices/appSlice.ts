import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit/react';

import { AppLanguage, LanguageType } from '@/types';
import { AppState } from '../types/app';
import { RootState } from '../types/root';

const initialAppState: AppState = {
  isInternet: true,
  appLanguage: LanguageType.en,
  isDebugging: false,
  isFirstTimeLaunch: true,
};

const appSlice = createSlice({
  name: 'app',
  initialState: initialAppState,
  reducers: {
    onSetAppLanguage: (state, action: PayloadAction<AppLanguage>) => {
      state.appLanguage = action.payload;
    },
    onSetIsFirstTimeLaunch: (state, action: PayloadAction<boolean>) => {
      state.isFirstTimeLaunch = action.payload;
    },
  },

  extraReducers: builder => {},
});

export const { reducer: appReducer, actions: appActions } = appSlice;

export const getAppState = (state: RootState) => state.app;
