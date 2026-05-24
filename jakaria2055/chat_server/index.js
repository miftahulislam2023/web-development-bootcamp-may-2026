import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./config/db.js";
import userRouter from "./api/api.js";
import messageRouter from "./api/messageAPI.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

//IMPLENT SOCKET.io SERVER
export const io = new Server(server, {
  cors: { origin: "*" },
});

//STORE ONLINE USER
export const userSocketMap = {};

//Socket.io CONNECTION HANDLER
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected", userId);

  if (userId) userSocketMap[userId] = socket.id;

  //EMIT ONLINE USER TO ALL CONNECTED CLIENTS
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

app.use(express.json({ limit: "5mb" }));
app.use(cors());

app.get("/", (req, res) =>
  res.send(`
    <div style="font-family: Arial, sans-serif; background-color: #8c9aa7; height: 100vh; display: flex; align-items: center; justify-content: center;">
      <div style="background-color: #ffffff; padding: 30px 40px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center;">
        <h3 style="color: #1a73e8; font-size: 24px; margin-bottom: 12px;">
          Chat Application Server is Running Fine...
        </h3>
        <p style="color: #555; font-size: 16px; margin-top: 8px;">
          Your backend is live and ready to handle requests 🚀
        </p>
      </div>
    </div>
  `),
);
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Server is running on PORT: ", PORT));

export default server;
