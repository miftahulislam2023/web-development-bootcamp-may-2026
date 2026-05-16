import { RoomStatus } from '@prisma/client';
import { prisma } from '@/config/prisma';
import { ApiError } from '@/utils/api-error';
import { toStreamSessionResponse, toStreamSessionSummary } from '@/helpers/streams.helpers';
import { getIO } from '@/socket/socket-server';
import { logger } from '@/utils/logger';
import type { StreamSessionResponse, StreamSessionSummary } from '@/modules/streams/streams.types';

const MS_PER_SECOND = 1000;
const MAX_STREAM_SESSIONS = 50;
const STREAM_CLEANUP_GRACE_PERIOD = 30 * 1000; // 30 seconds

// Tracks pending auto-end timers for rooms where the host has disconnected.
const cleanupTimeouts = new Map<string, NodeJS.Timeout>();

async function getOwnedRoomOrThrow(roomKey: string, hostId: number) {
  const room = await prisma.room.findUnique({ where: { room_key: roomKey } });

  if (!room) {
    throw ApiError.notFound('Room not found');
  }

  if (room.host_id !== hostId) {
    throw ApiError.forbidden('You do not own this room');
  }

  return room;
}

export async function startStream(
  roomKey: string,
  hostId: number,
): Promise<StreamSessionResponse> {
  const room = await getOwnedRoomOrThrow(roomKey, hostId);

  if (room.status === RoomStatus.LIVE) {
    throw ApiError.badRequest('Room is already live');
  }

  const [session] = await prisma.$transaction([
    prisma.streamSession.create({
      data: { room_id: room.id },
    }),
    prisma.room.update({
      where: { room_key: roomKey },
      data: { status: RoomStatus.LIVE },
    }),
  ]);

  return toStreamSessionResponse(session);
}

export async function endStream(
  roomKey: string,
  hostId: number,
): Promise<StreamSessionResponse> {
  // Cancel any pending auto-end timer since the host is ending manually
  cancelStreamCleanup(roomKey);

  const room = await getOwnedRoomOrThrow(roomKey, hostId);

  if (room.status !== RoomStatus.LIVE) {
    throw ApiError.badRequest('Room is not currently live');
  }

  const activeSession = await prisma.streamSession.findFirst({
    where: {
      room_id: room.id,
      ended_at: null,
    },
    orderBy: { started_at: 'desc' },
  });

  if (!activeSession) {
    throw ApiError.notFound('No active stream session found');
  }

  const now = new Date();
  const durationMs = now.getTime() - activeSession.started_at.getTime();
  const durationSeconds = Math.floor(durationMs / MS_PER_SECOND);

  const [updatedSession] = await prisma.$transaction([
    prisma.streamSession.update({
      where: { id: activeSession.id },
      data: {
        ended_at: now,
        duration_seconds: durationSeconds,
      },
    }),
    prisma.room.update({
      where: { room_key: roomKey },
      data: { status: RoomStatus.ENDED },
    }),
  ]);

  // Notify all connected viewers in the room instantly via Socket.IO
  try {
    getIO().to(roomKey).emit('stream-ended', { roomKey });
  } catch (error) {
    logger.error({ error, roomKey }, '[Streams] Failed to emit stream-ended event');
  }

  return toStreamSessionResponse(updatedSession);
}

export async function forceEndStream(roomKey: string): Promise<void> {
  const room = await prisma.room.findUnique({ where: { room_key: roomKey } });

  if (!room || room.status !== RoomStatus.LIVE) {
    return;
  }

  const activeSession = await prisma.streamSession.findFirst({
    where: {
      room_id: room.id,
      ended_at: null,
    },
    orderBy: { started_at: 'desc' },
  });

  if (!activeSession) return;

  const now = new Date();
  const durationMs = now.getTime() - activeSession.started_at.getTime();
  const durationSeconds = Math.floor(durationMs / MS_PER_SECOND);

  await prisma.$transaction([
    prisma.streamSession.update({
      where: { id: activeSession.id },
      data: {
        ended_at: now,
        duration_seconds: durationSeconds,
      },
    }),
    prisma.room.update({
      where: { room_key: roomKey },
      data: { status: RoomStatus.ENDED },
    }),
  ]);

  try {
    getIO().to(roomKey).emit('stream-ended', { roomKey });
  } catch (error) {
    logger.error({ error, roomKey }, '[Streams] Failed to emit stream-ended event from webhook');
  }
}

/**
 * Schedules a stream to be automatically ended after a grace period.
 * Used as a fallback when a host disconnects via Socket.IO or LiveKit.
 */
export function scheduleStreamCleanup(roomKey: string): void {
  if (cleanupTimeouts.has(roomKey)) {
    return;
  }

  logger.info({ roomKey }, '[Streams] Host disconnected. Scheduling auto-end grace period.');

  const timeout = setTimeout(async () => {
    logger.info({ roomKey }, '[Streams] Grace period expired. Auto-ending stream.');
    try {
      await forceEndStream(roomKey);
    } catch (error) {
      logger.error({ error, roomKey }, '[Streams] Failed to auto-end stream');
    } finally {
      cleanupTimeouts.delete(roomKey);
    }
  }, STREAM_CLEANUP_GRACE_PERIOD);

  cleanupTimeouts.set(roomKey, timeout);
}

/**
 * Cancels a pending stream cleanup timer.
 * Used when a host reconnects before the grace period expires.
 */
export function cancelStreamCleanup(roomKey: string): void {
  const timeout = cleanupTimeouts.get(roomKey);
  if (timeout) {
    logger.info({ roomKey }, '[Streams] Host reconnected. Cancelling auto-end timer.');
    clearTimeout(timeout);
    cleanupTimeouts.delete(roomKey);
  }
}

export async function getStreamHistory(
  roomKey: string,
  hostId: number,
): Promise<StreamSessionResponse[]> {
  const room = await getOwnedRoomOrThrow(roomKey, hostId);

  const sessions = await prisma.streamSession.findMany({
    where: { room_id: room.id },
    orderBy: { started_at: 'desc' },
    take: MAX_STREAM_SESSIONS,
  });

  return sessions.map(toStreamSessionResponse);
}

export async function getStreamSummary(
  roomKey: string,
  sessionId: number,
  hostId: number,
): Promise<StreamSessionSummary> {
  const room = await getOwnedRoomOrThrow(roomKey, hostId);

  const session = await prisma.streamSession.findFirst({
    where: {
      id: sessionId,
      room_id: room.id,
    },
    include: {
      room: {
        include: { host: { select: { name: true } } },
      },
    },
  });

  if (!session) {
    throw ApiError.notFound('Stream session not found');
  }

  return toStreamSessionSummary(session);
}

export async function getAllStreamHistory(
  hostId: number,
): Promise<StreamSessionSummary[]> {
  const sessions = await prisma.streamSession.findMany({
    where: {
      room: { host_id: hostId },
      ended_at: { not: null },
    },
    include: {
      room: {
        include: { host: { select: { name: true } } },
      },
    },
    orderBy: { started_at: 'desc' },
    take: MAX_STREAM_SESSIONS,
  });

  return sessions.map(toStreamSessionSummary);
}
