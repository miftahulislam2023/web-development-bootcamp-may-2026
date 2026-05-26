import { prisma } from "../../../lib/prisma";
import ApiError from "../../../utils/apiErrors";
import { IOptions, paginationHelper } from "../../../utils/paginationHelper";

const getAllUsers = async (
  search?: string,
  options?: IOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(
    options || {}
  );

  const whereClause = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isEmailVerified: true,
        isSuspended: true,
        suspendedAt: true,
        createdAt: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where: whereClause }),
  ]);

  return {
    users,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const suspendUser = async (userId: string, reason?: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role === "SUPER_ADMIN") {
    throw new ApiError(403, "Cannot suspend a super admin");
  }

  if (user.isSuspended) {
    throw new ApiError(400, "User is already suspended");
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      isSuspended: true,
      suspendedAt: new Date(),
    },
    select: {
      id: true,
      name: true,
      email: true,
      isSuspended: true,
      suspendedAt: true,
    },
  });

  return updated;
};

const unsuspendUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.isSuspended) {
    throw new ApiError(400, "User is not suspended");
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      isSuspended: false,
      suspendedAt: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      isSuspended: true,
    },
  });

  return updated;
};

const getStats = async () => {
  const [
    totalUsers,
    totalConversations,
    totalMessages,
    activeUsersToday,
    suspendedUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.conversation.count(),
    prisma.message.count(),
    prisma.user.count({
      where: {
        lastSeen: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    prisma.user.count({
      where: { isSuspended: true },
    }),
  ]);

  const messagesThisWeek = await prisma.message.count({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    },
  });

  return {
    totalUsers,
    totalConversations,
    totalMessages,
    activeUsersToday,
    suspendedUsers,
    messagesThisWeek,
  };
};

const getConversations = async (options?: IOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(
    options || {}
  );

  const [conversations, total] = await Promise.all([
    prisma.conversation.findMany({
      select: {
        id: true,
        type: true,
        createdAt: true,
        lastMessageAt: true,
        participants: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: { messages: true },
        },
      },
      skip,
      take: limit,
      orderBy: { lastMessageAt: "desc" },
    }),
    prisma.conversation.count(),
  ]);

  const formatted = conversations.map((conv) => ({
    id: conv.id,
    type: conv.type,
    createdAt: conv.createdAt,
    lastMessageAt: conv.lastMessageAt,
    messageCount: conv._count.messages,
    participants: conv.participants.map((p) => p.user),
  }));

  return {
    conversations: formatted,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const deleteConversation = async (conversationId: string) => {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  await prisma.conversation.delete({
    where: { id: conversationId },
  });

  return { message: "Conversation deleted successfully" };
};

export const AdminService = {
  getAllUsers,
  suspendUser,
  unsuspendUser,
  getStats,
  getConversations,
  deleteConversation,
};