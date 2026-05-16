import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getConversationPeer } from "@/lib/conversations";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ conversationId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { conversationId } = await params;

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: {
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
    },
  });

  if (!conversation) {
    return Response.json({ message: "Conversation not found." }, { status: 404 });
  }

  if (conversation.userAId !== session.user.id && conversation.userBId !== session.user.id) {
    return Response.json({ message: "You are not a participant in this conversation." }, { status: 403 });
  }

  return Response.json({
    conversation: {
      id: conversation.id,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    },
    otherUser: getConversationPeer(conversation, session.user.id),
  });
}
