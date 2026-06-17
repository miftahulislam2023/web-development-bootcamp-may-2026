import { ApiError } from "$/middlewares/errorHandler.js";
import { Prisma } from "$/prisma/generated/client.js";
import { prisma } from "$/prisma/index.js";
import isBlocked from "$/services/block.service.js";
import { formatContextualDateTime } from "$/utils/dateFormatter.js";
import { TCreateMessageSchema } from "./message.schema.js";

const createMessage = async (
  data: TCreateMessageSchema,
  senderId: string,
  attachments: string[],
) => {
  const blocked = await isBlocked(senderId, data.receiverId);
  if (blocked) {
    throw new ApiError(403, "You cannot message this user");
  }

  const newMessage = await prisma.message.create({
    data: {
      ...(data.text ? { text: data.text } : {}),
      attachments,
      senderId,
      receiverId: data.receiverId,
      conversationId: data.conversationId,
    },
    select: {
      id: true,
      text: true,
      attachments: true,
      senderId: true,
      updatedAt: true,
    },
  });

  return {
    ...newMessage,
    updatedAt: formatContextualDateTime(newMessage.updatedAt),
  };
};

const deleteMessage = async (userId: string, messageId: string) => {
  await prisma.message.delete({
    where: {
      id: messageId,
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
  });
};

const getConversationMessages = async (
  currentUserId: string,
  conversationId: string,
  page?: number,
) => {
  const pageNumber = page || 1;
  const limit = 15;
  const skip = (pageNumber - 1) * limit;

  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      participant: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
  if (!conversation) {
    throw new ApiError(404, "Conversation not found.");
  }

  const where: Prisma.MessageWhereInput = {
    conversationId,
    OR: [{ senderId: currentUserId }, { receiverId: currentUserId }],
  };

  const messagesCount = await prisma.message.count({
    where,
  });
  const messages = await prisma.message.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      text: true,
      attachments: true,
      updatedAt: true,
      senderId: true,
      markAsStar: true,
    },
  });
  const finalMessages = messages.map((msg) => {
    return {
      ...msg,
      updatedAt: formatContextualDateTime(msg.updatedAt),
    };
  });

  const totalPages = Math.ceil(messagesCount / limit);
  const hasNextPage = totalPages > pageNumber;
  const hasPrevPage = pageNumber > 1;

  const isCreator = conversation.creator.id === currentUserId;
  const otherUser = isCreator ? conversation.participant : conversation.creator;

  return {
    participantId: otherUser.id,
    participantName: otherUser.name,
    participantPhoto: otherUser.image,
    messages: finalMessages,
    meta: {
      totalMessages: messagesCount,
      currentPage: pageNumber,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? pageNumber + 1 : null,
      prevPage: hasPrevPage ? pageNumber - 1 : null,
    },
  };
};

// Get Conversation Star Messages
const getConversationStarMessages = async (
  currentUserId: string,
  conversationId: string,
  page?: number,
) => {
  const pageNumber = page || 1;
  const limit = 15;
  const skip = (pageNumber - 1) * limit;

  const where = {
    conversationId,
    markAsStar: true,
    OR: [{ senderId: currentUserId }, { receiverId: currentUserId }],
  };

  const messagesCount = await prisma.message.count({
    where,
  });
  const messages = await prisma.message.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      text: true,
      attachments: true,
      updatedAt: true,
      sender: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      receiver: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const totalPages = Math.ceil(messagesCount / limit);
  const hasNextPage = totalPages > pageNumber;
  const hasPrevPage = pageNumber > 1;

  return {
    currentUserId,
    messages,
    meta: {
      totalMessages: messagesCount,
      currentPage: pageNumber,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? pageNumber + 1 : null,
      prevPage: hasPrevPage ? pageNumber - 1 : null,
    },
  };
};

// Get Conversation All Media
const getConversationMedia = async (
  currentUserId: string,
  conversationId: string,
  page?: number,
) => {
  const pageNumber = page || 1;
  const limit = 15;
  const skip = (pageNumber - 1) * limit;

  const where: Prisma.MessageWhereInput = {
    conversationId,
    attachments: {
      isEmpty: false,
    },
    OR: [{ senderId: currentUserId }, { receiverId: currentUserId }],
  };

  const attachmentMessagesCount = await prisma.message.count({
    where,
  });
  const messages = await prisma.message.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      attachments: true,
    },
  });

  const totalPages = Math.ceil(attachmentMessagesCount / limit);
  const hasNextPage = totalPages > pageNumber;
  const hasPrevPage = pageNumber > 1;

  return {
    messages,
    meta: {
      totalAttachmentMessages: attachmentMessagesCount,
      currentPage: pageNumber,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? pageNumber + 1 : null,
      prevPage: hasPrevPage ? pageNumber - 1 : null,
    },
  };
};

const messageService = {
  createMessage,
  deleteMessage,
  getConversationMessages,
  getConversationStarMessages,
  getConversationMedia,
};

export default messageService;
