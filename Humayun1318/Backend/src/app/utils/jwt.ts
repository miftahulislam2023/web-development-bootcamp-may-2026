import type { JwtPayload, SignOptions } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

// Generate JWT Token
export const generateToken = (
  payload: JwtPayload,
  jwtSecret: string,
  expiresIn: string,
): string => {
  const token = jwt.sign(payload, jwtSecret, { expiresIn } as SignOptions);
  return token;
};

// Verify JWT Token
export const verifyToken = (token: string, jwtSecret: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
