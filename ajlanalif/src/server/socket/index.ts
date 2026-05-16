import "dotenv/config";

import { createServer } from "node:http";

import { Server } from "socket.io";

import { prisma } from "@/lib/prisma";
import {
  deleteMessageRealtimeSchema,
  editMessageRealtimeSchema,
  roomTypingSchema,
  sendMessageSchema,
} from "@/lib/validations/messages";
import { directTypingSchema, sendDirectMessageSchema } from "@/lib/validations/direct-messages";

const socketPort = Number(process.env.SOCKET_PORT ?? 3001);
const socketOrigin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: socketOrigin,
    credentials: true,
  },
});

type SocketUser = {
  id: string;
  email: string | null;
  username: string | null;
  image: string | null;
};

const onlineSocketIdsByUserId = new Map<string, Set<string>>();
const socketUserBySocketId = new Map<string, SocketUser>();
const activeRoomUsersByRoomId = new Map<string, Map<string, SocketUser>>();

function addOnlineSocket(userId: string, socketId: string) {
  const socketIds = onlineSocketIdsByUserId.get(userId) ?? new Set<string>();
  const wasOnline = socketIds.size > 0;
  socketIds.add(socketId);
  onlineSocketIdsByUserId.set(userId, socketIds);

  return !wasOnline;
}

function removeOnlineSocket(userId: string, socketId: string) {
  const socketIds = onlineSocketIdsByUserId.get(userId);

  if (!socketIds) {
    return false;
  }

  socketIds.delete(socketId);

  if (socketIds.size === 0) {
    onlineSocketIdsByUserId.delete(userId);
    return true;
  }

  return false;
}

function addUserToRoomPresence(roomId: string, user: SocketUser) {
  const roomUsers = activeRoomUsersByRoomId.get(roomId) ?? new Map<string, SocketUser>();
  roomUsers.set(user.id, user);
  activeRoomUsersByRoomId.set(roomId, roomUsers);
}

function removeUserFromRoomPresence(roomId: string, userId: string) {
  const roomUsers = activeRoomUsersByRoomId.get(roomId);

  if (!roomUsers) {
    return;
  }

  roomUsers.delete(userId);

  if (roomUsers.size === 0) {
    activeRoomUsersByRoomId.delete(roomId);
  }
}

function removeUserFromAllRoomPresence(userId: string) {
  for (const [roomId, roomUsers] of activeRoomUsersByRoomId.entries()) {
    if (!roomUsers.has(userId)) {
      continue;
    }

    roomUsers.delete(userId);

    if (roomUsers.size === 0) {
      activeRoomUsersByRoomId.delete(roomId);
    }

    emitRoomPresence(roomId);
  }
}

function emitRoomPresence(roomId: string) {
  const roomUsers = activeRoomUsersByRoomId.get(roomId);
  const activeUsers = roomUsers ? Array.from(roomUsers.values()) : [];

  io.to(roomId).emit("room_presence_update", {
    roomId,
    activeCount: activeUsers.length,
    activeUsers: activeUsers.map((user) => ({
      id: user.id,
      username: user.username,
      image: user.image,
    })),
  });
}

async function markConversationSeenAndEmit(conversationId: string, viewerId: string) {
  const unseenMessages = await prisma.message.findMany({
    where: {
      conversationId,
      seenAt: null,
      authorId: { not: viewerId },
    },
    select: {
      id: true,
    },
  });

  if (unseenMessages.length === 0) {
    return;
  }

  const seenAt = new Date();
  const messageIds = unseenMessages.map((message) => message.id);

  await prisma.message.updateMany({
    where: {
      id: { in: messageIds },
    },
    data: {
      seenAt,
    },
  });

  io.to(conversationId).emit("message_seen", {
    conversationId,
    messageIds,
    seenAt,
    seenByUserId: viewerId,
  });
}

async function getConversationForUser(conversationId: string, userId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: {
      id: true,
      userAId: true,
      userBId: true,
    },
  });

  if (!conversation) {
    return { error: "Conversation not found." as const };
  }

  if (conversation.userAId !== userId && conversation.userBId !== userId) {
    return { error: "You are not a participant in this conversation." as const };
  }

  return { conversation } as const;
}

function getMessageChannel(message: { roomId: string | null; conversationId: string | null }) {
  return message.roomId ?? message.conversationId;
}

