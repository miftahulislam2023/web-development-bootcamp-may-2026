import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { User } from '@/models/User';
import { connectDB } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get('search');

    if (!searchQuery) {
      return NextResponse.json({ success: true, data: [] });
    }

    await connectDB();

    const regex = new RegExp(searchQuery, 'i');

    const users = await User.find({
      _id: { $ne: user._id },
      $or: [{ username: regex }, { email: regex }],
    })
      .select('-password')
      .limit(10)
      .lean();

    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Server Error' }, { status: 500 });
  }
}
