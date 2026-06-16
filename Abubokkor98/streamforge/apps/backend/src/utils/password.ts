import bcrypt from 'bcryptjs';
import { ApiError } from '@/utils/api-error';

const SALT_ROUNDS = 12;

export async function hashPassword(plainPassword: string): Promise<string> {
  try {
    return await bcrypt.hash(plainPassword, SALT_ROUNDS);
  } catch (error) {
    throw ApiError.internal('Failed to hash password');
  }
}

export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    throw ApiError.internal('Failed to verify password');
  }
}
