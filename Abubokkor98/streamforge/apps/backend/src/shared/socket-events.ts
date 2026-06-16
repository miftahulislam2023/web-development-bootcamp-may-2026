// ─── Shared Socket.IO Event Contracts ───
// Source of truth for all real-time event types.
// Frontend mirrors these types in lib/types/socket-events.ts.

// ── Payload Types ──

export interface SendMessagePayload {
  roomKey: string;
  text: string;
}

export interface DeleteMessagePayload {
  messageId: number;
  roomKey: string;
}

export interface PinMessagePayload {
  messageId: number;
  roomKey: string;
  isPinned: boolean;
}

export interface SendReactionPayload {
  roomKey: string;
  emoji: string;
}

// ── Response Types ──

export interface ChatMessageResponse {
  id: number;
  roomId: number;
  sessionId: number;
  senderId: number | null;
  senderName: string;
  text: string;
  isPinned: boolean;
  isDeleted: boolean;
  createdAt: string;
}

export interface MessageAckResponse {
  success: boolean;
  message?: ChatMessageResponse;
  error?: string;
}

export interface ReactionBroadcast {
  emoji: string;
  senderName: string;
  id: string;
}

// ── Event Interfaces ──

/** Events sent from the client to the server */
export interface ClientToServerEvents {
  'join-room': (roomKey: string) => void;
  'leave-room': (roomKey: string) => void;
  'send-message': (
    payload: SendMessagePayload,
    callback: (response: MessageAckResponse) => void,
  ) => void;
  'delete-message': (payload: DeleteMessagePayload) => void;
  'pin-message': (payload: PinMessagePayload) => void;
  'send-reaction': (payload: SendReactionPayload) => void;
}

/** Events sent from the server to the client */
export interface ServerToClientEvents {
  'new-message': (message: ChatMessageResponse) => void;
  'message-deleted': (payload: { messageId: number }) => void;
  'message-pinned': (payload: { messageId: number; isPinned: boolean }) => void;
  'reaction': (payload: ReactionBroadcast) => void;
  'viewer-count-updated': (payload: { roomKey: string; count: number }) => void;
  'chat-history': (messages: ChatMessageResponse[]) => void;
  'stream-ended': (payload: { roomKey: string }) => void;
  'error': (payload: { message: string }) => void;
}

/** Inter-server events (unused in single-instance, reserved for future scaling) */
export interface InterServerEvents {
  ping: () => void;
}

/** Data attached to each socket instance during handshake */
export interface SocketData {
  userId: number | null;
  userName: string;
  isHost: boolean;
  currentRoom: string | null;
}
