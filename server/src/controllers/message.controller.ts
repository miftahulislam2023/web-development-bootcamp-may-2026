import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

export const getMessages = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { roomId } = req.params;
    const { cursor, limit = '30' } = req.query;

    // Verify membership
    const member = await prisma.roomMember.findUnique({
      where: { userId_roomId: { userId: req.user!.id, roomId } },
    });
    if (!member) throw new AppError('Not a member of this room', 403);

    const messages = await prisma.message.findMany({
      where: { roomId },
      ...(cursor ? { cursor: { id: cursor as string }, skip: 1 } : {}),
      take: parseInt(limit as string),
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, username: true, avatar: true } },
        readBy: { select: { userId: true } },
      },
    });

    res.json({ success: true, messages: messages.reverse() });
  } catch (err) {
    next(err);
  }
};

export const markRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { messageId } = req.params;
    await prisma.messageRead.upsert({
      where: { userId_messageId: { userId: req.user!.id, messageId } },
      create: { userId: req.user!.id, messageId },
      update: {},
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
