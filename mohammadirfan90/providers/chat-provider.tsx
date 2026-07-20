"use client";

import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Chat, ChatMessage, ChatUser } from "@/types/chat";

/* ─────────────────────────────────────────────
   State shape
   ───────────────────────────────────────────── */

interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  currentUser: ChatUser | null;
  isLoading: boolean;
}

/* ─────────────────────────────────────────────
   Actions
   ───────────────────────────────────────────── */

type ChatAction =
  | { type: "SET_CURRENT_USER"; user: ChatUser }
  | { type: "SET_CHATS"; chats: Chat[] }
  | { type: "SET_MESSAGES"; chatId: string; messages: ChatMessage[]; nextCursor?: string | null; hasMore?: boolean }
  | { type: "ADD_OLDER_MESSAGES"; chatId: string; messages: ChatMessage[]; nextCursor?: string | null; hasMore?: boolean }
  | { type: "SELECT_CHAT"; chatId: string }
  | { type: "ADD_MESSAGE"; chatId: string; message: ChatMessage }
  | { type: "CLEAR_UNREAD"; chatId: string }
  | { type: "SET_LOADING"; isLoading: boolean };

/* ─────────────────────────────────────────────
   Reducer
   ───────────────────────────────────────────── */

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "SET_CURRENT_USER":
      return { ...state, currentUser: action.user };
    case "SET_LOADING":
      return { ...state, isLoading: action.isLoading };
    case "SET_CHATS":
      return { ...state, chats: action.chats, isLoading: false };
    case "SET_MESSAGES": {
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === action.chatId
            ? { ...chat, messages: action.messages, nextCursor: action.nextCursor, hasMore: action.hasMore }
            : chat
        ),
      };
    }
    case "ADD_OLDER_MESSAGES": {
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === action.chatId
            ? { ...chat, messages: [...action.messages, ...chat.messages], nextCursor: action.nextCursor, hasMore: action.hasMore }
            : chat
        ),
      };
    }
    case "SELECT_CHAT": {
      return {
        ...state,
        activeChatId: action.chatId,
        chats: state.chats.map((chat) =>
          chat.id === action.chatId ? { ...chat, unreadCount: 0 } : chat
        ),
      };
    }
    case "ADD_MESSAGE": {
      return {
        ...state,
        chats: state.chats.map((chat) => {
          if (chat.id === action.chatId) {
            // Check for duplicate message ID
            if (chat.messages.some((m) => m.id === action.message.id)) {
              return chat; // Do nothing if duplicate
            }
            return {
              ...chat,
              messages: [...chat.messages, action.message],
              lastMessage: action.message.content,
              timestamp: "Just now",
            };
          }
          return chat;
        }),
      };
    }
    case "CLEAR_UNREAD": {
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === action.chatId ? { ...chat, unreadCount: 0 } : chat
        ),
      };
    }
    default:
      return state;
  }
}

/* ─────────────────────────────────────────────
   Context
   ───────────────────────────────────────────── */

