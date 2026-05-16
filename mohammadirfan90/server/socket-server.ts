import { Server } from "socket.io";
import dotenv from "dotenv";

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

const onlineUsers = new Map<string, string>(); // userId -> socketId

io.on("connection", (socket) => {
  console.log(`[Socket] New connection: ${socket.id}`);

  // Registration flow for production-friendly cross-domain auth
  socket.on("user:register", (userId: string) => {
    if (!userId || typeof userId !== "string") return;

    socket.data.userId = userId;
    onlineUsers.set(userId, socket.id);
    socket.join(userId);

    console.log(`[Socket] User registered: ${userId} (socket: ${socket.id})`);
    io.emit("user:online", userId);
  });

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
