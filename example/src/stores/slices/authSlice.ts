import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from '../types/auth';
import { RootState } from '../types/root';

const initialAuthState: AuthState = {
  isLoggedIn: false,
  isKeepLogin: false,
  isNewMember: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    onSetIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    onSetIsKeepLogin: (state, action: PayloadAction<boolean>) => {
      state.isKeepLogin = action.payload;
    },
    onSetIsNewMember: (state, action: PayloadAction<boolean>) => {
      state.isNewMember = action.payload;
    },
  },

  extraReducers: builder => {},
});

export const { reducer: authReducer, actions: authActions } = authSlice;

export const getAuthState = (state: RootState) => state.auth;
