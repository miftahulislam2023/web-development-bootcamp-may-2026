import { configureStore } from "@reduxjs/toolkit";
import builderReducer from "@/redux/slices/builderSlice";

export function makeStore(preloadedState) {
  return configureStore({
    reducer: {
      builder: builderReducer,
    },
    preloadedState,
    devTools: process.env.NODE_ENV !== "production",
  });
}
