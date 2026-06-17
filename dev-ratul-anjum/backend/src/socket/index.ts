import { Server, Socket } from "socket.io";
import registerSocketEvents from "./events.js";
import corsOptions from "$/utils/corsOptions.js";

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: corsOptions,
  });

  io.on("connection", (socket: Socket) => {
    registerSocketEvents(io, socket);
  });
  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

export default getIO;
