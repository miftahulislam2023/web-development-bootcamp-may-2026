import type { Request, Response } from 'express';
import { recurrenceService } from './recurrence.service';
import catchAsync from '../../utils/catchAsync';
import { getUserIdFromReq } from '../../utils/getUserIdFromReq';
import { sendResponse } from '../../utils/sendResponse';
import { HTTP_STATUS } from '../../utils/HTTP_STATUS_CODE';

// ─────────────────────────────────────────────────────────────────────────────
// createRecurrence
// POST /api/v1/recurrences
// ─────────────────────────────────────────────────────────────────────────────
const createRecurrence = catchAsync(async (req: Request, res: Response) => {
  const userId = getUserIdFromReq(req);

  const result = await recurrenceService.createRecurrence(userId, req.body);

  sendResponse(res, {
    statusCode: HTTP_STATUS.CREATED,
    success: true,
    message: 'Recurring rule created successfully',
    data: result,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getAllRecurrences
// GET /api/v1/recurrences
// ─────────────────────────────────────────────────────────────────────────────
const getAllRecurrences = catchAsync(async (req: Request, res: Response) => {
  const userId = getUserIdFromReq(req);

  // const query: IRecurrenceQuery = {
  //   isActive:
  //     req.query.isActive !== undefined
  //       ? req.query.isActive === 'true'
  //       : undefined,
  //   frequency: req.query.frequency as IRecurrenceQuery['frequency'],
  //   page: req.query.page ? Number(req.query.page) : undefined,
  //   limit: req.query.limit ? Number(req.query.limit) : undefined,
  // };

  const { data, meta } = await recurrenceService.getAllRecurrences(userId, req.query);

  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    success: true,
    message: 'Recurrences retrieved successfully',
    meta,
    data,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getRecurrenceById
// GET /api/v1/recurrences/:id
// ─────────────────────────────────────────────────────────────────────────────
const getRecurrenceById = catchAsync(async (req: Request, res: Response) => {
  const result = await recurrenceService.getRecurrenceById(req.params.id!, getUserIdFromReq(req));

  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    success: true,
    message: 'Recurrence retrieved successfully',
    data: result,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// updateRecurrence
// PATCH /api/v1/recurrences/:id
// ─────────────────────────────────────────────────────────────────────────────
const updateRecurrence = catchAsync(async (req: Request, res: Response) => {
  const result = await recurrenceService.updateRecurrence(
    req.params.id!,
    getUserIdFromReq(req),
    req.body,
  );

  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    success: true,
    message: 'Recurrence updated successfully',
    data: result,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// deleteRecurrence
// DELETE /api/v1/recurrences/:id
// ─────────────────────────────────────────────────────────────────────────────
const deleteRecurrence = catchAsync(async (req: Request, res: Response) => {
  await recurrenceService.deleteRecurrence(req.params.id!, getUserIdFromReq(req));

  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    success: true,
    message: 'Recurrence deleted successfully',
    data: null,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// triggerManually  — ADMIN ONLY
// POST /api/v1/recurrences/trigger
//
// Manually fires the cron logic without waiting for the scheduler.
// Useful for:
//   • Testing in development without waiting until midnight.
//   • Recovery after a server downtime window.
//   • Admin-panel "run now" button.
//
// This endpoint is protected by ADMIN role at the route level.
// ─────────────────────────────────────────────────────────────────────────────
const triggerManually = catchAsync(async (_req: Request, res: Response) => {
  const result = await recurrenceService.createTransactionsForDueRecurrences();

  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    success: true,
    message: `Cron triggered manually. Processed: ${result.processed}, Created: ${result.created}, Failed: ${result.failed}`,
    data: result,
  });
});

export const recurrenceController = {
  createRecurrence,
  getAllRecurrences,
  getRecurrenceById,
  updateRecurrence,
  deleteRecurrence,
  triggerManually,
};
