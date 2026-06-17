import bcrypt from "bcryptjs";
import { ApiError } from "$/middlewares/errorHandler.js";
import { prisma } from "$/prisma/index.js";
import { uploadToCloudinary } from "$/utils/fileUploader.js";
import {
  TRegisterUserSchema,
  TUpdateUserProfileSchema,
} from "./user.schema.js";
import { Prisma } from "$/prisma/generated/client.js";
import isBlocked from "$/services/block.service.js";

const getUsersForAddNewChat = async (
  currentUserId: string,
  query: string,
  page?: number,
) => {
  const limit = 10;
  const pageNumber = page ?? 1;
  const skip = (pageNumber - 1) * limit;

  const OR: Prisma.UserWhereInput["OR"] = [
    {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    {
      email: {
        contains: query,
        mode: "insensitive",
      },
    },
  ];

  const totalUsers = await prisma.user.count({
    where: { OR },
  });

  let users = await prisma.user.findMany({
    where: {
      OR,
    },
    take: limit,
    skip,
    select: {
      name: true,
      image: true,
      id: true,
    },
  });

  users = await Promise.all(
    users.map(async (user) => {
      const conversation = await prisma.conversation.findFirst({
        where: {
          OR: [
            { creatorId: currentUserId, participantId: user.id },
            { creatorId: user.id, participantId: currentUserId },
          ],
        },
      });

      return {
        ...user,
        hasConversation: !!conversation,
        conversationId: conversation?.id ?? null,
      };
    }),
  );

  const totalPages = Math.ceil(totalUsers / limit);
  const hasPrevPage = pageNumber > 1;
  const hasNextPage = pageNumber < totalPages;

  return {
    users,
    meta: {
      totalPages,
      currentPage: pageNumber,
      prevPage: hasPrevPage ? pageNumber - 1 : null,
      nextPage: hasNextPage ? pageNumber + 1 : null,
      hasPrevPage,
      hasNextPage,
    },
  };
};

// Update User Profile
const updateUserProfile = async (
  currentUserId: string,
  data: TUpdateUserProfileSchema,
  photo?: string,
) => {
  if (photo || data.name || data.bio) {
    await prisma.user.update({
      where: {
        id: currentUserId,
      },
      data: {
        ...data,
        image: photo,
      },
    });
  }
};

// Block User
const blockUser = async (blockerId: string, blockedId: string) => {
  if (blockerId === blockedId) {
    throw new ApiError(400, "Cannot block yourself");
  }

  await prisma.userBlock.create({
    data: {
      blockerId,
      blockedId,
    },
  });
};

// Unblock User
const unblockUser = async (blockerId: string, blockedId: string) => {
  await prisma.userBlock.delete({
    where: {
      blockerId_blockedId: {
        blockerId,
        blockedId,
      },
    },
  });
};

// Check Block User
const checkBlockUser = async (blockerId: string, blockedId: string) => {
  let block = await prisma.userBlock.findFirst({
    where: { blockerId, blockedId },
    select: {
      blockerId: true,
      blocker: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!block) {
    block = await prisma.userBlock.findFirst({
      where: { blockerId: blockedId, blockedId: blockerId },

      select: {
        blockerId: true,
        blocker: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  if (!block) {
    return { isBlocked: false };
  }
  return {
    isBlocked: true,
    blockedByMe: block.blockerId === blockerId,
    blockerName: block.blocker.name,
  };
};

// Report User
const reportUser = async (reporterId: string, reportedUserId: string) => {
  if (reporterId === reportedUserId) {
    throw new ApiError(400, "Cannot report yourself");
  }

  await prisma.userReport.create({
    data: {
      reporterId,
      reportedUserId,
    },
  });
};

const getProfile = async (currentUserId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: currentUserId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      image: true,
    },
  });
  return user;
};

const userService = {
  getUsersForAddNewChat,
  updateUserProfile,
  blockUser,
  unblockUser,
  checkBlockUser,
  reportUser,
  getProfile,
};

export default userService;
