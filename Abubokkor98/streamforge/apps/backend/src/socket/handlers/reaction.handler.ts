// ─── Reaction Event Handler ───
// Handles emoji reactions with server-side rate limiting.
// Broadcasts reactions to all users in the room.

import type { Server, Socket } from 'socket.io';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  SendReactionPayload,
} from '@/shared/socket-events';
import { checkRateLimit, REACTION_RATE_LIMIT } from '@/socket/utils/rate-limiter';
import { logger } from '@/utils/logger';
import { randomUUID } from 'crypto';

type TypedServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

const ALLOWED_EMOJIS = new Set(['🔥', '❤️', '👏', '😂', '😮']);

export function registerReactionHandlers(io: TypedServer, socket: TypedSocket): void {
  socket.on('send-reaction', (payload: SendReactionPayload) => {
    const { roomKey, emoji } = payload;

    if (!roomKey || !emoji) {
      socket.emit('error', { message: 'Missing reaction parameters' });
      return;
    }

    if (!ALLOWED_EMOJIS.has(emoji)) {
      socket.emit('error', { message: 'Invalid emoji' });
      return;
    }

    // Rate limit: 1 reaction per 2 seconds per socket
    const rateLimitKey = `${socket.id}:reaction`;
    if (!checkRateLimit(rateLimitKey, REACTION_RATE_LIMIT)) {
      return; // Silently drop — no error feedback for reactions
    }

    // Broadcast to all users in the room (including sender)
    io.to(roomKey).emit('reaction', {
      emoji,
      senderName: socket.data.userName,
      id: randomUUID(),
    });

    logger.debug(
      { socketId: socket.id, roomKey, emoji },
      '[Reaction Handler] Reaction broadcast',
    );
  });
}
