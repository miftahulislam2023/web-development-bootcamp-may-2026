import TryCatch from "../config/TryCatch.js"
import type { Response } from "express"
import type { AuthenticatedRequest } from "../middleware/isAuth.js"
import { Chat } from "../models/Chat.js";
import { Message } from "../models/Messages.js";
import axios from "axios";
import { io, userSocketMap } from "../config/socket.js";

const userServiceBase = process.env.USER_SERVICE || 'http://user:5000';

export const createNewChat = TryCatch(
    async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.user?._id;
        const {otherUserId} = req.body;

        if(!otherUserId)
        {
            res.status(400).json({
                message:"Other user id is required",
            });
            return;
        }


        const existingChat = await Chat.findOne({
            users: {$all: [userId, otherUserId], $size: 2},
        });

        if(existingChat)
        {
            res.status(400).json({
                message:"Chat already exists",
                chatId: existingChat._id,
            });
            return;
        }

        const newChat = await Chat.create({
            users: [userId, otherUserId],
        });

        res.status(201).json({
            message:"Chat created successfully",
            chatId: newChat._id,
        });

    }   
);

export const getAllChats = TryCatch(
    async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.user?._id;

        if(!userId)
        {
            res.status(400).json({
                message:"User id is required",
            });
            return;
        }

        const chats = await Chat.find({
            users: userId,
        }).sort({updatedAt: -1});

        const chatWithUserData = await Promise.all(
            chats.map(async (chat) => {
                const otherUserId = chat.users.find(id=>id.toString()!==userId?.toString());

                const unseenCount = await Message.countDocuments({
                    chatId: chat._id,
                    seen: false,
                    sender: {$ne: userId},
                });

                try {

                    const {data} = await axios.get(`${userServiceBase}/api/v1/user/${otherUserId}`);

                    return {
                        user: data.user,
                        chat: {
                            ...chat.toObject(),
                            latestMessage: chat.latestMessage?.text ? chat.latestMessage : null,
                            unseenCount,
                        },

                    }
                    
                } catch (error) {
                    console.log("Error fetching user data for chat:", error);
                    return {
                        user: {_id: otherUserId, name: "Unknown User"},
                        chat: {
                            ...chat.toObject(),
                            latestMessage: chat.latestMessage?.text ? chat.latestMessage : null,
                            unseenCount,
                        },
                    };
                    
                }

            }
        ));

        res.status(200).json({
            message:"Chats fetched successfully",
            chats: chatWithUserData,
        });
    
    });


export const sendMessage = TryCatch(
    async (req: AuthenticatedRequest , res: Response) => {

        const senderId = req.user?._id;
        const {chatId,text} = req.body;
        const imageFile = req.file;

        console.log('Send message request:', { senderId, chatId, text, hasFile: !!imageFile });

        if(!senderId){
            res.status(400).json({
                message:"Sender id is required",
            });
            return; 
        }

        if(!chatId){
            res.status(400).json({
                message:"Chat id is required",
            });
            return; 
        }

        if(!text && !imageFile){
            res.status(400).json({
                message:"Either text or file is required",
            });
            return; 
        }

        const chat = await Chat.findById(chatId);

        if(!chat){
            res.status(404).json({
                message:"Chat not found",
            });
            return; 
        }

        const isUserInChat = chat.users.some(
            (userId) => userId.toString() === senderId.toString()
        );

        if(!isUserInChat){
            res.status(403).json({
                message:"You are not a member of this chat",
            });
            return; 
        }

        const otherUserId = chat.users.find(
            (userId) => userId.toString() !== senderId.toString()
        );

        if(!otherUserId){
            res.status(400).json({
                message:"Other user not found",
            });
            return; 
        }


        let messageData: any = {
            chatId: chatId,
            sender: senderId,
            seen: false,
            seenAt: undefined,
        };

        if(imageFile){
            console.log('Processing file upload:', { 
                filename: imageFile.filename, 
                path: imageFile.path,
                mimetype: imageFile.mimetype,
                size: imageFile.size 
            });
            
            const mimeType = imageFile.mimetype;
            const isImage = mimeType.startsWith('image/');

            if(isImage){
                messageData.image = {
                    url: imageFile.path,
                    publicId: imageFile.filename,
                };
                messageData.messageType = "image";
                messageData.text = text || "";
            } else {
                messageData.file = {
                    url: imageFile.path,
                    publicId: imageFile.filename,
                    name: imageFile.originalname,
                    size: imageFile.size,
                    type: mimeType,
                };
                messageData.messageType = "file";
                messageData.text = text || "";
            }
        }
        else{
            messageData.text = text;
            messageData.messageType = "text";
        }

        const message = new Message(messageData);
        const savedMessage = await message.save();

        console.log('Message saved successfully:', savedMessage._id);

        let latestMessageText = text;
        if(imageFile){
            const isImage = imageFile.mimetype.startsWith('image/');
            latestMessageText = isImage ? "Sent an image" : `Sent a file: ${imageFile.originalname}`;
        }

        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: {
                text: latestMessageText,
                sender: senderId,

            },
            updatedAt: new Date(),

        
        }, {new: true});


        //emit socket event to other user in chat
        const receiverSocketId = userSocketMap[otherUserId.toString()];
        if (receiverSocketId) io.to(receiverSocketId).emit("newMessage", savedMessage);

        res.status(201).json({
            message: savedMessage,
            senderId: senderId,
        });
});


