import bcrypt from "bcrypt";
import { prisma } from "../../../lib/prisma";
import { Role } from "@prisma/client";
import ApiError from "../../../utils/apiErrors";

// CREATE
export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  role?: Role;
}) => {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    throw new ApiError(409, "Email already in use");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role ?? Role.USER,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
};

export const searchUsers = async (query: string) => {
  return prisma.user.findMany({
    where: {
      OR: [
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
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    take: 10, // important for performance
  });
};

// GET ONE
export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) throw new ApiError(404, "User not found");
  return user;
};

// ADMIN — get all users
export const getAllUsers = async (params: { page?: number; limit?: number }) => {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip,
    }),
    prisma.user.count(),
  ]);

  return {
    users,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// UPDATE
export const updateUser = async (
  id: string,
  data: { name?: string; email?: string }
) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new ApiError(404, "User not found");

  if (data.email) {
    const emailExists = await prisma.user.findFirst({
      where: {
        email: data.email,
        NOT: { id },
      },
    });

    if (emailExists) {
      throw new ApiError(409, "Email already in use");
    }
  }

  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};

// DELETE
export const deleteUser = async (id: string) => {
  try {
    await prisma.user.delete({ where: { id } });
    return { message: "User deleted successfully" };
  } catch (error) {
    throw new ApiError(404, "User not found");
  }
};