export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const convo = await prisma.conversation.findFirst({
      where: { id, OR: [{ userAId: payload.id }, { userBId: payload.id }] },
    });
    if (!convo) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const messages = await prisma.message.findMany({
      where: { conversationId: id },
      include: { sender: { select: { id: true, name: true, username: true, avatar: true } } },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ messages });
  } catch (err) {
    console.error("[GET messages]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { content, type = "text", replyToId } = await req.json();

    if (!content) return NextResponse.json({ error: "Content required" }, { status: 400 });

    const convo = await prisma.conversation.findFirst({
      where: { id, OR: [{ userAId: payload.id }, { userBId: payload.id }] },
    });
    if (!convo) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Block check — use findFirst to avoid composite key issues
    const recipientId = convo.userAId === payload.id ? convo.userBId : convo.userAId;
    const isBlocked = await prisma.block.findFirst({
      where: { blockerId: recipientId, blockedId: payload.id },
    });
    if (isBlocked) {
      return NextResponse.json({ error: "blocked" }, { status: 403 });
    }

    const message = await prisma.message.create({
      data: {
        content,
        type,
        senderId: payload.id,
        conversationId: id,
        replyToId: replyToId || null,
      },
      include: { sender: { select: { id: true, name: true, username: true, avatar: true } } },
    });

    await prisma.conversation.update({ where: { id }, data: { updatedAt: new Date() } });

    // Trigger Pusher
    const { pusherServer } = require("@/lib/pusher");
    await pusherServer.trigger(`chat_${id}`, "message:new", message);
    // Also trigger for recipient's personal channel for unread counts
    await pusherServer.trigger(`user_${recipientId}`, "message:new", message);

    return NextResponse.json({ message });
  } catch (err) {
    console.error("[POST messages]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
