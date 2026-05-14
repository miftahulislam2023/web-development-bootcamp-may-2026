import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";

export async function DELETE(req, { params }) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, msgId } = await params;

    // Verify message belongs to this conversation and sender is the requester
    const message = await prisma.message.findFirst({
      where: { id: msgId, conversationId: id, senderId: payload.id },
    });
    if (!message) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.message.delete({ where: { id: msgId } });

    // Get the other user in the conversation to notify them
    const convo = await prisma.conversation.findUnique({ where: { id } });
    const recipientId = convo.userAId === payload.id ? convo.userBId : convo.userAId;

    // Notify via Pusher — both the chat channel and recipient's personal channel
    await pusherServer.trigger(`chat_${id}`, "message:delete", { messageId: msgId, conversationId: id });
    await pusherServer.trigger(`user_${recipientId}`, "message:delete", { messageId: msgId, conversationId: id });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE message]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, msgId } = await params;
    const body = await req.json();
    const { content } = body;

    console.log("[PUT message] Attempting edit", { id, msgId, userId: payload.id, content });

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Verify message belongs to this conversation and sender is the requester
    const message = await prisma.message.findFirst({
      where: { id: msgId, conversationId: id, senderId: payload.id },
    });
    if (!message) {
      console.log("[PUT message] Not found or not authorized", { id, msgId, userId: payload.id });
      return NextResponse.json({ error: "Not found or not authorized" }, { status: 404 });
    }

    const updatedMessage = await prisma.message.update({
      where: { id: msgId },
      data: { content, isEdited: true },
    });

    console.log("[PUT message] Updated", updatedMessage);

    // Get the other user in the conversation to notify them
    const convo = await prisma.conversation.findUnique({ where: { id } });
    const recipientId = convo.userAId === payload.id ? convo.userBId : convo.userAId;

    // Notify via Pusher — chat channel and recipient's personal channel
    const eventData = { 
      messageId: msgId, 
      conversationId: id,
      content: updatedMessage.content,
      isEdited: updatedMessage.isEdited
    };
    
    await pusherServer.trigger(`chat_${id}`, "message:edit", eventData);
    await pusherServer.trigger(`user_${recipientId}`, "message:edit", eventData);

    return NextResponse.json({ message: updatedMessage });
  } catch (err) {
    console.error("[PUT message] ERROR", {
      error: err,
      stack: err?.stack,
      params
    });
    return NextResponse.json({ error: "Server error", details: err?.message }, { status: 500 });
  }
}
