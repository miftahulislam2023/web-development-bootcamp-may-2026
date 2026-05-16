import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '@/utils/api-error';
import * as streamsService from '@/modules/streams/streams.service';

export async function startStream(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }

    const roomKey = req.params.roomKey as string;
    const session = await streamsService.startStream(roomKey, req.user.userId);

    res.status(StatusCodes.CREATED).json({ status: 'success', data: session });
  } catch (error) {
    next(error);
  }
}

export async function endStream(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }

    const roomKey = req.params.roomKey as string;
    const session = await streamsService.endStream(roomKey, req.user.userId);

    res.status(StatusCodes.OK).json({ status: 'success', data: session });
  } catch (error) {
    next(error);
  }
}

export async function getStreamHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }

    const roomKey = req.params.roomKey as string;
    const sessions = await streamsService.getStreamHistory(roomKey, req.user.userId);

    res.status(StatusCodes.OK).json({ status: 'success', data: sessions });
  } catch (error) {
    next(error);
  }
}

export async function getStreamSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }

    const roomKey = req.params.roomKey as string;
    const sessionId = Number(req.params.sessionId);
    const summary = await streamsService.getStreamSummary(roomKey, sessionId, req.user.userId);

    res.status(StatusCodes.OK).json({ status: 'success', data: summary });
  } catch (error) {
    next(error);
  }
}

export async function getAllStreamHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }

    const sessions = await streamsService.getAllStreamHistory(req.user.userId);

    res.status(StatusCodes.OK).json({ status: 'success', data: sessions });
  } catch (error) {
    next(error);
  }
}
