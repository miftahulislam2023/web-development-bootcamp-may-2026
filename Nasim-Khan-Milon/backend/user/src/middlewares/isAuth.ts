import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import prisma from '../config/prisma.js';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

interface DecodedToken extends JwtPayload {
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        message: 'Unauthorized',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        message: 'Please login! Token not found',
      });
      return;
    }

    const decodedValue = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;

    const userId = decodedValue.user?.id;

    if (!userId) {
      res.status(401).json({
        message: 'Invalid token',
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      res.status(401).json({
        message: 'Invalid token',
      });
      return;
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({
      message: 'Please login',
    });
  }
};