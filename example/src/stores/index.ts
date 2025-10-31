import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";

import { appReducer, authReducer, taskReducer } from "./slices";
import { categoryReducer } from "./slices/categorySlice";

const reducers = combineReducers({
  app: appReducer,
  auth: authReducer,
  task: taskReducer,
  category: categoryReducer,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["app"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    const middlewares = getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });

    return middlewares;
  },
});

export const persistor = persistStore(store);
