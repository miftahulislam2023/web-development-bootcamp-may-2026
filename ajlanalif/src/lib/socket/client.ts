"use client";

import { io, type Socket } from "socket.io-client";

let socketInstance: Socket | null = null;

export function getSocketClient(): Socket {
  if (socketInstance) {
    return socketInstance;
  }

  socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001", {
    autoConnect: false,
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
  });

  return socketInstance;
}
