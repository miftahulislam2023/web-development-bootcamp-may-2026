// ─── Room Join/Leave & Viewer Count Handler ───
// Manages Socket.IO room membership and broadcasts real-time viewer counts.
// Updates peak_viewer_count on the active StreamSession when a new high is reached.

import type { Server, Socket } from 'socket.io';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from '@/shared/socket-events';
import { prisma } from '@/config/prisma';
import { logger } from '@/utils/logger';
import { getRecentMessages } from '@/modules/chat/chat.service';
import * as streamsService from '@/modules/streams/streams.service';

type TypedServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

function getRoomViewerCount(io: TypedServer, roomKey: string): number {
  return io.sockets.adapter.rooms.get(roomKey)?.size ?? 0;
}

function broadcastViewerCount(io: TypedServer, roomKey: string): void {
  const count = getRoomViewerCount(io, roomKey);
  io.to(roomKey).emit('viewer-count-updated', { roomKey, count });
}

async function updatePeakViewerCount(roomKey: string, currentCount: number): Promise<void> {
  try {
    const room = await prisma.room.findUnique({
      where: { room_key: roomKey },
      select: { id: true, host_id: true, status: true },
    });

    if (!room || room.status !== 'LIVE') {
      return;
    }

    const activeSession = await prisma.streamSession.findFirst({
      where: { room_id: room.id, ended_at: null },
      select: { id: true, peak_viewer_count: true },
      orderBy: { started_at: 'desc' },
    });

    if (!activeSession) {
      return;
    }

    if (currentCount > activeSession.peak_viewer_count) {
      await prisma.streamSession.update({
        where: { id: activeSession.id },
        data: { peak_viewer_count: currentCount },
      });
    }
  } catch (error) {
    logger.error({ error, roomKey }, '[Room Handler] Failed to update peak viewer count');
  }
}

export function registerRoomHandlers(io: TypedServer, socket: TypedSocket): void {
  socket.on('join-room', async (roomKey: string) => {
    if (socket.data.currentRoom) {
      await socket.leave(socket.data.currentRoom);
      await broadcastViewerCount(io, socket.data.currentRoom);
    }

    await socket.join(roomKey);
    socket.data.currentRoom = roomKey;

    // Determine if this user is the room host
    if (socket.data.userId) {
      socket.data.isHost = false; // Reset to avoid stale state

      try {
        const room = await prisma.room.findUnique({
          where: { room_key: roomKey },
          select: { host_id: true },
        });

        if (room && room.host_id === socket.data.userId) {
          socket.data.isHost = true;
          // Host reconnected — cancel any pending auto-end timer
          streamsService.cancelStreamCleanup(roomKey);
        }
      } catch (error) {
        logger.error({ error, roomKey }, '[Room Handler] Failed to check host status');
      }
    }

    const count = getRoomViewerCount(io, roomKey);
    await broadcastViewerCount(io, roomKey);
    await updatePeakViewerCount(roomKey, count);

    // Send chat history to the newly joined user
    try {
      const history = await getRecentMessages(roomKey);
      socket.emit('chat-history', history);
    } catch (error) {
      logger.error({ error, roomKey }, '[Room Handler] Failed to load chat history');
    }

    logger.info(
      { socketId: socket.id, roomKey, userName: socket.data.userName },
      '[Room Handler] User joined room',
    );
  });

  socket.on('leave-room', async (roomKey: string) => {
    await socket.leave(roomKey);
    socket.data.currentRoom = null;
    socket.data.isHost = false;

    await broadcastViewerCount(io, roomKey);

    logger.info(
      { socketId: socket.id, roomKey, userName: socket.data.userName },
      '[Room Handler] User left room',
    );
  });

  // Cleanup on disconnect — ensure viewer count is updated
  socket.on('disconnect', async () => {
    const { currentRoom, isHost } = socket.data;

    if (currentRoom) {
      // Socket is automatically removed from rooms on disconnect,
      // but we need to broadcast the updated count to remaining users.
      await broadcastViewerCount(io, currentRoom);

      // If the host disconnected, start the grace period timer to auto-end the stream.
      // We only do this if no other host sockets are currently connected for this room.
      if (isHost) {
        const roomSockets = io.sockets.adapter.rooms.get(currentRoom);
        let otherHostExists = false;

        if (roomSockets) {
          for (const socketId of roomSockets) {
            if (socketId === socket.id) continue;
            const s = io.sockets.sockets.get(socketId);
            if (s?.data.isHost) {
              otherHostExists = true;
              break;
            }
          }
        }

        if (!otherHostExists) {
          streamsService.scheduleStreamCleanup(currentRoom);
        }
      }
    }
  });
}
