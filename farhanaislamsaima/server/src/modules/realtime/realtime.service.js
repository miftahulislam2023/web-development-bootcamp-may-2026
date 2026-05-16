import { clearMessageCache } from '../messages/messages.controller.js';
import { createMessage } from '../messages/messages.service.js';
import { verifyToken } from '../../shared/jwt.js';

function registerRealtimeHandlers(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error('Authentication token is required'));
    }

    try {
      socket.user = verifyToken(token);
      return next();
    } catch (error) {
      return next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    console.log('user connected:', socket.id);

    socket.on('joinConversation', (conversationId) => {
      if (conversationId) {
        socket.join(conversationId);
      }
    });

    socket.on('leaveConversation', (conversationId) => {
      if (conversationId) {
        socket.leave(conversationId);
      }
    });

    socket.on('typing', (payload) => {
      if (payload?.conversationId) {
        socket.to(payload.conversationId).emit('typing', payload);
      }
    });

    socket.on('stopTyping', (payload) => {
      if (payload?.conversationId) {
        socket.to(payload.conversationId).emit('stopTyping', payload);
      }
    });

    socket.on('sendMessage', async (payload) => {
      try {
        const message = await createMessage({
          conversationId: payload.conversationId,
          senderId: socket.user.id,
          user: socket.user.name,
          text: payload.text,
          imageUrl: payload.imageUrl
        });

        await clearMessageCache(payload.conversationId);
        io.to(payload.conversationId).emit('receiveMessage', message);
        console.log('message:', payload.text);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('disconnect', () => {
      console.log('user disconnected:', socket.id);
    });
  });
}

export {
  registerRealtimeHandlers
};
