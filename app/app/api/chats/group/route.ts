import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { Chat } from '@/models/Chat';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { chatName, users } = await req.json();

    if (!chatName || !users || !Array.isArray(users)) {
      return NextResponse.json({ success: false, message: 'Please provide chatName and users array' }, { status: 400 });
    }

    // Validate ObjectIds and remove duplicates, including the current user if they accidentally included themselves
    const validUsers = users
      .filter((id: string) => mongoose.Types.ObjectId.isValid(id) && id !== user._id.toString())
      .reduce((unique: string[], id: string) => {
        return unique.includes(id) ? unique : [...unique, id];
      }, []);

    // Add current user
    validUsers.push(user._id.toString());

    if (validUsers.length < 3) {
      return NextResponse.json({ success: false, message: 'A group chat requires at least 3 users' }, { status: 400 });
    }

    await connectDB();

    const groupChat = await Chat.create({
      chatName,
      isGroupChat: true,
      users: validUsers,
      groupAdmin: user._id,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', 'username avatar')
      .populate('groupAdmin', 'username')
      .lean();

    return NextResponse.json({ success: true, data: fullGroupChat }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Server Error' }, { status: 500 });
  }
}
