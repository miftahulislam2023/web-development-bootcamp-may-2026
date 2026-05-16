// ─── Socket.IO Server Initialization ───
// Creates and configures the Socket.IO server with typed events,
// authentication middleware, and modular event handler registration.

import type { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from '@/shared/socket-events';
import { env } from '@/config/env';
import { socketAuthMiddleware } from '@/socket/middlewares/socket-auth';
import { registerRoomHandlers } from '@/socket/handlers/room.handler';
import { registerChatHandlers } from '@/socket/handlers/chat.handler';
import { registerReactionHandlers } from '@/socket/handlers/reaction.handler';
import { clearRateLimitEntries } from '@/socket/utils/rate-limiter';
import { logger } from '@/utils/logger';

type TypedServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

let ioInstance: TypedServer | null = null;

/**
 * Returns the initialized Socket.IO server instance.
 * Must be called after initSocketServer() — throws if called before.
 */
export function getIO(): TypedServer {
  if (!ioInstance) {
    throw new Error('Socket.IO not initialized. Call initSocketServer() first.');
  }
  return ioInstance;
}

export function initSocketServer(httpServer: HttpServer): TypedServer {
  const io: TypedServer = new Server(httpServer, {
    cors: {
      origin: env.FRONTEND_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket'],
    pingInterval: 25_000,
    pingTimeout: 20_000,
  });

  // Authentication middleware — runs during handshake
  io.use(socketAuthMiddleware);

  io.on('connection', (socket) => {
    logger.info(
      { socketId: socket.id, userName: socket.data.userName, userId: socket.data.userId },
      '[Socket] User connected',
    );

    // Register all event handlers
    registerRoomHandlers(io, socket);
    registerChatHandlers(io, socket);
    registerReactionHandlers(io, socket);

    socket.on('disconnect', (reason) => {
      // Clean up rate limiter entries for this socket
      clearRateLimitEntries(socket.id);

      logger.info(
        { socketId: socket.id, userName: socket.data.userName, reason },
        '[Socket] User disconnected',
      );
    });
  });

  ioInstance = io;
  return io;
}
