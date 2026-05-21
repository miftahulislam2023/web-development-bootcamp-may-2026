export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req) {
  const payload = getUserFromRequest(req);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  const users = await prisma.user.findMany({
    where: {
      AND: [
        { id: { not: payload.id } },
        {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { username: { contains: q, mode: "insensitive" } },
          ],
        },
      ],
    },
    select: { id: true, name: true, username: true, avatar: true, isOnline: true, lastSeen: true },
    take: 10,
  });

  // Get users who have blocked the current user
  const blocksMe = await prisma.block.findMany({
    where: { blockedId: payload.id },
    select: { blockerId: true },
  });
  const blockerIds = new Set(blocksMe.map((b) => b.blockerId));

  const usersWithStatusMasked = users.map((u) => {
    if (blockerIds.has(u.id)) {
      return { ...u, isOnline: false, lastSeen: null };
    }
    return u;
  });

  return NextResponse.json({ users: usersWithStatusMasked });
}
