export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req) {
  const payload = getUserFromRequest(req);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const convos = await prisma.conversation.findMany({
    where: { OR: [{ userAId: payload.id }, { userBId: payload.id }] },
    include: {
      userA: { select: { id: true, name: true, username: true, avatar: true, isOnline: true, lastSeen: true } },
      userB: { select: { id: true, name: true, username: true, avatar: true, isOnline: true, lastSeen: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { sender: { select: { id: true, name: true } } },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Get users who have blocked the current user
  const blocksMe = await prisma.block.findMany({
    where: { blockedId: payload.id },
    select: { blockerId: true },
  });
  const blockerIds = new Set(blocksMe.map((b) => b.blockerId));

  const formatted = convos.map((c) => {
    const other = c.userAId === payload.id ? c.userB : c.userA;
    const lastMsg = c.messages[0];

    // If the other user has blocked me, mask their online status and lastSeen
    if (blockerIds.has(other.id)) {
      other.isOnline = false;
      other.lastSeen = null;
    }

    return {
      id: c.id,
      other,
      lastMessage: lastMsg
        ? {
            content: lastMsg.content,
            senderId: lastMsg.senderId,
            senderName: lastMsg.sender.name,
            createdAt: lastMsg.createdAt,
          }
        : null,
      updatedAt: c.updatedAt,
    };
  });

  return NextResponse.json({ conversations: formatted });
}

export async function POST(req) {
  const payload = getUserFromRequest(req);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  // Ensure consistent ordering
  const [userAId, userBId] = [payload.id, userId].sort();

  let convo = await prisma.conversation.findUnique({ where: { userAId_userBId: { userAId, userBId } } });

  if (!convo) {
    convo = await prisma.conversation.create({ data: { userAId, userBId } });
  }

  return NextResponse.json({ conversationId: convo.id });
}
