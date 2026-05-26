import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import conversationsReducer from "./slices/conversationsSlice";
import messagesReducer from "./slices/messagesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    conversations: conversationsReducer,
    messages: messagesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;