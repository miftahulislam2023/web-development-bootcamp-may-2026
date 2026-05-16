import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMessagesQuerySchema, sendMessageSchema } from "@/lib/validations/messages";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = sendMessageSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      {
        message: "Invalid request body.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const room = await prisma.room.findUnique({
    where: { id: parsed.data.roomId },
    select: { id: true },
  });

  if (!room) {
    return Response.json({ message: "Room not found." }, { status: 404 });
  }

  const membership = await prisma.roomMember.findUnique({
    where: {
      roomId_userId: {
        roomId: parsed.data.roomId,
        userId: session.user.id,
      },
    },
    select: { id: true },
  });

  if (!membership) {
    return Response.json({ message: "You are not a member of this room." }, { status: 403 });
  }

  const message = await prisma.message.create({
    data: {
      roomId: parsed.data.roomId,
      authorId: session.user.id,
      content: parsed.data.content,
    },
    select: {
      id: true,
      content: true,
      roomId: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return Response.json(message, { status: 201 });
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = getMessagesQuerySchema.safeParse({
    roomId: searchParams.get("roomId") ?? undefined,
    cursor: searchParams.get("cursor") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  });

  if (!parsed.success) {
    return Response.json(
      {
        message: "Invalid query parameters.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const room = await prisma.room.findUnique({
    where: { id: parsed.data.roomId },
    select: { id: true },
  });

  if (!room) {
    return Response.json({ message: "Room not found." }, { status: 404 });
  }

  const membership = await prisma.roomMember.findUnique({
    where: {
      roomId_userId: {
        roomId: parsed.data.roomId,
        userId: session.user.id,
      },
    },
    select: { id: true },
  });

  if (!membership) {
    return Response.json({ message: "You are not a member of this room." }, { status: 403 });
  }

  const take = parsed.data.limit + 1;

  const messages = await prisma.message.findMany({
    where: {
      roomId: parsed.data.roomId,
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    take,
    ...(parsed.data.cursor
      ? {
          cursor: { id: parsed.data.cursor },
          skip: 1,
        }
      : {}),
    select: {
      id: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
        },
      },
    },
  });

  let nextCursor: string | null = null;
  let paginatedMessages = messages;

  if (messages.length > parsed.data.limit) {
    const nextItem = messages[messages.length - 1];
    nextCursor = nextItem.id;
    paginatedMessages = messages.slice(0, parsed.data.limit);
  }

  return Response.json({
    messages: paginatedMessages,
    nextCursor,
  });
}
