/** Represents a user in the chat system */
export interface ChatUser {
  id: string;
  name: string;
  initials: string;
  avatarUrl?: string;
}

/** Represents a single chat message */
export interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  sender: ChatUser;
  isOwn: boolean;
}

/** Represents a direct message conversation */
export interface DirectMessage {
  id: string;
  user: ChatUser;
  lastMessage: string;
  unreadCount: number;
  timestamp: string;
}

/** Represents a group chat */
export interface GroupChat {
  id: string;
  name: string;
  memberCount: number;
  lastMessage: string;
  unreadCount: number;
  timestamp: string;
  /** Members shown as avatars / sender names in group messages */
  members?: ChatUser[];
}

/**
 * Unified Chat type.
 * Every conversation — DM or group — is normalised into this shape
 * so the chat window doesn't need to know the difference.
 */
export interface Chat {
  id: string;
  type: "dm" | "group";
  /** Display name — user name for DM, group name for group */
  name: string;
  /** Initials for avatar fallback */
  initials: string;
  /** Only meaningful for groups */
  memberCount?: number;
  lastMessage: string;
  unreadCount: number;
  timestamp: string;
  /** The messages in this conversation */
  messages: ChatMessage[];
  /** Array of user IDs in this chat */
  memberIds?: string[];
  /** Pagination cursor for fetching older messages */
  nextCursor?: string | null;
  /** Whether there are older messages to fetch */
  hasMore?: boolean;
}
