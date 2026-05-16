export type DmUser = {
  id: string;
  username: string | null;
  name: string | null;
  image: string | null;
  bio: string | null;
  lastSeenAt?: string | null;
};

export type DmMessage = {
  id: string;
  content: string;
  conversationId?: string | null;
  roomId?: string | null;
  createdAt: string;
  editedAt: string | null;
  deletedAt: string | null;
  seenAt?: string | null;
  author: {
    id: string;
    username: string | null;
    name: string | null;
    image: string | null;
  };
};

export type DmConversationSummary = {
  id: string;
  createdAt: string;
  updatedAt: string;
  otherUser: DmUser;
  latestMessage: DmMessage | null;
};
