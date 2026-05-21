export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req) {
  const payload = getUserFromRequest(req);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get users the current user hasn't chatted with yet
  const myConvos = await prisma.conversation.findMany({
    where: { OR: [{ userAId: payload.id }, { userBId: payload.id }] },
    select: { userAId: true, userBId: true },
  });

  const chattedIds = myConvos.flatMap((c) => [c.userAId, c.userBId]).filter((id) => id !== payload.id);

  const suggested = await prisma.user.findMany({
    where: {
      AND: [{ id: { not: payload.id } }, { id: { notIn: chattedIds } }],
    },
    select: { id: true, name: true, username: true, avatar: true, isOnline: true },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  // Get users who have blocked the current user
  const blocksMe = await prisma.block.findMany({
    where: { blockedId: payload.id },
    select: { blockerId: true },
  });
  const blockerIds = new Set(blocksMe.map((b) => b.blockerId));

  const suggestedWithStatusMasked = suggested.map((u) => {
    if (blockerIds.has(u.id)) {
      return { ...u, isOnline: false, lastSeen: null };
    }
    return u;
  });

  return NextResponse.json({ users: suggestedWithStatusMasked });
}
