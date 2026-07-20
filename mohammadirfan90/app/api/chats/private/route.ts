import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { Chat } from '@/models/Chat';
import { Friendship } from '@/models/Friendship';
import { User } from '@/models/User';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';
import { decryptMessageDoc } from '@/lib/encryption';

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { friendId } = await req.json();

    if (!friendId || !mongoose.Types.ObjectId.isValid(friendId)) {
      return NextResponse.json({ success: false, message: 'Invalid friend ID' }, { status: 400 });
    }

    if (user._id.toString() === friendId) {
      return NextResponse.json({ success: false, message: 'Cannot create a chat with yourself' }, { status: 400 });
    }

    await connectDB();

    // Verify friendship
    const isFriend = await Friendship.findOne({
      users: { $all: [user._id, friendId] }
    });

    if (!isFriend) {
      return NextResponse.json({ success: false, message: 'You can only chat with friends' }, { status: 403 });
    }

    // Check if private chat already exists
    let chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [user._id, friendId] }
    })
      .populate('users', 'username avatar')
      .populate('latestMessage')
      .lean();

    if (chat) {
      // Populate sender of latest message if exists
      chat = await User.populate(chat, {
        path: 'latestMessage.sender',
        select: 'username avatar',
      });
      if (chat.latestMessage) {
        decryptMessageDoc(chat.latestMessage);
      }
      return NextResponse.json({ success: true, data: chat });
    }

    // Create new private chat
    const newChat = await Chat.create({
      chatName: 'sender', // Convention: private chats don't really use this name
      isGroupChat: false,
      users: [user._id, friendId]
    });

    const fullChat = await Chat.findOne({ _id: newChat._id })
      .populate('users', 'username avatar')
      .lean();

    return NextResponse.json({ success: true, data: fullChat }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Server Error' }, { status: 500 });
  }
}
