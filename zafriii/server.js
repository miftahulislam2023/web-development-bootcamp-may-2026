require("dotenv").config();
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  const { PrismaClient } = require("@prisma/client");
  const { PrismaPg } = require("@prisma/adapter-pg");
  const { Pool } = require("pg");

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  // Map userId -> socketId
  const onlineUsers = new Map();

  /**
   * Emits user status to all connected sockets except those blocked by the user.
   */
  async function broadcastStatus(userId, isOnline) {
    try {
      const blocked = await prisma.block.findMany({
        where: { blockerId: userId },
        select: { blockedId: true },
      });
      const blockedIds = new Set(blocked.map((b) => b.blockedId));

      const sockets = await io.fetchSockets();
      for (const s of sockets) {
        // Only send if the recipient is NOT blocked by the user whose status changed
        if (!s.userId || !blockedIds.has(s.userId)) {
          s.emit("user:status", { userId, isOnline });
        }
      }
    } catch (err) {
      console.error("Error in broadcastStatus:", err);
      // Fallback: emit to everyone if Prisma fails (not ideal for privacy, but keeps app working)
      // io.emit("user:status", { userId, isOnline });
    }
  }

  io.on("connection", (socket) => {
    // User comes online — join personal room for direct delivery
    socket.on("user:online", async (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;
      socket.join(`user:${userId}`); // personal room
      
      // Update DB status
      await prisma.user.update({
        where: { id: userId },
        data: { isOnline: true, lastSeen: new Date() }
      }).catch(err => console.error("Error updating user status:", err));

      broadcastStatus(userId, true);
    });

    // Join a conversation room
    socket.on("join:conversation", (conversationId) => {
      socket.join(conversationId);
    });

    // Leave a conversation room
    socket.on("leave:conversation", (conversationId) => {
      socket.leave(conversationId);
    });

    // New message — deliver to conversation room AND recipient's personal room
    socket.on("message:send", (data) => {
      // data: { conversationId, message, recipientId }
      // Deliver to anyone in the conversation room (open chat)
      socket.to(data.conversationId).emit("message:new", data.message);
      // Also deliver to recipient's personal room ONLY if they're NOT in the convo room
      // (avoids duplicate delivery)
      if (data.recipientId) {
        const convoRoom = io.sockets.adapter.rooms.get(data.conversationId);
        const recipientSocketId = onlineUsers.get(data.recipientId);
        const recipientInRoom = recipientSocketId && convoRoom?.has(recipientSocketId);
        if (!recipientInRoom) {
          socket.to(`user:${data.recipientId}`).emit("message:new", data.message);
        }
      }
    });

    // Typing indicator
    socket.on("typing:start", (data) => {
      const userId = data.userId || socket.userId;
      if (!userId || !data.conversationId) return;
      socket.to(data.conversationId).emit("typing:start", { userId, conversationId: data.conversationId });
    });

    socket.on("typing:stop", (data) => {
      const userId = data.userId || socket.userId;
      if (!userId || !data.conversationId) return;
      socket.to(data.conversationId).emit("typing:stop", { userId, conversationId: data.conversationId });
    });

    // Reaction update
    socket.on("message:reaction", (data) => {
      socket.to(data.conversationId).emit("message:reaction", data);
    });

    // Message deleted
    socket.on("message:delete", (data) => {
      socket.to(data.conversationId).emit("message:delete", data);
    });

    // Real-time block update: hide blocker status from blocked user immediately
    socket.on("user:block", ({ blockedId }) => {
      const blockerId = socket.userId;
      if (blockerId && blockedId) {
        // Tell the blocked user that the blocker is "offline"
        socket.to(`user:${blockedId}`).emit("user:status", { userId: blockerId, isOnline: false });
      }
    });

    // Real-time unblock update: show blocker status if they are online
    socket.on("user:unblock", async ({ unblockedId }) => {
      const blockerId = socket.userId;
      if (blockerId && unblockedId) {
        const blocker = await prisma.user.findUnique({ where: { id: blockerId }, select: { isOnline: true } });
        if (blocker?.isOnline) {
          socket.to(`user:${unblockedId}`).emit("user:status", { userId: blockerId, isOnline: true });
        }
      }
    });

    socket.on("disconnect", async () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        
        // Update DB status
        await prisma.user.update({
          where: { id: socket.userId },
          data: { isOnline: false, lastSeen: new Date() }
        }).catch(err => console.error("Error updating user status on disconnect:", err));

        broadcastStatus(socket.userId, false);
      }
    });
  });

  httpServer.listen(3000, () => {
    console.log("> Ready on http://localhost:3000");
  });
});
