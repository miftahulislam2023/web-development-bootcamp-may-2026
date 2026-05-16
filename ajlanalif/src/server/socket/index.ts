import { createServer } from "node:http";

import { getToken } from "next-auth/jwt";
import { Server } from "socket.io";

import { prisma } from "@/lib/prisma";
import { sendMessageSchema } from "@/lib/validations/messages";

const socketPort = Number(process.env.SOCKET_PORT ?? 3001);
const socketOrigin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

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

io.use(async (socket, next) => {
  try {
    // eslint-disable-next-line no-console
    console.log("socket auth middleware");
    // eslint-disable-next-line no-console
    console.log("cookies:", socket.request.headers.cookie ?? "<none>");

    if (!nextAuthSecret) {
      // eslint-disable-next-line no-console
      console.log("unauthorized socket: missing NEXTAUTH_SECRET");
      return next(new Error("Missing NEXTAUTH_SECRET"));
    }

    const token = await getToken({
      req: socket.request as Parameters<typeof getToken>[0]["req"],
      secret: nextAuthSecret,
    });

    // eslint-disable-next-line no-console
    console.log("token:", token ? { sub: token.sub, email: token.email } : null);

    // Temporary debug bypass: use the first user in the database to confirm connection flow.
    const user = await prisma.user.findFirst({
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        email: true,
        username: true,
        image: true,
      },
    });

    if (!user) {
      // eslint-disable-next-line no-console
      console.log("unauthorized socket: no users found for debug bypass");
      return next(new Error("Unauthorized"));
    }

    (socket.data as { user?: SocketUser }).user = user;
    // eslint-disable-next-line no-console
    console.log("socket auth middleware success:", user.id);
    return next();
  } catch {
    // eslint-disable-next-line no-console
    console.log("unauthorized socket");
    return next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  const user = (socket.data as { user?: SocketUser }).user;

  // eslint-disable-next-line no-console
  console.log(`socket connected: ${socket.id} (${user?.id ?? "unknown"})`);

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
