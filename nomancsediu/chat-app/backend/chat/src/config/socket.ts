import {Server, Socket} from 'socket.io';
import http from 'http';
import express from 'express';
import axios from 'axios';

const userServiceBase = process.env.USER_SERVICE || 'http://user:5000';

const app = express()
const server = http.createServer(app);
const io = new Server(server,{
    cors:{ origin:"*", methods: ["GET", "POST"] },
});

export const userSocketMap: Record<string, string> = {};

io.on("connection", async (socket:Socket) => {
    console.log("User Connected", socket.id);

    const userId = socket.handshake.query.userId as string | undefined;

    if(userId && userId!="undefined") {
        try {
            const { data } = await axios.get(`${userServiceBase}/api/v1/user/${userId}`);
            if (!data?.user?.isInvisible) {
                userSocketMap[userId] = socket.id;
                console.log(`User ${userId} mapped to socket ${socket.id}`);
            }
        } catch {
            userSocketMap[userId] = socket.id;
        }
    }

    io.emit("getOnlineUser", Object.keys(userSocketMap));

    socket.on("typing", (receiverId: string) => {
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) io.to(receiverSocketId).emit("typing", userId);
    });

    socket.on("stopTyping", (receiverId: string) => {
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) io.to(receiverSocketId).emit("stopTyping", userId);
    });

    socket.on("disconnect", ()=>{
        console.log("User Disconnected", socket.id);

        if(userId)
        {
            delete userSocketMap[userId]
            console.log(`User ${userId} removed from online users`);
            io.emit("getOnlineUser", Object.keys(userSocketMap))
        }


    });

    socket.on("connect_error",(error)=>{
        console.log("Socket connection Error",error);
    });

});

export {app,server,io};

