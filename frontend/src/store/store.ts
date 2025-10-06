import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice.ts";
import { apiSlice } from "./apiSlice.ts";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
