import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '@/utils/api-error';
import * as roomsService from '@/modules/rooms/rooms.service';
import type {
  CreateRoomSchemaInput,
  UpdateRoomSchemaInput,
} from '@/modules/rooms/rooms.schema';

export async function createRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }

    const body = req.body as CreateRoomSchemaInput;
    const room = await roomsService.createRoom(req.user.userId, body);

    res.status(StatusCodes.CREATED).json({ status: 'success', data: room });
  } catch (error) {
    next(error);
  }
}

export async function getMyRooms(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }

    const rooms = await roomsService.getHostRooms(req.user.userId);

    res.status(StatusCodes.OK).json({ status: 'success', data: rooms });
  } catch (error) {
    next(error);
  }
}

export async function findRoomByKey(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const roomKey = req.params.roomKey as string;
    const room = await roomsService.findRoomByKey(roomKey);

    res.status(StatusCodes.OK).json({ status: 'success', data: room });
  } catch (error) {
    next(error);
  }
}

export async function updateRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }

    const body = req.body as UpdateRoomSchemaInput;
    const roomKey = req.params.roomKey as string;
    const room = await roomsService.updateRoom(roomKey, req.user.userId, body);

    res.status(StatusCodes.OK).json({ status: 'success', data: room });
  } catch (error) {
    next(error);
  }
}

export async function deleteRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }

    const roomKey = req.params.roomKey as string;
    await roomsService.deleteRoom(roomKey, req.user.userId);

    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
}

export async function getLiveRooms(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rooms = await roomsService.getLiveRooms();

    res.status(StatusCodes.OK).json({ status: 'success', data: rooms });
  } catch (error) {
    next(error);
  }
}

export async function getRecentRooms(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rooms = await roomsService.getRecentRooms();

    res.status(StatusCodes.OK).json({ status: 'success', data: rooms });
  } catch (error) {
    next(error);
  }
}
