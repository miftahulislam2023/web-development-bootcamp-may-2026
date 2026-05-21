require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./src/app");
const Message = require("./src/models/Message");
const User = require("./src/models/User");
const connectDB = require("./src/config/db");

connectDB();

const PORT = process.env.PORT || 5001;

const server = http.createServer(app);




// socket
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});


const onlineUsers = {};

io.on("connection", (socket) => {
  // console.log("User connected:", socket.id);


  socket.on("join", (userId) => {
    onlineUsers[userId] = socket.id;
    // console.log("Online Users:", onlineUsers);

  io.emit(
  "online_users",
  Object.keys(onlineUsers)
  );
});


  socket.on("send_message", async (messageData) => {
    console.log(messageData);

  const newMessage = await Message.create({
    senderId: messageData.senderId,
    receiverId: messageData.receiverId,
    text: messageData.text,
  });


  const populatedMessage =
    await newMessage.populate(
      "senderId receiverId",
      "name email avatar"
    );


    const receiverSocketId =
      onlineUsers[messageData.receiverId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit(
        "receive_message",
        messageData
      );
    }

    socket.emit(
      "receive_message",
      messageData
    );
  });



  socket.on("typing", (data) => {

  const receiverSocketId =
    onlineUsers[data.receiverId];

  if (receiverSocketId) {
    io.to(receiverSocketId).emit(
      "typing",
      data.senderName
    );
  }
  });

  socket.on("stop_typing", (data) => {
  const receiverSocketId =
    onlineUsers[data.receiverId];

  if (receiverSocketId) {
    io.to(receiverSocketId).emit(
      "stop_typing"
    );
  }
  });



  socket.on(
  "messages_seen",
  (data) => {

    const receiverSocketId =
      onlineUsers[data.senderId];


    if (receiverSocketId) {

      io.to(receiverSocketId).emit(
        "messages_seen"
      );
    }
  });



  socket.on("disconnect", async () => {
    console.log("User disconnected:", socket.id);

    for (const userId in onlineUsers) {
      if (
        onlineUsers[userId] === socket.id
      ) {

        await User.findByIdAndUpdate(
        userId,
        {
          lastSeen: new Date(),
        }
      );

        delete onlineUsers[userId];
      }
    }

    io.emit(
    "online_users",
    Object.keys(onlineUsers)
  );
  });
});



server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});