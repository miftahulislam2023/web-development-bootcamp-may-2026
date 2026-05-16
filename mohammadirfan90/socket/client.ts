import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
    socket = io(URL, {
      autoConnect: false,
      withCredentials: true, // Crucial for sending HTTP-only cookies
    });
  }
  return socket;
};
