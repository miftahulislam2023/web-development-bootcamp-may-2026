// ─── Chat Event Handler ───
// Handles send-message, delete-message, and pin-message socket events.
// Enforces rate limiting, slow mode, guest chat restrictions, and XSS sanitization.

import type { Server, Socket } from 'socket.io';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  SendMessagePayload,
  DeleteMessagePayload,
  PinMessagePayload,
} from '@/shared/socket-events';
import {
  sendMessageSchema,
  deleteMessageSchema,
  pinMessageSchema,
} from '@/modules/chat/chat.schema';
import * as chatService from '@/modules/chat/chat.service';
import { checkRateLimit, CHAT_RATE_LIMIT } from '@/socket/utils/rate-limiter';
import { logger } from '@/utils/logger';

type TypedServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export function registerChatHandlers(io: TypedServer, socket: TypedSocket): void {
  socket.on('send-message', async (payload: SendMessagePayload, callback) => {
    try {
      // Runtime validation
      const parsed = sendMessageSchema.safeParse(payload);
      if (!parsed.success) {
        callback({ success: false, error: 'Invalid message format' });
        return;
      }

      const { roomKey, text } = parsed.data;

      // Rate limiting (3 msgs / 5s per socket)
      const rateLimitKey = `${socket.id}:chat`;
      if (!checkRateLimit(rateLimitKey, CHAT_RATE_LIMIT)) {
        callback({ success: false, error: 'You are sending messages too fast' });
        return;
      }

      // Persist message via chat service (handles slow mode, guest check, XSS, DB write)
      const message = await chatService.saveMessage({
        roomKey,
        text,
        senderId: socket.data.userId,
        senderName: socket.data.userName,
      });

      // Broadcast to all users in the room (including sender for reconciliation)
      io.to(roomKey).emit('new-message', message);

      // Acknowledge success to the sender
      callback({ success: true, message });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      logger.error({ error, socketId: socket.id }, '[Chat Handler] send-message failed');
      callback({ success: false, error: errorMessage });
    }
  });

  socket.on('delete-message', async (payload: DeleteMessagePayload) => {
    try {
      const parsed = deleteMessageSchema.safeParse(payload);
      if (!parsed.success) {
        socket.emit('error', { message: 'Invalid delete request' });
        return;
      }

      const { messageId, roomKey } = parsed.data;

      if (!socket.data.isHost || !socket.data.userId) {
        socket.emit('error', { message: 'Only the host can delete messages' });
        return;
      }

      await chatService.deleteMessage(messageId, socket.data.userId);

      // Broadcast deletion to all users in the room
      io.to(roomKey).emit('message-deleted', { messageId });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete message';
      logger.error({ error, socketId: socket.id }, '[Chat Handler] delete-message failed');
      socket.emit('error', { message: errorMessage });
    }
  });

  socket.on('pin-message', async (payload: PinMessagePayload) => {
    try {
      const parsed = pinMessageSchema.safeParse(payload);
      if (!parsed.success) {
        socket.emit('error', { message: 'Invalid pin request' });
        return;
      }

      const { messageId, roomKey, isPinned } = parsed.data;

      if (!socket.data.isHost || !socket.data.userId) {
        socket.emit('error', { message: 'Only the host can pin messages' });
        return;
      }

      if (isPinned) {
        await chatService.pinMessage(messageId, socket.data.userId);
      } else {
        await chatService.unpinMessage(messageId, socket.data.userId);
      }

      // Broadcast pin state change to all users in the room
      io.to(roomKey).emit('message-pinned', { messageId, isPinned });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to pin message';
      logger.error({ error, socketId: socket.id }, '[Chat Handler] pin-message failed');
      socket.emit('error', { message: errorMessage });
    }
  });
}
