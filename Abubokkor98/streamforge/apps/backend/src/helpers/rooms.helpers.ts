import { RoomStatus } from '@prisma/client';
import type { RoomResponse } from '@/modules/rooms/rooms.types';

interface PrismaRoomRow {
  id: number;
  room_key: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  status: RoomStatus;
  slow_mode_interval: number | null;
  guest_chat_enabled: boolean;
  created_at: Date;
  updated_at: Date;
  host: { name: string; avatar_url: string | null };
}

export function toRoomResponse(room: PrismaRoomRow): RoomResponse {
  return {
    id: room.id,
    roomKey: room.room_key,
    title: room.title,
    description: room.description,
    thumbnailUrl: room.thumbnail_url,
    status: room.status,
    slowModeInterval: room.slow_mode_interval,
    guestChatEnabled: room.guest_chat_enabled,
    hostName: room.host.name,
    hostAvatarUrl: room.host.avatar_url,
    createdAt: room.created_at,
    updatedAt: room.updated_at,
  };
}

