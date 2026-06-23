import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getConversationPeer, normalizeConversationUserIds } from "@/lib/conversations";
import { prisma } from "@/lib/prisma";
import { createOrOpenConversationSchema } from "@/lib/validations/direct-messages";

const conversationSelect = {
  id: true,
  userAId: true,
  userBId: true,
  createdAt: true,
  updatedAt: true,
  userA: {
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      image: true,
      bio: true,
      lastSeenAt: true,
    },
  },
  userB: {
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      image: true,
      bio: true,
      lastSeenAt: true,
    },
  },
  messages: {
    take: 1,
    orderBy: {
      createdAt: "desc" as const,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      editedAt: true,
      deletedAt: true,
      seenAt: true,
      author: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
        },
      },
    },
  },
} as const;

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createOrOpenConversationSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      {
        message: "Invalid request body.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  if (parsed.data.targetUserId === session.user.id) {
    return Response.json({ message: "You cannot start a conversation with yourself." }, { status: 400 });
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: parsed.data.targetUserId },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      image: true,
      bio: true,
    },
  });

  if (!targetUser) {
    return Response.json({ message: "User not found." }, { status: 404 });
  }

  const [userAId, userBId] = normalizeConversationUserIds(session.user.id, targetUser.id);

  const existingConversation = await prisma.conversation.findFirst({
    where: {
      OR: [
        { userAId, userBId },
        { userAId: userBId, userBId: userAId },
      ],
    },
    select: conversationSelect,
  });

  if (existingConversation) {
    return Response.json({
      conversation: {
        id: existingConversation.id,
        createdAt: existingConversation.createdAt,
        updatedAt: existingConversation.updatedAt,
      },
      targetUser,
      otherUser: getConversationPeer(existingConversation, session.user.id),
    });
  }

  const conversation = await prisma.conversation.create({
    data: {
      userAId,
      userBId,
    },
    select: conversationSelect,
  });

  return Response.json(
    {
      conversation: {
        id: conversation.id,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      },
      targetUser,
      otherUser: getConversationPeer(conversation, session.user.id),
    },
    { status: 201 }
  );
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ userAId: session.user.id }, { userBId: session.user.id }],
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: conversationSelect,
  });

  return Response.json(
    conversations.map((conversation) => {
      const latestMessage = conversation.messages[0] ?? null;
      const otherUser = getConversationPeer(conversation, session.user.id);

      return {
        id: conversation.id,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        otherUser,
        latestMessage,
      };
    })
  );
}
