import "dotenv/config";

import { createServer } from "node:http";

import { Server } from "socket.io";

import { prisma } from "@/lib/prisma";
import { sendMessageSchema } from "@/lib/validations/messages";

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
      return;
    }

    (socket.data as { user?: SocketUser }).user = user;
    // eslint-disable-next-line no-console
    console.log("authenticated user id:", user.id);
  });

  socket.on("join_room", (roomId: string) => {
    if (typeof roomId !== "string" || roomId.length === 0) {
      return;
    }

    // eslint-disable-next-line no-console
    console.log("join_room:", roomId);
    socket.join(roomId);
  });

  socket.on("leave_room", (roomId: string) => {
    if (typeof roomId !== "string" || roomId.length === 0) {
      return;
    }

    // eslint-disable-next-line no-console
    console.log("leave_room:", roomId);
    socket.leave(roomId);
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

  socket.on("disconnect", (reason) => {
    // eslint-disable-next-line no-console
    console.log(`socket disconnected: ${socket.id} (${reason})`);
  });
});

httpServer.listen(socketPort, () => {
  // eslint-disable-next-line no-console
  console.log(`Socket.IO server ready at http://localhost:${socketPort}`);
});
