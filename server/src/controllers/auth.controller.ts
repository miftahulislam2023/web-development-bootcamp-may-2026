import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

const registerSchema = z.object({
  username: z.string().min(3).max(10),
  name: z.string().min(2).max(30).optional(),
  email: z.string().email(),
  password: z.string().min(6).max(12),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const signToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any,
  });

const sendTokenCookie = (res: Response, token: string) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
  });
};


export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, name, email, password } = registerSchema.parse(req.body);
    const avatar = req.file ? (req.file as any).path : null;

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existing) throw new AppError('Email or username already taken', 409);

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { username, name, email, password: hashed, avatar },
      select: { id: true, username: true, name: true, email: true, avatar: true, createdAt: true },
    });

    const token = signToken(user.id);
    sendTokenCookie(res, token);
    res.status(201).json({ success: true, user, token });
  } catch (err) {
    console.error('Registration error:', err);
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = signToken(user.id);
    sendTokenCookie(res, token);
    const { password: _, ...safeUser } = user;
    res.json({ success: true, user: safeUser, token });
  } catch (err) {
    next(err);
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, username: true, name: true, email: true, avatar: true, createdAt: true },
    });
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};
