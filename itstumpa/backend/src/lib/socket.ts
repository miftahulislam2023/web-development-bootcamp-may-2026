import cookie from 'cookie';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import { Server as SocketIOServer } from 'socket.io';
import config from '../app/config';
import { prisma } from './prisma';

let io: SocketIOServer;

export const initSocket = (server: HTTPServer) => {
io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  },
});

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || '');
      const token = cookies.accessToken;

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, config.accessSecret as string) as unknown as {
        sub: string;
        role: string;
      };

      socket.data.userId = decoded.sub;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.data.userId;

    console.log(`User connected: ${userId}`);

    // Update user online status
    await prisma.user.update({
      where: { id: userId },
      data: { isOnline: true },
    });

    // Notify all conversations this user is in
    io.emit('user_online', { userId });

    // Join user's conversation rooms
    const conversations = await prisma.conversationParticipant.findMany({
      where: { userId },
      select: { conversationId: true },
    });

    conversations.forEach((conv) => {
      socket.join(conv.conversationId);
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${userId}`);

      await prisma.user.update({
        where: { id: userId },
        data: {
          isOnline: false,
          lastSeen: new Date(),
        },
      });

      io.emit('user_offline', { userId });
    });

    // Join a specific conversation
    socket.on('join_conversation', (conversationId: string) => {
      socket.join(conversationId);
    });

    // Typing indicator
    socket.on('typing', (data: { conversationId: string }) => {
      socket.to(data.conversationId).emit('user_typing', {
        userId,
        conversationId: data.conversationId,
      });
    });

    // Stop typing
    socket.on('stop_typing', (data: { conversationId: string }) => {
      socket.to(data.conversationId).emit('user_stopped_typing', {
        userId,
        conversationId: data.conversationId,
      });
    });

    // Message delivered
    socket.on('message_delivered', async (data: { messageId: string }) => {
      await prisma.message.update({
        where: { id: data.messageId },
        data: {
          status: 'DELIVERED',
          deliveredAt: new Date(),
        },
      });

      const message = await prisma.message.findUnique({
        where: { id: data.messageId },
        select: { conversationId: true, senderId: true },
      });

      if (message) {
        io.to(message.conversationId).emit('message_status_updated', {
          messageId: data.messageId,
          status: 'DELIVERED',
        });
      }
    });

    // Message read
    socket.on('message_read', async (data: { messageId: string }) => {
      await prisma.message.update({
        where: { id: data.messageId },
        data: {
          status: 'READ',
          readAt: new Date(),
        },
      });

      const message = await prisma.message.findUnique({
        where: { id: data.messageId },
        select: { conversationId: true, senderId: true },
      });

      if (message) {
        io.to(message.conversationId).emit('message_status_updated', {
          messageId: data.messageId,
          status: 'READ',
        });
      }
    });

    // Mark conversation as read
    socket.on('mark_conversation_read', async (data: { conversationId: string }) => {
      await prisma.conversationParticipant.update({
        where: {
          conversationId_userId: {
            conversationId: data.conversationId,
            userId,
          },
        },
        data: {
          lastReadAt: new Date(),
        },
      });

      // Update all unread messages in this conversation
      await prisma.message.updateMany({
        where: {
          conversationId: data.conversationId,
          senderId: { not: userId },
          status: { not: 'READ' },
        },
        data: {
          status: 'READ',
          readAt: new Date(),
        },
      });

      socket.to(data.conversationId).emit('conversation_read', {
        conversationId: data.conversationId,
        userId,
      });
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};