export const deleteMessage = TryCatch(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;
    const { messageId } = req.params;
    const { deleteFor } = req.body;

    const message = await Message.findById(messageId);
    if (!message) { res.status(404).json({ message: "Message not found" }); return; }

    const chat = await Chat.findById(message.chatId);
    if (!chat) { res.status(404).json({ message: "Chat not found" }); return; }

    if (deleteFor === "everyone") {
        if (message.sender.toString() !== userId?.toString()) {
            res.status(403).json({ message: "You can only delete your own messages for everyone" });
            return;
        }
        await Message.findByIdAndUpdate(messageId, { deleted: true, deletedAt: new Date() });
        const otherUserId = chat.users.find(id => id.toString() !== userId?.toString());
        const receiverSocketId = otherUserId ? userSocketMap[otherUserId.toString()] : null;
        if (receiverSocketId) io.to(receiverSocketId).emit("messageDeleted", { messageId, chatId: message.chatId });
        res.status(200).json({ message: "Message deleted for everyone" });
    } else {
        await Message.findByIdAndUpdate(messageId, { $addToSet: { hiddenFrom: userId } });
        res.status(200).json({ message: "Message deleted for you" });
    }
});

export const editMessage = TryCatch(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;
    const { messageId } = req.params;
    const { text } = req.body;

    if (!text?.trim()) { res.status(400).json({ message: "Text is required" }); return; }

    const message = await Message.findById(messageId);
    if (!message) { res.status(404).json({ message: "Message not found" }); return; }

    if (message.sender.toString() !== userId?.toString()) {
        res.status(403).json({ message: "You can only edit your own messages" });
        return;
    }

    if (message.deleted) { res.status(400).json({ message: "Cannot edit a deleted message" }); return; }

    const updated = await Message.findByIdAndUpdate(
        messageId,
        { text: text.trim(), edited: true },
        { new: true }
    );

    const chat = await Chat.findById(message.chatId);
    if (chat) {
        const otherUserId = chat.users.find(id => id.toString() !== userId?.toString());
        const receiverSocketId = otherUserId ? userSocketMap[otherUserId.toString()] : null;
        if (receiverSocketId) io.to(receiverSocketId).emit("messageEdited", { messageId, text: text.trim(), chatId: message.chatId });
    }

    res.status(200).json({ message: updated });
});

