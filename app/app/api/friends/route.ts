import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { Friendship } from '@/models/Friendship';
import { connectDB } from '@/lib/db';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const friendships = await Friendship.find({
      users: user._id
    })
      .populate('users', 'username avatar email')
      .lean();

    const friends = friendships.map(friendship => {
      const friend = friendship.users.find(
        (u: any) => u._id.toString() !== user._id.toString()
      );
      
      return {
        friendshipId: friendship._id,
        friend,
        createdAt: friendship.createdAt
      };
    });

    return NextResponse.json({ success: true, data: friends });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Server Error' }, { status: 500 });
  }
}
