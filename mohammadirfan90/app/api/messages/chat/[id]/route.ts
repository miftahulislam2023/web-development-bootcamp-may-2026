import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { Chat } from '@/models/Chat';
import { Message } from '@/models/Message';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

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

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'username email avatar')
      .populate('chat')
      .sort({ createdAt: 1 })
      .limit(50)
      .lean();

    return NextResponse.json({ success: true, data: messages });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Server Error' }, { status: 500 });
  }
}
