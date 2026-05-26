import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Conversation } from "@/types";

interface ConversationsState {
  conversations: Conversation[];
  isLoading: boolean;
  activeConversationId: string | null;
}

const initialState: ConversationsState = {
  conversations: [],
  isLoading: false,
  activeConversationId: null,
};

const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },
    setConversationsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
    },
    updateLastMessage: (
      state,
      action: PayloadAction<{ conversationId: string; message: import("@/types").Message }>
    ) => {
      const conv = state.conversations.find(
        (c) => c.id === action.payload.conversationId
      );
      if (conv) {
        conv.lastMessage = action.payload.message;
        conv.updatedAt = action.payload.message.createdAt;
      }
    },
    incrementUnread: (state, action: PayloadAction<string>) => {
      const conv = state.conversations.find((c) => c.id === action.payload);
      if (conv) conv.unreadCount += 1;
    },
    clearUnread: (state, action: PayloadAction<string>) => {
      const conv = state.conversations.find((c) => c.id === action.payload);
      if (conv) conv.unreadCount = 0;
    },
  },
});

export const {
  setConversations,
  setConversationsLoading,
  setActiveConversation,
  updateLastMessage,
  incrementUnread,
  clearUnread,
} = conversationsSlice.actions;
export default conversationsSlice.reducer;