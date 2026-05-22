import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import redis from '../config/redis';
import { setupChatHandlers } from './handlers/chat.handler';
import { setupPresenceHandlers } from './handlers/presence.handler';

interface SocketUser {
  id: string;
  username: string;
  avatar: string | null;
}

declare module 'socket.io' {
  interface Socket {
    user: SocketUser;
  }
}

export const setupSocketIO = (io: Server) => {
  // JWT auth middleware for sockets
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth.token ||
        socket.handshake.headers.cookie
          ?.split(';')
          .find((c) => c.trim().startsWith('token='))
          ?.split('=')[1];

      if (!token) return next(new Error('Authentication error: No token'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, username: true, avatar: true },
      });

      if (!user) return next(new Error('Authentication error: User not found'));

      socket.user = user;
      next();
    } catch {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', async (socket: Socket) => {
    const { id, username } = socket.user;
    console.log(`Socket connected: ${username} (${socket.id})`);

    // Mark online in Redis
    await redis.sadd('online_users', id);
    io.emit('user_online', id);
    
    // Send current online users to the newly connected user
    const onlineUsers = await redis.smembers('online_users');
    socket.emit('online_users_list', onlineUsers);

    // Attach handlers
    setupChatHandlers(io, socket);
    setupPresenceHandlers(io, socket);

    socket.on('disconnect', async () => {
      await redis.srem('online_users', id);
      io.emit('user_offline', id);
      console.log(`Socket disconnected: ${username}`);
    });
  });
};