io.on("connection", (socket) => {
  // eslint-disable-next-line no-console
  console.log(`socket connected: ${socket.id}`);

  socket.on("authenticate", async ({ userId }: { userId?: string }) => {
    // eslint-disable-next-line no-console
    console.log("authenticate:", userId ?? "<missing>");

    if (!userId || typeof userId !== "string") {
      // eslint-disable-next-line no-console
      console.log("unauthorized socket: missing userId");
      socket.emit("socket_error", { message: "Unauthorized" });
      socket.emit("authentication_failed", { message: "Unauthorized" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        image: true,
      },
    });

    if (!user) {
      // eslint-disable-next-line no-console
      console.log("unauthorized socket: user not found", userId);
      socket.emit("socket_error", { message: "Unauthorized" });
      socket.emit("authentication_failed", { message: "Unauthorized" });
      return;
    }

    (socket.data as { user?: SocketUser }).user = user;
    socketUserBySocketId.set(socket.id, user);
    const becameOnline = addOnlineSocket(user.id, socket.id);

    if (becameOnline) {
      io.emit("user_online", {
        userId: user.id,
      });
    }

    socket.emit("online_users", {
      userIds: Array.from(onlineSocketIdsByUserId.keys()),
    });

    for (const joinedRoomId of socket.rooms) {
      if (joinedRoomId === socket.id) {
        continue;
      }

      addUserToRoomPresence(joinedRoomId, user);
      emitRoomPresence(joinedRoomId);
    }

    socket.emit("authenticated", {
      userId: user.id,
    });
    // eslint-disable-next-line no-console
    console.log("authenticated user id:", user.id);
  });

  socket.on("join_room", (roomId: string) => {
    if (typeof roomId !== "string" || roomId.length === 0) {
      return;
    }

    const user = (socket.data as { user?: SocketUser }).user;

    // eslint-disable-next-line no-console
    console.log("join_room:", roomId);
    socket.join(roomId);

    if (user) {
      addUserToRoomPresence(roomId, user);
      emitRoomPresence(roomId);
    }
  });

  socket.on("leave_room", (roomId: string) => {
    if (typeof roomId !== "string" || roomId.length === 0) {
      return;
    }

    const user = (socket.data as { user?: SocketUser }).user;

    // eslint-disable-next-line no-console
    console.log("leave_room:", roomId);
    socket.leave(roomId);

    if (user) {
      removeUserFromRoomPresence(roomId, user.id);
      emitRoomPresence(roomId);
    }
  });

  socket.on("join_conversation", async (payload: string | { conversationId: string; markSeen?: boolean }) => {
    const conversationId = typeof payload === "string" ? payload : payload?.conversationId;
    const markSeen = typeof payload === "string" ? true : payload?.markSeen !== false;

    if (typeof conversationId !== "string" || conversationId.length === 0) {
      return;
    }

    const user = (socket.data as { user?: SocketUser }).user;

    if (!user) {
      socket.emit("socket_error", { message: "Unauthorized" });
      return;
    }

    const access = await getConversationForUser(conversationId, user.id);

    if ("error" in access) {
      socket.emit("socket_error", { message: access.error });
      return;
    }

    // eslint-disable-next-line no-console
    console.log("join_conversation:", conversationId);
    socket.join(conversationId);

    if (markSeen) {
      await markConversationSeenAndEmit(conversationId, user.id);
    }
  });

  socket.on("leave_conversation", (conversationId: string) => {
    if (typeof conversationId !== "string" || conversationId.length === 0) {
      return;
    }

    // eslint-disable-next-line no-console
    console.log("leave_conversation:", conversationId);
    socket.leave(conversationId);
  });

  socket.on("send_message", async (payload: unknown) => {
    // eslint-disable-next-line no-console
    console.log("send_message:", payload);
    const parsed = sendMessageSchema.safeParse(payload);

    if (!parsed.success) {
      socket.emit("socket_error", {
        message: "Invalid message payload.",
      });
      return;
    }

    const { roomId, content } = parsed.data;
    const user = (socket.data as { user?: SocketUser }).user;

    if (!user) {
      // eslint-disable-next-line no-console
      console.log("unauthorized socket: send_message without authenticated user");
      socket.emit("socket_error", {
        message: "Unauthorized",
      });
      return;
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { id: true },
    });

    if (!room) {
      socket.emit("socket_error", {
        message: "Room not found.",
      });
      return;
    }

    const membership = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId,
          userId: user.id,
        },
      },
      select: { id: true },
    });

    if (!membership) {
      socket.emit("socket_error", {
        message: "You are not a member of this room.",
      });
      return;
    }

    const message = await prisma.message.create({
      data: {
        roomId,
        authorId: user.id,
        content,
      },
      select: {
        id: true,
        content: true,
        roomId: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
      },
    });

    io.to(roomId).emit("receive_message", {
      id: message.id,
      content: message.content,
      roomId: message.roomId,
      createdAt: message.createdAt,
      author: {
        id: message.author.id,
        username: message.author.username,
        image: message.author.image,
      },
    });

    // eslint-disable-next-line no-console
    console.log("receive_message:", message.id);
  });

  socket.on("send_direct_message", async (payload: unknown) => {
    // eslint-disable-next-line no-console
    console.log("send_direct_message:", payload);

    const parsed = sendDirectMessageSchema.safeParse(payload);

    if (!parsed.success) {
      socket.emit("socket_error", { message: "Invalid message payload." });
      return;
    }

    const user = (socket.data as { user?: SocketUser }).user;

    if (!user) {
      socket.emit("socket_error", { message: "Unauthorized" });
      return;
    }

    const access = await getConversationForUser(parsed.data.conversationId, user.id);

    if ("error" in access) {
      socket.emit("socket_error", { message: access.error });
      return;
    }

    const message = await prisma.message.create({
      data: {
        conversationId: parsed.data.conversationId,
        authorId: user.id,
        content: parsed.data.content,
      },
      select: {
        id: true,
        content: true,
        conversationId: true,
        createdAt: true,
        seenAt: true,
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
      },
    });

    await prisma.conversation.update({
      where: { id: parsed.data.conversationId },
      data: { updatedAt: new Date() },
    });

    io.to(parsed.data.conversationId).emit("receive_direct_message", {
      id: message.id,
      content: message.content,
      conversationId: message.conversationId,
      createdAt: message.createdAt,
      seenAt: message.seenAt,
      author: {
        id: message.author.id,
        username: message.author.username,
        name: message.author.name,
        image: message.author.image,
      },
    });

    // eslint-disable-next-line no-console
    console.log("receive_direct_message:", message.id);
  });

  socket.on("typing_start", async (payload: unknown) => {
    const parsed = roomTypingSchema.safeParse(payload);

    if (!parsed.success) {
      socket.emit("socket_error", { message: "Invalid typing payload." });
      return;
    }

    const user = (socket.data as { user?: SocketUser }).user;

    if (!user) {
      socket.emit("socket_error", { message: "Unauthorized" });
      return;
    }

    const membership = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId: parsed.data.roomId,
          userId: user.id,
        },
      },
      select: { id: true },
    });

    if (!membership) {
      socket.emit("socket_error", { message: "You are not a member of this room." });
      return;
    }

    socket.to(parsed.data.roomId).emit("typing_start", {
      roomId: parsed.data.roomId,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  });

  socket.on("typing_stop", async (payload: unknown) => {
    const parsed = roomTypingSchema.safeParse(payload);

    if (!parsed.success) {
      socket.emit("socket_error", { message: "Invalid typing payload." });
      return;
    }

    const user = (socket.data as { user?: SocketUser }).user;

    if (!user) {
      socket.emit("socket_error", { message: "Unauthorized" });
      return;
    }

    socket.to(parsed.data.roomId).emit("typing_stop", {
      roomId: parsed.data.roomId,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  });

  socket.on("direct_typing_start", async (payload: unknown) => {
    const parsed = directTypingSchema.safeParse(payload);

    if (!parsed.success) {
      socket.emit("socket_error", { message: "Invalid typing payload." });
      return;
    }

    const user = (socket.data as { user?: SocketUser }).user;

    if (!user) {
      socket.emit("socket_error", { message: "Unauthorized" });
      return;
    }

    const access = await getConversationForUser(parsed.data.conversationId, user.id);

    if ("error" in access) {
      socket.emit("socket_error", { message: access.error });
      return;
    }

    socket.to(parsed.data.conversationId).emit("direct_typing_start", {
      conversationId: parsed.data.conversationId,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  });

  socket.on("direct_typing_stop", async (payload: unknown) => {
    const parsed = directTypingSchema.safeParse(payload);

    if (!parsed.success) {
      socket.emit("socket_error", { message: "Invalid typing payload." });
      return;
    }

    const user = (socket.data as { user?: SocketUser }).user;

    if (!user) {
      socket.emit("socket_error", { message: "Unauthorized" });
      return;
    }

    socket.to(parsed.data.conversationId).emit("direct_typing_stop", {
      conversationId: parsed.data.conversationId,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  });

  socket.on("edit_message", async (payload: unknown) => {
    // eslint-disable-next-line no-console
    console.log("edit_message:", payload);

    const parsed = editMessageRealtimeSchema.safeParse(payload);

    if (!parsed.success) {
      socket.emit("socket_error", {
        message: "Invalid message payload.",
      });
      return;
    }

    const user = (socket.data as { user?: SocketUser }).user;

    if (!user) {
      // eslint-disable-next-line no-console
      console.log("unauthorized socket: edit_message without authenticated user");
      socket.emit("socket_error", {
        message: "Unauthorized",
      });
      return;
    }

    const existingMessage = await prisma.message.findUnique({
      where: { id: parsed.data.messageId },
      select: {
        id: true,
        authorId: true,
        roomId: true,
        conversationId: true,
      },
    });

    if (!existingMessage) {
      socket.emit("socket_error", {
        message: "Message not found.",
      });
      return;
    }

    const channel = getMessageChannel(existingMessage);

    if (!channel) {
      socket.emit("socket_error", {
        message: "Message thread not found.",
      });
      return;
    }

    if (existingMessage.authorId !== user.id) {
      socket.emit("socket_error", {
        message: "You do not own this message.",
      });
      return;
    }

    const editedAt = new Date();

    const updatedMessage = await prisma.message.update({
      where: { id: parsed.data.messageId },
      data: {
        content: parsed.data.content,
        editedAt,
      },
      select: {
        id: true,
        content: true,
        editedAt: true,
        author: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
      },
    });

    if (existingMessage.conversationId) {
      await prisma.conversation.update({
        where: { id: existingMessage.conversationId },
        data: { updatedAt: editedAt },
      });
    }

    io.to(channel).emit("message_edited", {
      messageId: updatedMessage.id,
      conversationId: existingMessage.conversationId,
      content: updatedMessage.content,
      editedAt: updatedMessage.editedAt,
      author: {
        id: updatedMessage.author.id,
        username: updatedMessage.author.username,
        image: updatedMessage.author.image,
      },
    });

    // eslint-disable-next-line no-console
    console.log("message_edited:", updatedMessage.id);
  });

  socket.on("delete_message", async (payload: unknown) => {
    // eslint-disable-next-line no-console
    console.log("delete_message:", payload);

    const parsed = deleteMessageRealtimeSchema.safeParse(payload);

    if (!parsed.success) {
      socket.emit("socket_error", {
        message: "Invalid message payload.",
      });
      return;
    }

    const user = (socket.data as { user?: SocketUser }).user;

    if (!user) {
      // eslint-disable-next-line no-console
      console.log("unauthorized socket: delete_message without authenticated user");
      socket.emit("socket_error", {
        message: "Unauthorized",
      });
      return;
    }

    const existingMessage = await prisma.message.findUnique({
      where: { id: parsed.data.messageId },
      select: {
        id: true,
        authorId: true,
        roomId: true,
        conversationId: true,
      },
    });

    if (!existingMessage) {
      socket.emit("socket_error", {
        message: "Message not found.",
      });
      return;
    }

    const channel = getMessageChannel(existingMessage);

    if (!channel) {
      socket.emit("socket_error", {
        message: "Message thread not found.",
      });
      return;
    }

    if (existingMessage.authorId !== user.id) {
      socket.emit("socket_error", {
        message: "You do not own this message.",
      });
      return;
    }

    const deletedAt = new Date();

    await prisma.message.update({
      where: { id: parsed.data.messageId },
      data: {
        content: "[deleted]",
        deletedAt,
      },
    });

    if (existingMessage.conversationId) {
      await prisma.conversation.update({
        where: { id: existingMessage.conversationId },
        data: { updatedAt: deletedAt },
      });
    }

    io.to(channel).emit("message_deleted", {
      messageId: parsed.data.messageId,
      conversationId: existingMessage.conversationId,
      deletedAt,
    });

    // eslint-disable-next-line no-console
    console.log("message_deleted:", parsed.data.messageId);
  });

  socket.on("disconnect", (reason) => {
    const user = socketUserBySocketId.get(socket.id) ?? (socket.data as { user?: SocketUser }).user;

    if (user) {
      socketUserBySocketId.delete(socket.id);
      removeUserFromAllRoomPresence(user.id);

      const becameOffline = removeOnlineSocket(user.id, socket.id);

      if (becameOffline) {
        const lastSeenAt = new Date();

        io.emit("user_offline", {
          userId: user.id,
          lastSeenAt,
        });

        void prisma.user
          .update({
            where: { id: user.id },
            data: { lastSeenAt },
          })
          .catch((error: unknown) => {
            // eslint-disable-next-line no-console
            console.error("failed to update lastSeenAt:", error);
          });
      }
    }

    // eslint-disable-next-line no-console
    console.log(`socket disconnected: ${socket.id} (${reason})`);
  });
});

httpServer.listen(socketPort, () => {
  // eslint-disable-next-line no-console
  console.log(`Socket.IO server ready at http://localhost:${socketPort}`);
});
