import { RoomStatus } from '@prisma/client';

export interface RoomResponse {
  id: number;
  roomKey: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  status: RoomStatus;
  slowModeInterval: number | null;
  guestChatEnabled: boolean;
  hostName: string;
  hostAvatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRoomInput {
  title: string;
  description?: string;
  slowModeInterval?: number | null;
  guestChatEnabled?: boolean;
}

export interface UpdateRoomInput {
  title?: string;
  description?: string | null;
  slowModeInterval?: number | null;
  guestChatEnabled?: boolean;
}

export interface LiveRoomResponse {
  roomKey: string;
  title: string;
  description: string | null;
  hostName: string;
  viewerCount: number;
  startedAt: string;
}

export interface RecentRoomResponse {
  roomKey: string;
  title: string;
  hostName: string;
  endedAt: string;
  durationSeconds: number | null;
  peakViewerCount: number;
  totalChatMessages: number;
}
