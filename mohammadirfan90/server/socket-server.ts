import { Server } from "socket.io";
import { parse } from "cookie";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const PORT = parseInt(process.env.SOCKET_PORT || "4000", 10);
const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;

if (!JWT_SECRET) {
  console.error("JWT_SECRET is not defined");
  process.exit(1);
}

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined");
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB from Socket server"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Dynamic import for Message model to ensure Mongoose is ready
async function getMessageModel() {
  const { Message } = await import("../models/Message.js");
  return Message;
}

const allowedOrigins = [
  "http://localhost:3000",
  process.env.NEXT_PUBLIC_APP_URL, // e.g. https://devconnect.vercel.app
  process.env.CLIENT_URL,          // Alternative env name for clarity
].filter(Boolean) as string[];

const io = new Server(PORT, {
  cors: {
    origin: allowedOrigins.length > 0 ? allowedOrigins : "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// NOTE: Vercel does not run long-running Node processes. 
// This socket server MUST be deployed to a persistent host like Render, Railway, or Fly.io.

const onlineUsers = new Map<string, string>(); // userId -> socketId

io.use((socket, next) => {
  const cookieHeader = socket.handshake.headers.cookie;
  if (!cookieHeader) {
    return next(new Error("Authentication error"));
  }

  const cookies = parse(cookieHeader);
  const token = cookies.token;

  if (!token) {
    return next(new Error("Authentication error"));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    socket.data.userId = payload.userId;
    next();
  } catch (error) {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.data.userId;
  console.log(`User connected: ${userId} (socket: ${socket.id})`);

  onlineUsers.set(userId, socket.id);
  io.emit("user:online", userId);

  // Join personal room
  socket.join(userId);

  socket.on("message:send", (data: { chatId: string; message: any; receiverIds: string[] }) => {
    const { chatId, message, receiverIds } = data;

    if (!userId || !chatId || !message || !Array.isArray(receiverIds)) {
      return;
    }

    // Forward the message to all receivers
    receiverIds.forEach((receiverId) => {
      io.to(receiverId).emit("message:new", { chatId, message });
    });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userId}`);
    onlineUsers.delete(userId);
    io.emit("user:offline", userId);
  });
});

console.log(`[Socket] Server started on port ${PORT}`);
console.log(`[Socket] Allowed origins: ${allowedOrigins.join(", ")}`);
