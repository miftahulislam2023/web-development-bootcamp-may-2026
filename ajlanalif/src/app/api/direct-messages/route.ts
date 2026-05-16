import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDirectMessagesQuerySchema, sendDirectMessageSchema } from "@/lib/validations/direct-messages";

const directMessageSelect = {
  id: true,
  content: true,
  conversationId: true,
  createdAt: true,
  updatedAt: true,
  editedAt: true,
  deletedAt: true,
  author: {
    select: {
      id: true,
      username: true,
      name: true,
      image: true,
    },
  },
} as const;

async function assertConversationAccess(conversationId: string, userId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: {
      id: true,
      userAId: true,
      userBId: true,
    },
  });

  if (!conversation) {
    return { error: Response.json({ message: "Conversation not found." }, { status: 404 }) };
  }

  if (conversation.userAId !== userId && conversation.userBId !== userId) {
    return { error: Response.json({ message: "You are not a participant in this conversation." }, { status: 403 }) };
  }

  return { conversation };
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = getDirectMessagesQuerySchema.safeParse({
    conversationId: searchParams.get("conversationId") ?? undefined,
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

  const access = await assertConversationAccess(parsed.data.conversationId, session.user.id);

  if ("error" in access) {
    return access.error;
  }

  const take = parsed.data.limit + 1;

  const messages = await prisma.message.findMany({
    where: {
      conversationId: parsed.data.conversationId,
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
    select: directMessageSelect,
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

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = sendDirectMessageSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      {
        message: "Invalid request body.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const access = await assertConversationAccess(parsed.data.conversationId, session.user.id);

  if ("error" in access) {
    return access.error;
  }

  const message = await prisma.message.create({
    data: {
      conversationId: parsed.data.conversationId,
      authorId: session.user.id,
      content: parsed.data.content,
    },
    select: directMessageSelect,
  });

  await prisma.conversation.update({
    where: { id: parsed.data.conversationId },
    data: { updatedAt: new Date() },
  });

  return Response.json(message, { status: 201 });
}
