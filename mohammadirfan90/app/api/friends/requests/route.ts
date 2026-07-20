import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { FriendRequest } from '@/models/FriendRequest';
import { connectDB } from '@/lib/db';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const requests = await FriendRequest.find({
      receiver: user._id,
      status: 'pending'
    })
      .populate('sender', 'username avatar email')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: requests });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Server Error' }, { status: 500 });
  }
}
