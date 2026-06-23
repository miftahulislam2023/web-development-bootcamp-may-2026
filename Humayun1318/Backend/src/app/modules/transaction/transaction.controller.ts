import type { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { getUserIdFromReq } from '../../utils/getUserIdFromReq';
import { transactionService } from './transaction.service';
import { sendResponse } from '../../utils/sendResponse';
import { HTTP_STATUS } from '../../utils/HTTP_STATUS_CODE';

// ─────────────────────────────────────────────────────────────────────────────
// createTransaction
// ─────────────────────────────────────────────────────────────────────────────
const createTransaction = catchAsync(async (req: Request, res: Response) => {
  const userId = getUserIdFromReq(req);

  const result = await transactionService.createTransaction(userId, req.body);

  sendResponse(res, {
    statusCode: HTTP_STATUS.CREATED,
    success: true,
    message: 'Transaction created successfully',
    data: result,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Supports rich filtering:
//   ?type=expense&categoryId=...&startDate=2024-01-01&endDate=2024-01-31
//   &minAmount=100&maxAmount=5000&searchTerm=coffee
//   &page=1&limit=20&sort=date&sort= date,amount
// ─────────────────────────────────────────────────────────────────────────────
const getAllTransactions = catchAsync(async (req: Request, res: Response) => {
  const userId = getUserIdFromReq(req);

  // Zod has already validated and coerced all query params at middleware level.
  // We cast here for TypeScript satisfaction only.
  // const query: ITransactionQuery = {
  //   type: req.query.type as ITransactionQuery['type'],
  //   categoryId: req.query.categoryId as string | undefined,
  //   paymentMethod: req.query.paymentMethod as ITransactionQuery['paymentMethod'],
  //   startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
  //   endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
  //   minAmount: req.query.minAmount ? Number(req.query.minAmount) : undefined,
  //   maxAmount: req.query.maxAmount ? Number(req.query.maxAmount) : undefined,
  //   searchTerm: req.query.searchTerm as string | undefined,
  //   page: req.query.page ? Number(req.query.page) : undefined,
  //   limit: req.query.limit ? Number(req.query.limit) : undefined,
  //   sort: req.query.sort as string | undefined,
  // };

  // console.log('Received getAllTransactions request with query:', query);

  const { data, meta } = await transactionService.getAllTransactions(userId, req.query);

  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    success: true,
    message: 'Transactions retrieved successfully',
    data,
    meta,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getTransactionById
// ─────────────────────────────────────────────────────────────────────────────
const getTransactionById = catchAsync(async (req: Request, res: Response) => {
  const userId = getUserIdFromReq(req);
  const { id } = req.params;

  const result = await transactionService.getTransactionById(id!, userId);

  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    success: true,
    message: 'Transaction retrieved successfully',
    data: result,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// updateTransaction
// ─────────────────────────────────────────────────────────────────────────────
const updateTransaction = catchAsync(async (req: Request, res: Response) => {
  const userId = getUserIdFromReq(req);
  const { id } = req.params;

  const result = await transactionService.updateTransaction(id!, userId, req.body);

  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    success: true,
    message: 'Transaction updated successfully',
    data: result,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// deleteTransaction
// ─────────────────────────────────────────────────────────────────────────────
const deleteTransaction = catchAsync(async (req: Request, res: Response) => {
  const userId = getUserIdFromReq(req);
  const { id } = req.params;

  await transactionService.deleteTransaction(id!, userId);

  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    success: true,
    message: 'Transaction deleted successfully',
    data: null,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getTransactionSummary
// Returns aggregated income / expense / balance for the given date range.
// Intentionally separated from the list endpoint so the dashboard can fetch
// just the numbers without any document payload.
// ─────────────────────────────────────────────────────────────────────────────
const getTransactionSummary = catchAsync(async (req: Request, res: Response) => {
  const userId = getUserIdFromReq(req);

  const toDate = req.query.toDate ? new Date(req.query.toDate as string) : undefined;

  const result = await transactionService.getTransactionSummary(userId, toDate);

  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    success: true,
    message: 'Transaction summary retrieved successfully',
    data: result,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────
export const transactionController = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
};
