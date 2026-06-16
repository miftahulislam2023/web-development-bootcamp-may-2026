export interface SaveMessageInput {
  roomKey: string;
  text: string;
  senderId: number | null;
  senderName: string;
}

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
