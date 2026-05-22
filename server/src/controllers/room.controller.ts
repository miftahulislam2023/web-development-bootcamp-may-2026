import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

const createRoomSchema = z.object({
  name: z.string().min(1).max(20),
  description: z.string().max(100).optional(),
  type: z.enum(['PUBLIC', 'PRIVATE']).default('PUBLIC'),
});

export const getRooms = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const rooms = await prisma.room.findMany({
      where: {
        OR: [
          { type: 'PUBLIC' },
          { type: 'PRIVATE' },
          { type: 'DIRECT', members: { some: { userId } } }
        ]
      },
      include: {
        members: {
          where: {
            OR: [
              { userId },
              { room: { type: 'DIRECT' } }
            ]
          },
          include: { user: { select: { id: true, username: true, name: true, avatar: true } } }
        },
        owner: { select: { id: true, username: true, avatar: true } },
        joinRequests: { where: { userId } },
        _count: { select: { members: true, messages: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { sender: { select: { username: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, rooms });
  } catch (err) {
    next(err);
  }
};


export const getMyRooms = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const rooms = await prisma.room.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        owner: { select: { id: true, username: true, avatar: true } },
        _count: { select: { members: true, messages: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { sender: { select: { username: true } } },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
    res.json({ success: true, rooms });
  } catch (err) {
    next(err);
  }
};


export const getRoomById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const room = await prisma.room.findUnique({
      where: { id: req.params.id },
      include: {
        owner: { select: { id: true, username: true, avatar: true } },
        members: {
          include: { user: { select: { id: true, username: true, avatar: true } } },
        },
        _count: { select: { members: true, messages: true } },
      },
    });
    if (!room) throw new AppError('Room not found', 404);
    res.json({ success: true, room });
  } catch (err) {
    next(err);
  }
};


export const createRoom = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = createRoomSchema.parse(req.body);
    const room = await prisma.room.create({
      data: {
        ...data,
        ownerId: req.user!.id,
        members: { create: { userId: req.user!.id } },
      },
      include: {
        owner: { select: { id: true, username: true, avatar: true } },
        _count: { select: { members: true } },
      },
    });
    res.status(201).json({ success: true, room });
  } catch (err) {
    next(err);
  }
};


export const joinRoom = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const roomId = req.params.id;
    const userId = req.user!.id;

    const room = await prisma.room.findUnique({ 
      where: { id: roomId },
      include: { members: { where: { userId } } }
    });
    
    if (!room) throw new AppError('Room not found', 404);

    if (room.members.length > 0) {
      return res.json({ success: true, message: 'Already a member' });
    }

    if (room.type === 'PRIVATE') {
      const existingRequest = await prisma.joinRequest.findUnique({
        where: { userId_roomId: { userId, roomId } }
      });

      if (existingRequest) {
        if (existingRequest.status === 'PENDING') {
          return res.json({ success: true, message: 'Join request already pending' });
        }
        if (existingRequest.status === 'REJECTED') {
          throw new AppError('Your join request was rejected by the owner', 403);
        }
      }

      await prisma.joinRequest.upsert({
        where: { userId_roomId: { userId, roomId } },
        create: { userId, roomId, status: 'PENDING' },
        update: { status: 'PENDING' }
      });
      
      return res.json({ success: true, message: 'Join request sent to owner' });
    }

    await prisma.roomMember.upsert({
      where: { userId_roomId: { userId, roomId } },
      create: { userId, roomId },
      update: {},
    });
    res.json({ success: true, message: 'Joined room successfully' });
  } catch (err) {
    console.log(err);
    next(err);
  }
};


export const leaveRoom = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.roomMember.delete({
      where: { userId_roomId: { userId: req.user!.id, roomId: req.params.id } },
    });
    res.json({ success: true, message: 'Left room successfully' });
  } catch (err) {
    next(err);
  }
};


export const getRoomRequests = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const roomId = req.params.id;
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new AppError('Room not found', 404);
    if (room.ownerId !== req.user!.id) throw new AppError('Unauthorized', 403);

    const requests = await prisma.joinRequest.findMany({
      where: { roomId, status: 'PENDING' },
      include: { user: { select: { id: true, username: true, avatar: true } } }
    });

    res.json({ success: true, requests });
  } catch (err) {
    next(err);
  }
};

export const respondToJoinRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { requestId, status } = req.body; // status: 'ACCEPTED' or 'REJECTED'
    
    const request = await prisma.joinRequest.findUnique({
      where: { id: requestId },
      include: { room: true }
    });

    if (!request) throw new AppError('Request not found', 404);
    if (request.room.ownerId !== req.user!.id) throw new AppError('Unauthorized', 403);

    await prisma.joinRequest.update({
      where: { id: requestId },
      data: { status }
    });

    if (status === 'ACCEPTED') {
      await prisma.roomMember.upsert({
        where: { userId_roomId: { userId: request.userId, roomId: request.roomId } },
        create: { userId: request.userId, roomId: request.roomId },
        update: {}
      });
    }

    res.json({ success: true, message: `Request ${status.toLowerCase()}` });
  } catch (err) {
    next(err);
  }
};

export const deleteRoom = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const roomId = req.params.id;
    const userId = req.user!.id;

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new AppError('Room not found', 404);
    if (room.ownerId !== userId) throw new AppError('Unauthorized to delete this room', 403);

    await prisma.room.delete({ where: { id: roomId } });

    res.json({ success: true, message: 'Room deleted successfully' });
  } catch (err) {
    next(err);
  }
};


export const getOrCreateDirectRoom = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user!.id;

    if (targetUserId === currentUserId) {
      throw new AppError('Cannot create direct room with yourself', 400);
    }

    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) throw new AppError('User not found', 404);

    const existingRoom = await prisma.room.findFirst({
      where: {
        type: 'DIRECT',
        AND: [
          { members: { some: { userId: currentUserId } } },
          { members: { some: { userId: targetUserId } } }
        ]
      },
      include: {
        owner: { select: { id: true, username: true, avatar: true } },
        members: { include: { user: { select: { id: true, username: true, avatar: true } } } },
        _count: { select: { members: true, messages: true } },
      }
    });

    if (existingRoom) {
      return res.json({ success: true, room: existingRoom });
    }

    const newRoom = await prisma.room.create({
      data: {
        name: `DM-${currentUserId}-${targetUserId}`,
        type: 'DIRECT',
        ownerId: currentUserId,
        members: {
          create: [
            { userId: currentUserId },
            { userId: targetUserId }
          ]
        }
      },
      include: {
        owner: { select: { id: true, username: true, avatar: true } },
        members: { include: { user: { select: { id: true, username: true, avatar: true } } } },
        _count: { select: { members: true, messages: true } },
      }
    });

    res.status(201).json({ success: true, room: newRoom });
  } catch (err) {
    next(err);
  }
};


export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const currentUserId = req.user!.id;
    const search = (req.query.search as string) || '';

    const users = await prisma.user.findMany({
      where: {
        id: { not: currentUserId },
        ...(search
          ? {
              OR: [
                { username: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      select: { id: true, username: true, name: true, avatar: true },
      orderBy: { username: 'asc' },
      take: 50,
    });

    res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
};
