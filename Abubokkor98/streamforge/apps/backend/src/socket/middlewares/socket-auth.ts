// ─── Socket.IO Authentication Middleware ───
// Runs during the handshake phase. Validates JWT for authenticated users
// or accepts a guestName for unauthenticated viewers.

import type { Socket } from 'socket.io';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from '@/shared/socket-events';
import { verifyToken } from '@/utils/jwt';
import { prisma } from '@/config/prisma';
import { logger } from '@/utils/logger';
import { z } from 'zod';

type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

const tokenPayloadSchema = z.object({
  userId: z.number().int().positive(),
  email: z.string(),
});

const MAX_GUEST_NAME_LENGTH = 30;

export function socketAuthMiddleware(socket: TypedSocket, next: (err?: Error) => void): void {
  const { token, guestName } = socket.handshake.auth as {
    token?: string;
    guestName?: string;
  };

  if (token) {
    authenticateWithToken(socket, token, next);
    return;
  }

  if (guestName && typeof guestName === 'string' && guestName.trim().length > 0) {
    const sanitizedName = guestName.trim().slice(0, MAX_GUEST_NAME_LENGTH);

    socket.data.userId = null;
    socket.data.userName = sanitizedName;
    socket.data.isHost = false;
    socket.data.currentRoom = null;

    next();
    return;
  }

  next(new Error('Authentication required: provide a token or guestName'));
}

async function authenticateWithToken(
  socket: TypedSocket,
  token: string,
  next: (err?: Error) => void,
): Promise<void> {
  try {
    const decoded = verifyToken(token);
    const payload = tokenPayloadSchema.parse(decoded);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true },
    });

    if (!user) {
      next(new Error('User not found'));
      return;
    }

    socket.data.userId = user.id;
    socket.data.userName = user.name;
    socket.data.isHost = false;
    socket.data.currentRoom = null;

    next();
  } catch (error) {
    logger.error({ error }, '[Socket Auth] Token verification failed');
    next(new Error('Invalid or expired token'));
  }
}
