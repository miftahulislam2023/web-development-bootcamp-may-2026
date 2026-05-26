import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "@/types";

interface MessagesState {
  messages: Message[];
  isLoading: boolean;
  hasMore: boolean;
  cursor: string | null;
}

const initialState: MessagesState = {
  messages: [],
  isLoading: false,
  hasMore: true,
  cursor: null,
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    prependMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = [...action.payload, ...state.messages];
    },
    appendMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setMessagesLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    setCursor: (state, action: PayloadAction<string | null>) => {
      state.cursor = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
      state.hasMore = true;
      state.cursor = null;
    },
  },
});

export const {
  setMessages,
  prependMessages,
  appendMessage,
  setMessagesLoading,
  setHasMore,
  setCursor,
  clearMessages,
} = messagesSlice.actions;
export default messagesSlice.reducer;