import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (token?: string): Socket => {
  if (!socket) {
    const URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
    
    console.log(`[Socket] Initializing connection to: ${URL}`);
    
    socket = io(URL, {
      autoConnect: false,
      withCredentials: true,
      transports: ["websocket", "polling"],
      auth: {
        token: token,
      },
    });

    socket.on("connect", () => {
      console.log(`[Socket] Connected with ID: ${socket?.id}`);
    });

    socket.on("disconnect", (reason) => {
      console.log(`[Socket] Disconnected: ${reason}`);
    });

    socket.on("connect_error", (error) => {
      console.error(`[Socket] Connection Error:`, error.message);
    });
  } else if (token) {
    socket.auth = { token };
  }
  return socket;
};
