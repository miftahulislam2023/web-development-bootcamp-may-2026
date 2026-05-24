import { Server, Socket } from 'socket.io';
import http from 'http';
import express from 'express';
import prisma from "./prisma.js";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const userSocketMap: Record<string, string> = {};

export const getReceiverSocketId = (receiverId: string): string | undefined => {
    return userSocketMap[receiverId];
}

io.on('connection', (socket: Socket) => {
    console.log('a user connected to socket id:', socket.id);

    const userId = socket.handshake.query.userId as string | undefined;

    if (userId && userId !== 'undefined') {
        userSocketMap[userId] = socket.id;
        console.log(`User ${userId} mapped to socket id ${socket.id}`);
    }

    io.emit("getOnlineUser", Object.keys(userSocketMap));

    if (userId) {
        socket.join(userId);
    }



    socket.on("joinChat", (chatId: string) => {
        if (!chatId) return;

        console.log(`User ${userId} joined chat room ${chatId}`);
        socket.join(chatId);
    })

    socket.on("leaveChat", (chatId: string) => {
        if (!chatId) return;

        console.log(`User ${userId} left chat room ${chatId}`);
        socket.leave(chatId);
    })

    socket.on("typing", (data: { chatId: string; userId: string }) => {
        if (!data.chatId) return;

        console.log(`User ${userId} is typing in chat ${data.chatId}`);
        socket.to(data.chatId).emit("typing", {
            chatId: data.chatId,
            userId: data.userId,
        });
    });

    socket.on("stopTyping", (data: { chatId: string; userId: string }) => {
        if (!data.chatId) return

        console.log(`User ${userId} is stop typing in chat ${data.chatId}`);
        socket.to(data.chatId).emit("userStoppedTyping", {
            chatId: data.chatId,
            userId: data.userId,
        });
    });

    socket.on(
        "markMessagesSeen",
        async (data: {
            chatId: string;
            userId: string;
        }) => {

            try {

                const unseenMessages =
                    await prisma.message.findMany({
                        where: {
                            chatId: data.chatId,
                            sender: {
                                not: data.userId
                            },
                            seen: false
                        }
                    });

                if (unseenMessages.length === 0) {
                    return;
                }

                await prisma.message.updateMany({
                    where: {
                        chatId: data.chatId,
                        sender: {
                            not: data.userId
                        },
                        seen: false
                    },
                    data: {
                        seen: true,
                        seenAt: new Date()
                    }
                });

                const senderId =
                    unseenMessages[0]?.sender;

                if (!senderId) return;

                const senderSocketId =
                    getReceiverSocketId(senderId);

                if (senderSocketId) {

                    io.to(senderSocketId).emit(
                        "messagesSeen",
                        {
                            chatId: data.chatId,

                            messageIds:
                                unseenMessages.map(
                                    (message) => message.id
                                )
                        }
                    );
                }

            } catch (error) {

                console.log(
                    "markMessagesSeen error:",
                    error
                );
            }
        }
    );

    socket.on('disconnect', () => {
        console.log('a user disconnected socket id:', socket.id);

        if (userId) {
            delete userSocketMap[userId];
            console.log(`User ${userId} disconnected`);
            io.emit("getOnlineUser", Object.keys(userSocketMap));
        }
    });

    socket.on('connect_error', (error) => {
        console.log("Socket connection error:", error);
    });
});


export { app, server, io };