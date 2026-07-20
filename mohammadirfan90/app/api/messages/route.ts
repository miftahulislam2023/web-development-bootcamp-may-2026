import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { Chat } from '@/models/Chat';
import { Message } from '@/models/Message';
import { User } from '@/models/User';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';
import { encryptMessage } from '@/lib/encryption';

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { chatId, content } = await req.json();

    if (!chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
      return NextResponse.json({ success: false, message: 'Invalid chat ID' }, { status: 400 });
    }

    if (!content || !content.trim()) {
      return NextResponse.json({ success: false, message: 'Message content cannot be empty' }, { status: 400 });
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

    const encrypted = encryptMessage(content.trim());

    let message = await Message.create({
      sender: user._id,
      ciphertext: encrypted.ciphertext,
      iv: encrypted.iv,
      authTag: encrypted.authTag,
      chat: chatId,
      readBy: [user._id]
    });

    // Inject the plaintext back into the Mongoose document so the API response
    // stays fully backwards compatible with the frontend.
    message.content = content.trim();

    message = await message.populate('sender', 'username avatar');

    // Update latest message in chat
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message._id
    });

    return NextResponse.json({ success: true, data: message }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Server Error' }, { status: 500 });
  }
}
