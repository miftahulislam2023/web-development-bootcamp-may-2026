import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { Chat } from '@/models/Chat';
import { Message } from '@/models/Message';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';
import { decryptMessageDoc } from '@/lib/encryption';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id: chatId } = await params;

    if (!chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
      return NextResponse.json({ success: false, message: 'Invalid chat ID' }, { status: 400 });
    }

    await connectDB();

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return NextResponse.json({ success: false, message: 'Chat not found' }, { status: 404 });
    }

    // Verify user is a member of the chat
    const isMember = chat.users.some((id: mongoose.Types.ObjectId) => id.toString() === user._id.toString());
    if (!isMember) {
      return NextResponse.json({ success: false, message: 'You are not a member of this chat' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get('cursor');

    const query: any = { chat: chatId };
    if (cursor) {
      query._id = { $lt: cursor };
    }

    let messages = await Message.find(query)
      .populate('sender', 'username avatar')
      .sort({ _id: -1 })
      .limit(50)
      .lean();

    messages = messages.reverse().map(decryptMessageDoc);

    const nextCursor = messages.length > 0 ? messages[0]._id : null;
    const hasMore = messages.length === 50;

    return NextResponse.json({ success: true, data: messages, nextCursor, hasMore });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Server Error' }, { status: 500 });
  }
}