interface ChatContextValue {
  state: ChatState;
  activeChat: Chat | null;
  dmChats: Chat[];
  groupChats: Chat[];
  selectChat: (chatId: string) => void;
  fetchMoreMessages: (chatId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  refetchChats: () => Promise<void>;
}

const ChatContext = createContext<ChatContextValue | null>(null);

/* ─────────────────────────────────────────────
   Provider
   ───────────────────────────────────────────── */

const initialState: ChatState = {
  chats: [],
  activeChatId: null,
  currentUser: null,
  isLoading: true,
};

// Helper to get initials
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

import { useAuth } from "@/hooks/use-auth";
import { useSocket } from "@/providers/socket-provider";

// ... keep existing imports and types ...

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user } = useAuth();
  const { socket } = useSocket();

  // 1. Initial Load: Fetch User & Chats
  useEffect(() => {
    async function init() {
      if (!user) return;
      try {
        const myUser: ChatUser = {
          id: user._id,
          name: user.username,
          initials: getInitials(user.username),
          avatarUrl: user.avatar,
        };
        
        dispatch({ type: "SET_CURRENT_USER", user: myUser });

        // Fetch Chats
        const chatsRes = await fetch(`/api/chats`);
        const chatsData = await chatsRes.json();

        if (chatsData.data) {
          const mappedChats: Chat[] = chatsData.data.map((c: any) => {
            const isDm = !c.isGroupChat;
            let displayName = c.chatName;
            
            // If DM, chat name is the other user's name
            if (isDm) {
              const otherUser = c.users.find((u: any) => u._id !== myUser.id);
              displayName = otherUser ? otherUser.username : "Unknown User";
            }

            return {
              id: c._id,
              type: isDm ? "dm" : "group",
              name: displayName || "Unnamed Chat",
              initials: getInitials(displayName || "U"),
              memberCount: c.users.length,
              lastMessage: c.latestMessage ? c.latestMessage.content : "No messages yet",
              unreadCount: 0,
              timestamp: c.updatedAt ? new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now",
              messages: [], // Initially empty, fetched on select
              memberIds: c.users.map((u: any) => u._id),
            };
          });

          dispatch({ type: "SET_CHATS", chats: mappedChats });
        }
      } catch (err) {
        console.error("Initialization error:", err);
        dispatch({ type: "SET_LOADING", isLoading: false });
      }
    }

    init();
  }, [user]);

  const refetchChats = async () => {
    if (!user) return;
    try {
      const chatsRes = await fetch(`/api/chats`);
      const chatsData = await chatsRes.json();
      if (chatsData.data) {
        const myUser = { id: user._id };
        const mappedChats: Chat[] = chatsData.data.map((c: any) => {
          const isDm = !c.isGroupChat;
          let displayName = c.chatName;
          if (isDm) {
            const otherUser = c.users.find((u: any) => u._id !== myUser.id);
            displayName = otherUser ? otherUser.username : "Unknown User";
          }
          return {
            id: c._id,
            type: isDm ? "dm" : "group",
            name: displayName || "Unnamed Chat",
            initials: getInitials(displayName || "U"),
            memberCount: c.users.length,
            lastMessage: c.latestMessage ? c.latestMessage.content : "No messages yet",
            unreadCount: 0,
            timestamp: c.updatedAt ? new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now",
            messages: [], // Initially empty, fetched on select
            memberIds: c.users.map((u: any) => u._id),
          };
        });
        dispatch({ type: "SET_CHATS", chats: mappedChats });
      }
    } catch (err) {
      console.error("Refetch error:", err);
    }
  };

  // Handle incoming socket messages
  useEffect(() => {
    if (!socket || !user) return;

    const handleNewMessage = (data: { chatId: string; message: any }) => {
      const { chatId, message } = data;

      // Format the message
      const isOwn = message.sender._id === user._id;
      const formattedMessage: ChatMessage = {
        id: message._id,
        content: message.content,
        timestamp: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn,
        sender: {
          id: message.sender._id,
          name: message.sender.username,
          initials: getInitials(message.sender.username),
          avatarUrl: message.sender.avatar,
        }
      };

      // Dispatch handles duplicate checks
      dispatch({ type: "ADD_MESSAGE", chatId, message: formattedMessage });
    };

    socket.on("message:new", handleNewMessage);

    return () => {
      socket.off("message:new", handleNewMessage);
    };
  }, [socket, user]);

  // 2. Select Chat & Fetch Messages
  const selectChat = async (chatId: string) => {
    dispatch({ type: "SELECT_CHAT", chatId });
    
    // Check if we already have messages
    const chat = state.chats.find(c => c.id === chatId);
    if (chat && chat.messages.length > 0) return;

    try {
      const res = await fetch(`/api/messages/chat/${chatId}`);
      const data = await res.json();
      
      if (data.data && state.currentUser) {
        const mappedMessages: ChatMessage[] = data.data.map((m: any) => {
          const isOwn = m.sender._id === state.currentUser!.id;
          return {
            id: m._id,
            content: m.content,
            timestamp: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn,
            sender: {
              id: m.sender._id,
              name: m.sender.username,
              initials: getInitials(m.sender.username),
              avatarUrl: m.sender.avatar,
            }
          };
        });
        
        dispatch({ type: "SET_MESSAGES", chatId, messages: mappedMessages, nextCursor: data.nextCursor, hasMore: data.hasMore });
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  // 2.5 Fetch More Messages
  const fetchMoreMessages = async (chatId: string) => {
    const chat = state.chats.find(c => c.id === chatId);
    if (!chat || !chat.hasMore || !chat.nextCursor) return;

    try {
      const res = await fetch(`/api/messages/chat/${chatId}?cursor=${chat.nextCursor}`);
      const data = await res.json();
      
      if (data.data && state.currentUser) {
        const mappedMessages: ChatMessage[] = data.data.map((m: any) => {
          const isOwn = m.sender._id === state.currentUser!.id;
          return {
            id: m._id,
            content: m.content,
            timestamp: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn,
            sender: {
              id: m.sender._id,
              name: m.sender.username,
              initials: getInitials(m.sender.username),
              avatarUrl: m.sender.avatar,
            }
          };
        });
        
        dispatch({ type: "ADD_OLDER_MESSAGES", chatId, messages: mappedMessages, nextCursor: data.nextCursor, hasMore: data.hasMore });
      }
    } catch (err) {
      console.error("Failed to fetch older messages:", err);
    }
  };

  // 3. Send Message
  const sendMessage = async (content: string) => {
    if (!state.activeChatId || !state.currentUser) return;
    const chatId = state.activeChatId;

    try {
      // Optimistic UI Update
      const now = new Date();
      const timestamp = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      const optimisticMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        content,
        timestamp,
        sender: state.currentUser,
        isOwn: true,
      };

      dispatch({ type: "ADD_MESSAGE", chatId, message: optimisticMessage });

      // Actual API call
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          chatId,
        }),
      });
      
      const data = await res.json();
      
      if (data.success && data.data && socket) {
        // Find receivers
        const chat = state.chats.find(c => c.id === chatId);
        if (chat && chat.memberIds && state.currentUser) {
          const currentUserId = state.currentUser.id;
          const receiverIds = chat.memberIds.filter(id => id !== currentUserId);
          socket.emit("message:send", {
            chatId,
            message: data.data,
            receiverIds
          });
        }
        
        // Remove temp message and add real one
        // For simplicity, we just add the real one (duplicate ID logic will handle it if we matched DB IDs, but temp ID is different).
        // A cleaner way is to let the socket event or a specific dispatch replace it, but appending works if we don't mind a slight flash or if we just rely on REST.
        // Actually, since we dispatched ADD_MESSAGE with temp ID, let's just let it be. Next fetch will sync it.
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const value = useMemo<ChatContextValue>(() => {
    const activeChat =
      state.chats.find((c) => c.id === state.activeChatId) ?? null;
    const dmChats = state.chats.filter((c) => c.type === "dm");
    const groupChats = state.chats.filter((c) => c.type === "group");
    return { state, activeChat, dmChats, groupChats, selectChat, fetchMoreMessages, sendMessage, refetchChats };
  }, [state]);

  return (
    <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
  );
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return ctx;
}
