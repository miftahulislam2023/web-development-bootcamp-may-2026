import { prisma } from '@/config/prisma';
import { ApiError } from '@/utils/api-error';
import { escapeHtml } from '@/socket/utils/sanitize';
import { logger } from '@/utils/logger';
import type { SaveMessageInput, ChatMessageResponse } from '@/modules/chat/chat.types';
import type { ChatMessage } from '@prisma/client';

const DEFAULT_HISTORY_LIMIT = 50;

// ── Slow Mode Tracking ──
// Maps `userId:roomKey` → last message timestamp (epoch ms).
// Guests use `guest:senderName:roomKey` as key.
const lastMessageTimestamps = new Map<string, number>();

// Periodic cleanup to prevent unbounded memory growth
const SLOW_MODE_CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
const SLOW_MODE_ENTRY_TTL_MS = 60 * 60 * 1000;

setInterval(() => {
  const cutoff = Date.now() - SLOW_MODE_ENTRY_TTL_MS;
  for (const [key, timestamp] of lastMessageTimestamps.entries()) {
    if (timestamp < cutoff) {
      lastMessageTimestamps.delete(key);
    }
  }
}, SLOW_MODE_CLEANUP_INTERVAL_MS);

function getSlowModeKey(senderId: number | null, senderName: string, roomKey: string): string {
  if (senderId) {
    return `${senderId}:${roomKey}`;
  }
  return `guest:${senderName}:${roomKey}`;
}

function toChatMessageResponse(msg: ChatMessage): ChatMessageResponse {
  return {
    id: msg.id,
    roomId: msg.room_id,
    sessionId: msg.session_id,
    senderId: msg.sender_id,
    senderName: msg.sender_name,
    text: msg.text,
    isPinned: msg.is_pinned,
    isDeleted: msg.is_deleted,
    createdAt: msg.created_at.toISOString(),
  };
}

// ── Public API ──

export async function saveMessage(input: SaveMessageInput): Promise<ChatMessageResponse> {
  const { roomKey, text, senderId, senderName } = input;

  // Fetch room with active session
  const room = await prisma.room.findUnique({
    where: { room_key: roomKey },
    select: {
      id: true,
      status: true,
      slow_mode_interval: true,
      guest_chat_enabled: true,
      host_id: true,
    },
  });

  if (!room) {
    throw ApiError.notFound('Room not found');
  }

  if (room.status !== 'LIVE') {
    throw ApiError.badRequest('Room is not currently live');
  }

  // Guest chat restriction
  const isGuest = senderId === null;
  if (isGuest && !room.guest_chat_enabled) {
    throw ApiError.forbidden('Guest chat is disabled for this room');
  }

  // Slow mode enforcement (skip for host)
  const isHost = senderId !== null && senderId === room.host_id;
  if (!isHost && room.slow_mode_interval) {
    const slowModeKey = getSlowModeKey(senderId, senderName, roomKey);
    const lastTimestamp = lastMessageTimestamps.get(slowModeKey);
    const now = Date.now();

    if (lastTimestamp) {
      const elapsedSeconds = (now - lastTimestamp) / 1000;
      if (elapsedSeconds < room.slow_mode_interval) {
        const remaining = Math.ceil(room.slow_mode_interval - elapsedSeconds);
        throw ApiError.badRequest(`Slow mode: wait ${remaining}s before sending another message`);
      }
    }

    lastMessageTimestamps.set(slowModeKey, now);
  }

  // Find active stream session
  const activeSession = await prisma.streamSession.findFirst({
    where: { room_id: room.id, ended_at: null },
    select: { id: true },
    orderBy: { started_at: 'desc' },
  });

  if (!activeSession) {
    throw ApiError.notFound('No active stream session');
  }

  // Sanitize text for XSS prevention
  const sanitizedText = escapeHtml(text.trim());

  // Persist message and increment total_chat_messages atomically
  const [message] = await prisma.$transaction([
    prisma.chatMessage.create({
      data: {
        room_id: room.id,
        session_id: activeSession.id,
        sender_id: senderId,
        sender_name: senderName,
        text: sanitizedText,
      },
    }),
    prisma.streamSession.update({
      where: { id: activeSession.id },
      data: { total_chat_messages: { increment: 1 } },
    }),
  ]);

  return toChatMessageResponse(message);
}

export async function getRecentMessages(
  roomKey: string,
  limit: number = DEFAULT_HISTORY_LIMIT,
): Promise<ChatMessageResponse[]> {
  const room = await prisma.room.findUnique({
    where: { room_key: roomKey },
    select: { id: true },
  });

  if (!room) {
    return [];
  }

  // Find the latest session (active or most recent ended)
  const session = await prisma.streamSession.findFirst({
    where: { room_id: room.id },
    select: { id: true },
    orderBy: { started_at: 'desc' },
  });

  if (!session) {
    return [];
  }

  const messages = await prisma.chatMessage.findMany({
    where: {
      room_id: room.id,
      session_id: session.id,
      is_deleted: false,
    },
    orderBy: { created_at: 'desc' },
    take: limit,
  });

  return messages.reverse().map(toChatMessageResponse);
}

export async function deleteMessage(messageId: number, hostId: number): Promise<void> {
  const message = await prisma.chatMessage.findUnique({
    where: { id: messageId },
    select: { id: true, room: { select: { host_id: true } } },
  });

  if (!message) {
    throw ApiError.notFound('Message not found');
  }

  if (message.room.host_id !== hostId) {
    throw ApiError.forbidden('Only the room host can delete messages');
  }

  await prisma.chatMessage.update({
    where: { id: messageId },
    data: { is_deleted: true, is_pinned: false },
  });
}

export async function pinMessage(messageId: number, hostId: number): Promise<void> {
  const message = await prisma.chatMessage.findUnique({
    where: { id: messageId },
    select: { id: true, room_id: true, room: { select: { host_id: true } } },
  });

  if (!message) {
    throw ApiError.notFound('Message not found');
  }

  if (message.room.host_id !== hostId) {
    throw ApiError.forbidden('Only the room host can pin messages');
  }

  // Unpin any currently pinned message in the same room, then pin the target
  await prisma.$transaction([
    prisma.chatMessage.updateMany({
      where: { room_id: message.room_id, is_pinned: true },
      data: { is_pinned: false },
    }),
    prisma.chatMessage.update({
      where: { id: messageId },
      data: { is_pinned: true },
    }),
  ]);

  logger.info({ messageId }, '[Chat Service] Message pinned');
}

export async function unpinMessage(messageId: number, hostId: number): Promise<void> {
  const message = await prisma.chatMessage.findUnique({
    where: { id: messageId },
    select: { id: true, room: { select: { host_id: true } } },
  });

  if (!message) {
    throw ApiError.notFound('Message not found');
  }

  if (message.room.host_id !== hostId) {
    throw ApiError.forbidden('Only the room host can unpin messages');
  }

  await prisma.chatMessage.update({
    where: { id: messageId },
    data: { is_pinned: false },
  });

  logger.info({ messageId }, '[Chat Service] Message unpinned');
}
