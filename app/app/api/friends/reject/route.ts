import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { FriendRequest } from '@/models/FriendRequest';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { requestId } = await req.json();

    if (!requestId || !mongoose.Types.ObjectId.isValid(requestId)) {
      return NextResponse.json({ success: false, message: 'Invalid request ID' }, { status: 400 });
    }

    await connectDB();

    const friendRequest = await FriendRequest.findById(requestId);
    
    if (!friendRequest) {
      return NextResponse.json({ success: false, message: 'Friend request not found' }, { status: 404 });
    }

    if (friendRequest.receiver.toString() !== user._id.toString()) {
      return NextResponse.json({ success: false, message: 'Only the receiver can reject this request' }, { status: 403 });
    }

    if (friendRequest.status !== 'pending') {
      return NextResponse.json({ success: false, message: `Request is already ${friendRequest.status}` }, { status: 400 });
    }

    friendRequest.status = 'rejected';
    await friendRequest.save();

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Server Error' }, { status: 500 });
  }
}
