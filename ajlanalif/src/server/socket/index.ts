import { createServer } from "node:http";

import { Server } from "socket.io";

const socketPort = Number(process.env.SOCKET_PORT ?? 3001);
const socketOrigin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: socketOrigin,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.emit("socket:connected", { socketId: socket.id });

  socket.on("room:join", (roomId: string) => {
    socket.join(roomId);
  });

  socket.on("room:leave", (roomId: string) => {
    socket.leave(roomId);
  });

  socket.on("disconnect", () => {
    // This is intentionally minimal for initial setup.
  });
});

httpServer.listen(socketPort, () => {
  // eslint-disable-next-line no-console
  console.log(`Socket.IO server ready at http://localhost:${socketPort}`);
});
