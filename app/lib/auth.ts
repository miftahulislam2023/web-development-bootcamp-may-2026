import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { User } from '@/models/User';
import { connectDB } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET;

export interface TokenPayload {
  userId: string;
  role: string;
}

export function signToken(userId: string, role: string): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  await connectDB();
  const user = await User.findById(payload.userId).select('-password').lean();
  return user ? user : null;
}
