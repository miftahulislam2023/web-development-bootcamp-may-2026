"use client";

import { io, Socket } from "socket.io-client";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { chat_service, useAppData } from "./AppContext";



interface SocketContextType {
    socket: Socket | null;
    onlineUsers: string[];
}


const SocketContext = createContext<SocketContextType>({
    socket: null,
    onlineUsers: [],
});

interface ProviderProps {
    children: ReactNode;
}

export const SocketProvider = ({ children }: ProviderProps) => {

    const [socket, setSocket] = useState<Socket | null>(null);
    const { user } = useAppData();
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

    useEffect(() => {
        if (!user) return
        const newSocket = io(chat_service, {
            query: {
                userId: user.id,
            },
        });
        setSocket(newSocket);

        newSocket.on("getOnlineUser", (users: string[]) => {
            setOnlineUsers(users);
        });

        return () => {
            newSocket.disconnect();
        }
    }, [user?.id]);


    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};


export const SocketData = () => useContext(SocketContext);
