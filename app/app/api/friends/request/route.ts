import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { FriendRequest } from '@/models/FriendRequest';
import { Friendship } from '@/models/Friendship';
import { User } from '@/models/User';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { receiverId } = await req.json();

    if (!receiverId || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return NextResponse.json({ success: false, message: 'Invalid receiver ID' }, { status: 400 });
    }

    if (user._id.toString() === receiverId) {
      return NextResponse.json({ success: false, message: 'Cannot send a friend request to yourself' }, { status: 400 });
    }

    await connectDB();

    const receiverUser = await User.findById(receiverId);
    if (!receiverUser) {
      return NextResponse.json({ success: false, message: 'Receiver not found' }, { status: 404 });
    }

    // Check if they are already friends
    const existingFriendship = await Friendship.findOne({
      users: { $all: [user._id, receiverId] }
    });

    if (existingFriendship) {
      return NextResponse.json({ success: false, message: 'You are already friends' }, { status: 400 });
    }

    // Check if there's already a pending request (either direction)
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: user._id, receiver: receiverId, status: 'pending' },
        { sender: receiverId, receiver: user._id, status: 'pending' }
      ]
    });

    if (existingRequest) {
      return NextResponse.json({ success: false, message: 'A pending friend request already exists' }, { status: 400 });
    }

    const newRequest = await FriendRequest.create({
      sender: user._id,
      receiver: receiverId,
      status: 'pending'
    });

    return NextResponse.json({ success: true, data: newRequest }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Server Error' }, { status: 500 });
  }
}
