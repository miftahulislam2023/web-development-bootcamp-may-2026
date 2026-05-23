"use client"

import { Socket } from "socket.io-client"
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { chat_service, useAppData } from "./AppContext";
import { io } from "socket.io-client";

interface SocketContextType{
    socket: Socket | null;
    onlineUsers: string[];
    typingUsers: string[];
    newMessage: any;
    seenData: { chatId: string } | null;
    deletedMessage: { messageId: string; chatId: string } | null;
    editedMessage: { messageId: string; text: string; chatId: string } | null;
    reactedMessage: { messageId: string; reactions: { userId: string; emoji: string }[]; chatId: string } | null;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    onlineUsers: [],
    typingUsers: [],
    newMessage: null,
    seenData: null,
    deletedMessage: null,
    editedMessage: null,
    reactedMessage: null,
});

interface ProviderProps{
    children: ReactNode;
}

export const SocketProvider = ({children}: ProviderProps) =>{

    const [socket,setSocket] = useState<Socket | null>(null)
    const {user} = useAppData();
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const [newMessage, setNewMessage] = useState<any>(null);
    const [seenData, setSeenData] = useState<{ chatId: string } | null>(null);
    const [deletedMessage, setDeletedMessage] = useState<{ messageId: string; chatId: string } | null>(null);
    const [editedMessage, setEditedMessage] = useState<{ messageId: string; text: string; chatId: string } | null>(null);
    const [reactedMessage, setReactedMessage] = useState<{ messageId: string; reactions: { userId: string; emoji: string }[]; chatId: string } | null>(null);

    useEffect(()=>{
        if(!user?._id) return

        const newSocket = io(chat_service,{
            query:{
                userId: user._id
            }
        } );

        setSocket(newSocket);
        newSocket.on("getOnlineUser", (users: string[]) => {
            setOnlineUsers(users)
        })
        newSocket.on("typing", (senderId: string) => {
            setTypingUsers(prev => [...new Set([...prev, senderId])])
        })
        newSocket.on("stopTyping", (senderId: string) => {
            setTypingUsers(prev => prev.filter(id => id !== senderId))
        })
        newSocket.on("newMessage", (message: any) => {
            setNewMessage(message)
        })
        newSocket.on("messagesSeen", (data: { chatId: string }) => { setSeenData(data) })
        newSocket.on("messageDeleted", (data: { messageId: string; chatId: string }) => { setDeletedMessage(data) })
        newSocket.on("messageEdited", (data: { messageId: string; text: string; chatId: string }) => { setEditedMessage(data) })
        newSocket.on("messageReacted", (data: { messageId: string; reactions: { userId: string; emoji: string }[]; chatId: string }) => { setReactedMessage(data) })

        return () => {
            newSocket.disconnect()
        };
    }, [user?._id, user?.isInvisible]);

    return <SocketContext.Provider value={{socket, onlineUsers, typingUsers, newMessage, seenData, deletedMessage, editedMessage, reactedMessage}}>{children}</SocketContext.Provider>
};

export const SocketData = () => useContext(SocketContext);
