import { nanoid } from 'nanoid';
import { RoomStatus } from '@prisma/client';
import { prisma } from '@/config/prisma';
import { ApiError } from '@/utils/api-error';
import { getIO } from '@/socket/socket-server';
import { toRoomResponse } from '@/helpers/rooms.helpers';
import type {
  RoomResponse,
  CreateRoomInput,
  UpdateRoomInput,
  LiveRoomResponse,
  RecentRoomResponse,
} from '@/modules/rooms/rooms.types';

const ROOM_KEY_LENGTH = 12;
const RECENT_ROOMS_HOURS = 24;
const MAX_RECENT_ROOMS = 12;

const HOST_SELECT = { host: { select: { name: true, avatar_url: true } } } as const;

async function getOwnedRoomOrThrow(roomKey: string, hostId: number) {
  const room = await prisma.room.findUnique({ where: { room_key: roomKey } });
  if (!room) throw ApiError.notFound('Room not found');
  if (room.host_id !== hostId) throw ApiError.forbidden('You do not own this room');
  return room;
}

export async function createRoom(hostId: number, input: CreateRoomInput): Promise<RoomResponse> {
  const roomKey = nanoid(ROOM_KEY_LENGTH);

  const room = await prisma.room.create({
    data: {
      host_id: hostId,
      room_key: roomKey,
      title: input.title,
      description: input.description,
      slow_mode_interval: input.slowModeInterval,
      guest_chat_enabled: input.guestChatEnabled,
    },
    include: HOST_SELECT,
  });

  return toRoomResponse(room);
}

export async function getHostRooms(hostId: number): Promise<RoomResponse[]> {
  const rooms = await prisma.room.findMany({
    where: { host_id: hostId },
    orderBy: { created_at: 'desc' },
    include: HOST_SELECT,
  });

  return rooms.map(toRoomResponse);
}

export async function findRoomByKey(roomKey: string): Promise<RoomResponse> {
  const room = await prisma.room.findUnique({
    where: { room_key: roomKey },
    include: HOST_SELECT,
  });

  if (!room) {
    throw ApiError.notFound('Room not found');
  }

  return toRoomResponse(room);
}

export async function updateRoom(
  roomKey: string,
  hostId: number,
  input: UpdateRoomInput,
): Promise<RoomResponse> {
  await getOwnedRoomOrThrow(roomKey, hostId);

  const updated = await prisma.room.update({
    where: { room_key: roomKey },
    data: {
      title: input.title,
      description: input.description,
      slow_mode_interval: input.slowModeInterval,
      guest_chat_enabled: input.guestChatEnabled,
    },
    include: HOST_SELECT,
  });

  return toRoomResponse(updated);
}

export async function deleteRoom(roomKey: string, hostId: number): Promise<void> {
  const room = await getOwnedRoomOrThrow(roomKey, hostId);

  if (room.status === RoomStatus.LIVE) {
    throw ApiError.badRequest('Cannot delete a room that is currently live');
  }

  await prisma.room.delete({
    where: { room_key: roomKey },
  });
}

export async function getLiveRooms(): Promise<LiveRoomResponse[]> {
  const rooms = await prisma.room.findMany({
    where: { status: RoomStatus.LIVE },
    include: {
      host: { select: { name: true } },
      stream_sessions: {
        where: { ended_at: null },
        select: { started_at: true },
        orderBy: { started_at: 'desc' },
        take: 1,
      },
    },
  });

  const io = getIO();

  return rooms
    .filter((room) => room.stream_sessions.length > 0)
    .map((room) => {
      const viewerCount = io.sockets.adapter.rooms.get(room.room_key)?.size ?? 0;
      const activeSession = room.stream_sessions[0];

      return {
        roomKey: room.room_key,
        title: room.title,
        description: room.description,
        hostName: room.host.name,
        viewerCount,
        startedAt: activeSession.started_at.toISOString(),
      };
    });
}

export async function getRecentRooms(): Promise<RecentRoomResponse[]> {
  const cutoff = new Date(Date.now() - RECENT_ROOMS_HOURS * 60 * 60 * 1000);

  const sessions = await prisma.streamSession.findMany({
    where: {
      ended_at: { not: null, gte: cutoff },
    },
    include: {
      room: {
        include: { host: { select: { name: true } } },
      },
    },
    orderBy: { ended_at: 'desc' },
    take: MAX_RECENT_ROOMS,
  });

  return sessions.map((session) => ({
    roomKey: session.room.room_key,
    title: session.room.title,
    hostName: session.room.host.name,
    endedAt: session.ended_at!.toISOString(),
    durationSeconds: session.duration_seconds,
    peakViewerCount: session.peak_viewer_count,
    totalChatMessages: session.total_chat_messages,
  }));
}

