export interface User {
  id: string;
  username: string;
  name?: string;
  email: string;
  avatar: string | null;
  createdAt: string;
}

export interface Room {
  id: string;
  name: string;
  description: string | null;
  type: 'PUBLIC' | 'PRIVATE' | 'DIRECT';
  ownerId: string;
  owner: Pick<User, 'id' | 'username' | 'avatar'>;
  createdAt: string;
  updatedAt: string;
  _count?: { members: number; messages: number };
  members?: any[];
  messages?: Message[];
  joinRequests?: { status: string; userId: string; roomId: string }[];
}

export interface Message {
  id: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'FILE';
  fileUrl: string | null;
  senderId: string;
  roomId: string;
  sender: Pick<User, 'id' | 'username' | 'avatar'>;
  readBy: { userId: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface TypingUser {
  userId: string;
  username: string;
  roomId: string;
}
