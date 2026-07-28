"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getSocket } from "@/socket/client";
import { useAuth } from "@/hooks/use-auth";
import type { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: string[];
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  onlineUsers: [],
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);

  useEffect(() => {
    // Only connect if the user is authenticated
    if (!user) {
      if (socketInstance?.connected) {
        socketInstance.disconnect();
      }
      return;
    }

    let active = true;

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onUserOnline(userId: string) {
      setOnlineUsers((prev) => {
        if (!prev.includes(userId)) {
          return [...prev, userId];
        }
        return prev;
      });
    }

    function onUserOffline(userId: string) {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    }

    async function initializeSocket() {
      try {
        const res = await fetch("/api/auth/token");
        const data = await res.json();
        if (!active) return;

        if (data.success && data.token) {
          const socket = getSocket(data.token);
          setSocketInstance(socket);
          
          socket.on("connect", onConnect);
          socket.on("disconnect", onDisconnect);
          socket.on("user:online", onUserOnline);
          socket.on("user:offline", onUserOffline);

          socket.connect();
        }
      } catch (err) {
        console.error("Failed to initialize socket connection:", err);
      }
    }

    initializeSocket();

    return () => {
      active = false;
      const socket = getSocket();
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("user:online", onUserOnline);
      socket.off("user:offline", onUserOffline);
      socket.disconnect();
    };
  }, [user]); // Re-run if user changes (e.g. login/logout)

  return (
    <SocketContext.Provider value={{ socket: socketInstance, isConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
}
