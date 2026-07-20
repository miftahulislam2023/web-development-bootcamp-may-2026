import { Server } from "socket.io";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config({ path: ".env.local" });
dotenv.config();

/**
 * NOTE: Vercel does not run long-running Socket.io processes. 
 * This server must be deployed separately on Render/Railway/Fly.io.
 * 
 * REST APIs (/api/messages) are the source of truth for auth and message saving.
 * Socket.io is only for realtime delivery.
 */

const PORT = parseInt(process.env.PORT || process.env.SOCKET_PORT || "4000", 10);

const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_URL,
  process.env.NEXT_PUBLIC_APP_URL,
].filter(Boolean) as string[];

const io = new Server(PORT, {
  cors: {
    origin: allowedOrigins.length > 0 ? allowedOrigins : "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

const JWT_SECRET = process.env.JWT_SECRET;

// Socket authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }
  try {
    if (!JWT_SECRET) {
      return next(new Error("Authentication error: Secret is undefined"));
    }
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    socket.data.userId = payload.userId;
    next();
  } catch (err) {
    return next(new Error("Authentication error: Invalid token"));
  }
});

const onlineUsers = new Map<string, string>(); // userId -> socketId

io.on("connection", (socket) => {
  const userId = socket.data.userId;
  if (userId) {
    onlineUsers.set(userId, socket.id);
    socket.join(userId);
    console.log(`[Socket] User connected and authenticated: ${userId} (socket: ${socket.id})`);
    io.emit("user:online", userId);
  } else {
    console.log(`[Socket] Unregistered socket connected: ${socket.id}`);
  }

  socket.on("message:send", (data: { chatId: string; message: any; receiverIds: string[] }) => {
    const { chatId, message, receiverIds } = data;
    const senderId = socket.data.userId;

    if (!senderId || !chatId || !message || !Array.isArray(receiverIds)) {
      console.warn(`[Socket] Invalid message:send from ${senderId || 'unknown'}`);
      return;
    }

    // Forward the message to all receivers' personal rooms
    receiverIds.forEach((receiverId) => {
      io.to(receiverId).emit("message:new", { chatId, message });
    });
  });

  socket.on("disconnect", () => {
    const userId = socket.data.userId;
    if (userId) {
      console.log(`[Socket] User disconnected: ${userId}`);
      onlineUsers.delete(userId);
      io.emit("user:offline", userId);
    } else {
      console.log(`[Socket] Unregistered socket disconnected: ${socket.id}`);
    }
  });
});

console.log(`[Socket] Server started on port ${PORT}`);
console.log(`[Socket] Allowed origins: ${allowedOrigins.join(", ")}`);
