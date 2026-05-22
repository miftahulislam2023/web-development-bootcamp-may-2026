import { Server, Socket } from 'socket.io';
import { prisma } from '../../config/prisma';

export const setupChatHandlers = (io: Server, socket: Socket) => {
  // Join a room and load history
  socket.on('join_room', async (roomId: string) => {
    socket.join(roomId);

    const messages = await prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: 'desc' },
      take: 30,
      include: {
        sender: { select: { id: true, username: true, avatar: true } },
        readBy: { select: { userId: true } },
      },
    });

    socket.emit('room_history', messages.reverse());
    socket.to(roomId).emit('user_joined', {
      userId: socket.user.id,
      username: socket.user.username,
      roomId,
    });
  });

  // Send a new message
  socket.on(
    'send_message',
    async ({ roomId, content, type = 'TEXT' }: {
      roomId: string;
      content: string;
      type?: 'TEXT' | 'IMAGE' | 'FILE';
    }) => {
      // Verify membership before saving
      const member = await prisma.roomMember.findUnique({
        where: { userId_roomId: { userId: socket.user.id, roomId } },
      });
      if (!member) return;

      const message = await prisma.message.create({
        data: { content, type, senderId: socket.user.id, roomId },
        include: {
          sender: { select: { id: true, username: true, avatar: true } },
          readBy: { select: { userId: true } },
        },
      });

      io.to(roomId).emit('new_message', message);
    }
  );

  // Mark message as read
  socket.on('mark_read', async (messageId: string) => {
    await prisma.messageRead.upsert({
      where: { userId_messageId: { userId: socket.user.id, messageId } },
      create: { userId: socket.user.id, messageId },
      update: {},
    });

    const message = await prisma.message.findUnique({ where: { id: messageId } });
    if (message) {
      io.to(message.roomId).emit('message_read', {
        messageId,
        userId: socket.user.id,
        roomId: message.roomId,
      });
    }
  });

  // Leave room socket channel
  socket.on('leave_room', (roomId: string) => {
    socket.leave(roomId);
    socket.to(roomId).emit('user_left', { userId: socket.user.id, roomId });
  });

  // Delete message
  socket.on('delete_message', async (messageId: string) => {
    const message = await prisma.message.findUnique({ where: { id: messageId } });
    if (!message || message.senderId !== socket.user.id) return;

    await prisma.message.delete({ where: { id: messageId } });
    io.to(message.roomId).emit('message_deleted', messageId);
  });
};
