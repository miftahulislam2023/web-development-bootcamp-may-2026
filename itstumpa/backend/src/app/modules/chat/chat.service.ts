import { prisma } from "../../../lib/prisma";
import ApiError from "../../../utils/apiErrors";
import { IOptions, paginationHelper } from "../../../utils/paginationHelper";

const getConversation = async (
  conversationId: string,
  userId: string,
  options?: IOptions,
) => {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: {
      id: true,
      type: true,
      participants: { select: { userId: true } },
    },
  });

  if (!conversation) throw new ApiError(404, "Conversation not found");

  const isParticipant = conversation.participants.some(
    (p) => p.userId === userId,
  );
  if (!isParticipant)
    throw new ApiError(403, "You are not allowed to view this conversation");

  // Pagination
  const { page, limit, skip } = paginationHelper.calculatePagination(
    options || {},
  );

  const messages = await prisma.message.findMany({
    where: { conversationId },
    select: {
      id: true,
      senderId: true,
      content: true,
      fileUrl: true,
      fileName: true,
      fileType: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
    skip,
    take: limit,
  });

  const otherUserId = conversation.participants.map((p) => p.userId);

  return {
    id: conversation.id,
    type: conversation.type,
    participants: otherUserId,
    page,
    limit,
    messages,
  };
};

const createMessage = async (
  conversationId: string,
  senderId: string,
  content?: string,
  fileData?: {
    fileUrl: string;
    fileName: string;
    fileType: string;
    fileSize: number;
  },
) => {
  if (!content && !fileData) {
    throw new ApiError(400, "Message must have content or file");
  }

  const participant = await prisma.conversationParticipant.findFirst({
    where: {
      conversationId,
      userId: senderId,
    },
  });

  if (!participant) {
    throw new ApiError(
      403,
      "You are not allowed to send messages in this conversation",
    );
  }

  const newMessage = await prisma.message.create({
    data: {
      conversationId,
      senderId,
      content,
      ...fileData,
    },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      lastMessageAt: new Date(),
    },
  });

  return newMessage;
};

const createConversation = async (participantIds: string[]) => {
  if (participantIds.length !== 2) {
    throw new ApiError(400, "Direct conversation must contain exactly 2 users");
  }

  const conversation = await prisma.conversation.create({
    data: {
      type: "DIRECT",
      participants: {
        create: participantIds.map((userId) => ({ userId })),
      },
    },
  });

  return conversation;
};

const getOrCreateConversation = async (participantIds: string[]) => {
    const validParticipantIds = participantIds.filter(
    (id): id is string => Boolean(id)
  );
  if (validParticipantIds.length !== 2) {
    throw new ApiError(400, "Direct conversation requires exactly 2 valid users");
  }

  if (validParticipantIds[0] === validParticipantIds[1]) {
    throw new ApiError(
      400,
      "You cannot create a conversation with yourself"
    );
  }

  const existingConversation = await prisma.conversation.findFirst({
    where: {
      type: "DIRECT",
      participants: {
        every: {
          userId: { in: validParticipantIds },
        },
      },
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              isOnline: true,
              lastSeen: true,
            },
          },
        },
      },
    },
  });

  if (existingConversation) return existingConversation;

  return createConversation(validParticipantIds);
};

const deleteConversation = async (conversationId: string, userId: string) => {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      participants: true,
    },
  });

  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  const isParticipant = conversation.participants.some(
    (p) => p.userId === userId,
  );

  if (!isParticipant) {
    throw new ApiError(403, "You are not allowed to delete this conversation");
  }

  await prisma.conversation.delete({
    where: { id: conversationId },
  });

  return { message: "Conversation deleted successfully" };
};

const getUserConversations = async (userId: string) => {
  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: { userId },
      },
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              isOnline: true,
              lastSeen: true,
            },
          },
        },
      },
      messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          content: true,
          fileUrl: true,
          fileName: true,
          senderId: true,
          createdAt: true,
          status: true,
        },
      },
    },
    orderBy: { lastMessageAt: "desc" },
  });

  return conversations.map((conv) => ({
    ...conv,
    otherUser: conv.participants.find((p) => p.userId !== userId)?.user,
    lastMessage: conv.messages[0] || null,
  }));
};



export const ChatService = {
  getConversation,
  createMessage,
  createConversation,
  getOrCreateConversation,
  deleteConversation,
  getUserConversations,
};