export const reactToMessage = TryCatch(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;
    const { messageId } = req.params;
    const { emoji } = req.body;

    if (!emoji) { res.status(400).json({ message: "Emoji is required" }); return; }

    const message = await Message.findById(messageId);
    if (!message) { res.status(404).json({ message: "Message not found" }); return; }

    const existing = message.reactions.find(r => r.userId === userId?.toString());

    if (existing && existing.emoji === emoji) {
        await Message.findByIdAndUpdate(messageId, { $pull: { reactions: { userId: userId?.toString() } } });
    } else if (existing) {
        await Message.findByIdAndUpdate(messageId, 
            { $set: { "reactions.$[el].emoji": emoji } },
            { arrayFilters: [{ "el.userId": userId?.toString() }] }
        );
    } else {
        await Message.findByIdAndUpdate(messageId, { $push: { reactions: { userId: userId?.toString(), emoji } } });
    }

    const updated = await Message.findById(messageId);
    const chat = await Chat.findById(message.chatId);
    if (chat) {
        const otherUserId = chat.users.find(id => id.toString() !== userId?.toString());
        const receiverSocketId = otherUserId ? userSocketMap[otherUserId.toString()] : null;
        if (receiverSocketId) io.to(receiverSocketId).emit("messageReacted", { messageId, reactions: updated?.reactions, chatId: message.chatId });
    }

    res.status(200).json({ reactions: updated?.reactions });
});

export const getMessagesByChat = TryCatch(async (req: AuthenticatedRequest, res: Response)=>{
   const userId = req.user?._id;
   const {chatId} = req.params;
    if(!userId){
        res.status(401).json({
            message:"User id is required",
        });
        return;
    }
    if(!chatId){
        res.status(400).json({
            message:"Chat id is required",
        });
        return;
    }

    const chat = await Chat.findById(chatId);

    if(!chat){
        res.status(404).json({
            message:"Chat not found",
        });
        return;
    }

    const isUserInChat = chat.users.some(
        (id) => id.toString() === userId.toString()
    );

    if(!isUserInChat){
        res.status(403).json({
            message:"You are not a member of this chat",
        });
        return;
    }

    const unseenMessages = await Message.find({ chatId, seen: false, sender: { $ne: userId } }, "_id sender");

    await Message.updateMany(
        { chatId, seen: false, sender: { $ne: userId } },
        { seen: true, seenAt: new Date() }
    );

    if (unseenMessages.length > 0) {
        const firstSender = unseenMessages[0]?.sender?.toString();
        const senderSocketId = firstSender ? userSocketMap[firstSender] : null;
        if (senderSocketId) io.to(senderSocketId).emit("messagesSeen", { chatId });
    }


    const messages = await Message.find({chatId}).sort({createdAt: 1});

    const otherUserId = chat.users.find((id) => id!== userId);

    try {
    const {data} = await axios.get(`${userServiceBase}/api/v1/user/${otherUserId}`);
       
    
    if(!otherUserId){
        res.status(400).json({
            message:"Other user not found",
        });
        return;
    };

    res.status(200).json({  
        messages,
        user: data.user,
    });


    } 
    
    catch (error) {
        console.log(error);
        res.json({
            messages,
            user: {_id: otherUserId, name: "Unknown User"},
        });
    }

});

export const deleteChat = TryCatch(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;
    const { chatId } = req.params;

    if (!userId) {
        res.status(401).json({ message: "User id is required" });
        return;
    }

    if (!chatId) {
        res.status(400).json({ message: "Chat id is required" });
        return;
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
        res.status(404).json({ message: "Chat not found" });
        return;
    }

    const isUserInChat = chat.users.some(id => id.toString() === userId.toString());
    if (!isUserInChat) {
        res.status(403).json({ message: "You are not a member of this chat" });
        return;
    }

    // Delete all messages in the chat
    await Message.deleteMany({ chatId });
    
    // Delete the chat
    await Chat.findByIdAndDelete(chatId);

    // Notify other user via socket
    const otherUserId = chat.users.find(id => id.toString() !== userId.toString());
    if (otherUserId) {
        const receiverSocketId = userSocketMap[otherUserId.toString()];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("chatDeleted", { chatId });
        }
    }

    res.status(200).json({ 
        success: true,
        message: "Chat deleted successfully" 
    });
});