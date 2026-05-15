import { Server, Socket } from 'socket.io';

// roomId -> Map<userId, username>
const typingUsers = new Map<string, Map<string, string>>();

export const setupPresenceHandlers = (io: Server, socket: Socket) => {
  socket.on('typing_start', (roomId: string) => {
    if (!typingUsers.has(roomId)) typingUsers.set(roomId, new Map());
    typingUsers.get(roomId)!.set(socket.user.id, socket.user.username);

    socket.to(roomId).emit('user_typing', {
      userId: socket.user.id,
      username: socket.user.username,
      roomId,
    });
  });

  socket.on('typing_stop', (roomId: string) => {
    typingUsers.get(roomId)?.delete(socket.user.id);
    socket.to(roomId).emit('user_stop_typing', {
      userId: socket.user.id,
      roomId,
    });
  });

  // Clean up typing on disconnect
  socket.on('disconnect', () => {
    typingUsers.forEach((users, roomId) => {
      if (users.has(socket.user.id)) {
        users.delete(socket.user.id);
        io.to(roomId).emit('user_stop_typing', { userId: socket.user.id, roomId });
      }
    });
  });
};
