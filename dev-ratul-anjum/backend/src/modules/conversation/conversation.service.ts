import { prisma } from "$/prisma/index.js";
import { TCreateConversationSchema } from "./conversation.schema.js";
import { Prisma } from "$/prisma/generated/client.js";
import { getRelativeTime } from "$/utils/dateFormatter.js";
import { ApiError } from "$/middlewares/errorHandler.js";

const createConversation = async (
  data: TCreateConversationSchema,
  creatorId: string,
) => {
  const newConversation = await prisma.conversation.create({
    data: {
      creatorId,
      participantId: data.participantId,
    },
  });

  return newConversation.id;
};

const deleteConversation = async (userId: string, conversationId: string) => {
  await prisma.conversation.delete({
    where: {
      id: conversationId,
      OR: [{ creatorId: userId }, { participantId: userId }],
    },
  });
};

// Get Conversations
const getConversations = async (
  currentUserId: string,
  options: { query?: string; page?: number },
) => {
  const limit = 10;
  const pageNumber = options.page ?? 1;
  const skip = (pageNumber - 1) * limit;

  const where: Prisma.ConversationWhereInput = {
    OR: [
      {
        creatorId: currentUserId,
        ...(options.query
          ? {
              participant: {
                OR: [
                  {
                    name: {
                      contains: options.query,
                      mode: "insensitive",
                    },
                  },
                  {
                    email: {
                      contains: options.query,
                      mode: "insensitive",
                    },
                  },
                ],
              },
            }
          : {}),
      },
      {
        participantId: currentUserId,
        ...(options.query
          ? {
              creator: {
                OR: [
                  {
                    name: {
                      contains: options.query,
                      mode: "insensitive",
                    },
                  },
                  {
                    email: {
                      contains: options.query,
                      mode: "insensitive",
                    },
                  },
                ],
              },
            }
          : {}),
      },
    ],
  };

  const totalConversations = await prisma.conversation.count({
    where,
  });

  const conversations = await prisma.conversation.findMany({
    where,
    skip,
    take: limit,
    select: {
      id: true,
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
      messages: {
        orderBy: { updatedAt: "desc" },
        take: 1,
        select: {
          text: true,
          updatedAt: true,
          attachments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Map only once for UI shape
  const formattedConversations = conversations.map((conv) => {
    const lastMessage = conv.messages[0]; // always 0 or undefined
    const isCreator = conv.creator.id === currentUserId;
    const otherUser = isCreator ? conv.participant : conv.creator;

    return {
      id: conv.id,
      participantName: otherUser.name,
      participantPhoto: otherUser.image,
      lastMessage: lastMessage?.text ?? null,
      lastMessageAt: lastMessage?.updatedAt
        ? getRelativeTime(lastMessage.updatedAt)
        : null,
      attachments: lastMessage?.attachments?.length > 0 || false,
    };
  });

  const totalPages = Math.ceil(totalConversations / limit);
  const hasPrevPage = pageNumber > 1;
  const hasNextPage = pageNumber < totalPages;

  return {
    conversations: formattedConversations,
    meta: {
      totalConversations,
      currentPage: pageNumber,
      prevPage: hasPrevPage ? pageNumber - 1 : null,
      nextPage: hasNextPage ? pageNumber + 1 : null,
      hasPrevPage,
      hasNextPage,
    },
  };
};

// Get Conversation Info
const getConversationInfo = async (
  currentUserId: string,
  conversationId: string,
) => {
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
      OR: [{ creatorId: currentUserId }, { participantId: currentUserId }],
    },
    select: {
      creator: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
          bio: true,
        },
      },
      participant: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
          bio: true,
        },
      },
    },
  });
  if (!conversation) {
    throw new ApiError(404, "No conversation found with the provided id.");
  }

  const otherUser =
    conversation.creator.id === currentUserId
      ? conversation.participant
      : conversation.creator;

  const messages = await prisma.message.findMany({
    where: {
      conversationId,
      attachments: { isEmpty: false },
    },
    select: {
      attachments: true,
    },
  });

  const totalAttachments = messages.reduce(
    (sum, m) => sum + m.attachments.length,
    0,
  );

  return {
    totalAttachments,
    participantId: otherUser.id,
    participantName: otherUser.name,
    participantPhoto: otherUser.image,
    participantEmail: otherUser.email,
    participantBio: otherUser.bio,
  };
};

const conversationService = {
  createConversation,
  deleteConversation,
  getConversations,
  getConversationInfo,
};

export default conversationService;
