import axios from "axios";
import TryCatch from "../config/TryCatch.js";
import type { AuthenticatedRequest } from "../middlewares/isAuth.js";
import prisma from "../config/prisma.js";
import { getReceiverSocketId, io } from "../config/socket.js";

export const createNewChat = TryCatch(async (req: AuthenticatedRequest, res) => {
    const userId = req.user?.id;
    const { otherUserId } = req.body;

    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    if (!otherUserId) {
        res.status(400).json({ message: "otherUserId is required" });
        return;
    }

    const existingChat = await prisma.chat.findFirst({
        where: {
            users: {
                hasEvery: [userId, otherUserId]
            }
        }
    });

    if (existingChat) {
        return res.status(200).json({
            message: "Chat already exists",
            chatId: existingChat.id,
            existing: true
        });
    }

    const newChat = await prisma.chat.create({
        data: {
            users: [userId, otherUserId]
        }
    });

    res.status(201).json({
        message: "Chat created successfully",
        chatId: newChat.id
    });
});

export const getAllChats = TryCatch(async (req: AuthenticatedRequest, res) => {
    const userId = req.user?.id;

    if (!userId) {
        res.status(400).json({ message: "UserId missing" });
        return;
    }

    const chats = await prisma.chat.findMany({
        where: {
            users: {
                has: userId
            }
        },
        orderBy: {
            updatedAt: "desc"
        }
    });

    const chatWithUserData = await Promise.all(
        chats.map(async (chat) => {
            const otherUserId = chat.users.find(id => id !== userId);

            const unseenMessagesCount = await prisma.message.count({
                where: {
                    chatId: chat.id,
                    sender: {
                        not: userId
                    },
                    seen: false
                }
            });

            try {
                const { data } = await axios.get(
                    `${process.env.USER_SERVICE}/api/user/${otherUserId}`
                );

                return {
                    user: data.user,
                    chat: {
                        ...chat,
                        latestMessage: {
                            text: chat.latestText,
                            sender: chat.latestSender
                        },
                        unseenCount: unseenMessagesCount
                    }
                };

            } catch (error) {
                console.log(error);

                return {
                    user: {
                        id: otherUserId,
                        name: "Unknown User"
                    },
                    chat: {
                        ...chat,
                        latestMessage: {
                            text: chat.latestText,
                            sender: chat.latestSender
                        },
                        unseenCount: unseenMessagesCount
                    }
                };
            }
        })
    );

    res.status(200).json({
        message: "Chats retrieved successfully",
        chats: chatWithUserData
    });
});

export const sendMessage = TryCatch(async (req: AuthenticatedRequest, res) => {
    const senderId = req.user?.id;

    const { chatId, text } = req.body;

    const imageFile = req.file;

    if (!senderId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    if (!chatId) {
        res.status(400).json({ message: "chatId is required" });
        return;
    }

    if (!text && !imageFile) {
        res.status(400).json({
            message: "Either text or image is required"
        });
        return;
    }

    const chat = await prisma.chat.findUnique({
        where: {
            id: chatId
        }
    });

    if (!chat) {
        res.status(404).json({ message: "Chat not found" });
        return;
    }

    const isUserInChat = chat.users.some(
        (userId) => userId === senderId
    );

    if (!isUserInChat) {
        res.status(403).json({
            message: "You are not a member of this chat"
        });
        return;
    }

    const otherUserId = chat.users.find(
        userId => userId !== senderId
    );

    if (!otherUserId) {
        res.status(401).json({
            message: "Invalid chat participants"
        });
        return;
    }

    //socket

    const savedMessage = await prisma.message.create({
        data: {
            chatId: chatId as string,
            sender: senderId,
            text: text || "",
            messageType: imageFile ? "image" : "text",
            seen: false,

            ...(imageFile && {
                imageUrl: imageFile.path,
                imagePublicId: imageFile.filename,
            }),
        },
    });

    const latestMessageText = imageFile
        ? "Sent an image"
        : text;

    await prisma.chat.update({
        where: {
            id: chatId
        },
        data: {
            latestText: latestMessageText,
            latestSender: senderId
        }
    });

    //socket

    const formattedMessage = {
        ...savedMessage,

        image: savedMessage.imageUrl
            ? {
                url: savedMessage.imageUrl,
                publicId: savedMessage.imagePublicId,
            }
            : undefined,
    };

    io.to(chatId).emit("newMessage", formattedMessage);

    

    res.status(201).json({
        message: formattedMessage,
        sender: senderId
    });
});

export const getMessagesByChatId = TryCatch(async (req: AuthenticatedRequest, res) => {
    const userId = req.user?.id;

    const chatId = req.params.chatId as string;

    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    if (!chatId) {
        res.status(400).json({
            message: "chatId is required"
        });
        return;
    }

    const chat = await prisma.chat.findUnique({
        where: {
            id: chatId
        }
    });

    if (!chat) {
        res.status(404).json({
            message: "Chat not found"
        });
        return;
    }

    const isUserInChat = chat.users.some(
        chatUserId => chatUserId === userId
    );

    if (!isUserInChat) {
        res.status(403).json({
            message: "You are not a member of this chat"
        });
        return;
    }

    const messagesToMarkSeen = await prisma.message.findMany({
        where: {
            chatId,
            sender: {
                not: userId
            },
            seen: false
        }
    });

    await prisma.message.updateMany({
        where: {
            chatId,
            sender: {
                not: userId
            },
            seen: false
        },
        data: {
            seen: true,
            seenAt: new Date()
        }
    });



    const messages = await prisma.message.findMany({
        where: {
            chatId
        },
        orderBy: {
            createdAt: "asc"
        }
    });

    const formattedMessages = messages.map(
        (message) => ({
            ...message,

            image: message.imageUrl
                ? {
                    url: message.imageUrl,
                    publicId: message.imagePublicId
                }
                : undefined
        })
    );

    const otherUserId = chat.users.find(
        id => id !== userId
    );

    if (!otherUserId) {
        res.status(401).json({
            message: "Invalid chat participants"
        });
        return;
    }

    // socket seen event
    if (messagesToMarkSeen.length > 0) {

        const otherUserSocketId =
            getReceiverSocketId(otherUserId);

        if (otherUserSocketId) {

            io.to(otherUserSocketId).emit(
                "messagesSeen",
                {
                    chatId,
                    seenBy: userId,
                    messageIds:
                        messagesToMarkSeen.map(
                            (message) => message.id
                        )
                }
            );
        }
    }

    try {
        const { data } = await axios.get(
            `${process.env.USER_SERVICE}/api/user/${otherUserId}`
        );

        //socket

        res.status(200).json({
            messages: formattedMessages,
            user: data
        });

    } catch (error) {
        console.log(error);

        res.status(200).json({
            messages,
            user: {
                id: otherUserId,
                name: "Unknown User"
            }
        });
    }
});