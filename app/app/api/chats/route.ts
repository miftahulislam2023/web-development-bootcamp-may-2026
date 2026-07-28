import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { Chat } from '@/models/Chat';
import { User } from '@/models/User';
// Need to import Message to ensure model is registered before population sometimes, though typically fine.
import { Message } from '@/models/Message';
import { connectDB } from '@/lib/db';
import { decryptMessageDoc } from '@/lib/encryption';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Ensure Message model is initialized
    Message.init();

    let chats = await Chat.find({ users: user._id })
      .populate('users', 'username avatar')
      .populate('groupAdmin', 'username')
      .populate('latestMessage')
      .sort({ updatedAt: -1 })
      .lean();

    chats = await User.populate(chats, {
      path: 'latestMessage.sender',
      select: 'username avatar',
    });

    chats.forEach((chat: any) => {
      if (chat.latestMessage) {
        decryptMessageDoc(chat.latestMessage);
      }
    });

    return NextResponse.json({ success: true, data: chats });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Server Error' }, { status: 500 });
  }
}
