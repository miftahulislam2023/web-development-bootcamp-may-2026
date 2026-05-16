import mongoose from "mongoose";
import { User } from "./models/User";
import { Chat } from "./models/Chat";
import { Message } from "./models/Message";
import { users, currentUser, directMessages, groupChats } from "./lib/mock-data";

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function seed() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) throw new Error("No MONGODB_URI");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    await User.deleteMany({});
    await Chat.deleteMany({});
    await Message.deleteMany({});

    const allMockUsers = [currentUser, ...users];
    const createdUsers = await User.insertMany(
      allMockUsers.map(u => ({
        username: u.name,
        email: `${u.name.replace(/\s+/g, '').toLowerCase()}@example.com`,
        avatar: u.avatarUrl || "",
        mockId: u.id
      }))
    );

    const getUserId = (name: string) => 
      createdUsers.find(u => u.username === name)?._id;

    const myId = getUserId(currentUser.name);
    console.log("Created users");

    // DMs
    for (const dm of directMessages) {
      const otherUserId = getUserId(dm.user.name);
      if (!otherUserId) continue;

      const chat = await Chat.create({
        chatName: "sender",
        isGroupChat: false,
        users: [myId, otherUserId],
      });

      const msg = await Message.create({
        sender: otherUserId,
        content: dm.lastMessage,
        chat: chat._id,
      });

      chat.latestMessage = msg._id;
      await chat.save();
    }
    console.log("Created DMs");

    // Groups
    for (const group of groupChats) {
      const groupUserIds = [myId];
      if (group.members) {
        group.members.forEach(m => {
          const uId = getUserId(m.name);
          if (uId) groupUserIds.push(uId);
        });
      }

      const chat = await Chat.create({
        chatName: group.name,
        isGroupChat: true,
        users: groupUserIds,
        groupAdmin: myId,
      });

      const msg = await Message.create({
        sender: myId,
        content: group.lastMessage,
        chat: chat._id,
      });

      chat.latestMessage = msg._id;
      await chat.save();
    }
    console.log("Created Groups");

    console.log(`Seeding complete. My User ID: ${myId}`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();
