export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req) {
  const user = getUserFromRequest(req);
  if (user) {
    await prisma.user.update({ where: { id: user.id }, data: { isOnline: false, lastSeen: new Date() } }).catch(() => {});
    
    // Trigger Pusher status
    const { pusherServer } = require("@/lib/pusher");
    await pusherServer.trigger("status_channel", "user:status", { userId: user.id, isOnline: false });
  }
  const res = NextResponse.json({ success: true });
  res.cookies.set("token", "", { maxAge: 0, path: "/" });
  return res;
}
