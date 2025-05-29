// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import settingReducer from './setting/settingSlice';

export const store = configureStore({
  reducer: {
    auth: userReducer,
    setting:settingReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
