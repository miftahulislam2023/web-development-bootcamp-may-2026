import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Chat } from "@/models/Chat";
import { Message } from "@/models/Message";
import { users, currentUser, directMessages, groupChats, messages as mockMessages } from "@/lib/mock-data";

export async function POST() {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Chat.deleteMany({});
    await Message.deleteMany({});

    // 1. Seed Users
    const allMockUsers = [currentUser, ...users];
    const createdUsers = await User.insertMany(
      allMockUsers.map(u => ({
        username: u.name,
        email: `${u.name.replace(/\s+/g, '').toLowerCase()}@example.com`,
        avatar: u.avatarUrl || "",
        // Store original mock ID for mapping later
        mockId: u.id
      }))
    );

    const getUserId = (mockId: string) => 
      createdUsers.find(u => (u as any).mockId === mockId)?._id;

    const myId = getUserId(currentUser.id);

    // 2. Seed DMs
    for (const dm of directMessages) {
      const otherUserId = getUserId(dm.user.id);
      if (!otherUserId) continue;

      const chat = await Chat.create({
        chatName: "sender",
        isGroupChat: false,
        users: [myId, otherUserId],
      });

      // Add a message
      const msg = await Message.create({
        sender: otherUserId,
        content: dm.lastMessage,
        chat: chat._id,
      });

      chat.latestMessage = msg._id;
      await chat.save();
    }

    // 3. Seed Groups
    for (const group of groupChats) {
      const groupUserIds = [myId];
      if (group.members) {
        group.members.forEach(m => {
          const uId = getUserId(m.id);
          if (uId) groupUserIds.push(uId);
        });
      }

      const chat = await Chat.create({
        chatName: group.name,
        isGroupChat: true,
        users: groupUserIds,
        groupAdmin: myId,
      });

      // Add a message
      const msg = await Message.create({
        sender: myId,
        content: group.lastMessage,
        chat: chat._id,
      });

      chat.latestMessage = msg._id;
      await chat.save();
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      currentUserId: myId
    });

  } catch (error: any) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
