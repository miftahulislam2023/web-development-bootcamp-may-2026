export type Role = "USER" | "ADMIN" | "SUPER_ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content?: string;
  fileUrl?: string;
  fileType?: string | null;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  otherUser: {
    id: string;
    name: string;
    email: string;
    isOnline: boolean;
    lastSeen: string;
  }; 
  unreadCount: number;
  updatedAt: string;
  lastMessage?: {
    id: string;
    content?: string;
    senderId: string;
    createdAt: string;
    fileUrl?: string;
    fileType?: string | null;
  };
}