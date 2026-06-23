import type { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { categoryService } from './category.service';
import type { ICategoryQuery } from './category.interface';
import { sendResponse } from '../../utils/sendResponse';
import { getUserIdFromReq } from '../../utils/getUserIdFromReq';
import { HTTP_STATUS } from '../../utils/HTTP_STATUS_CODE';

// ─────────────────────────────────────────────────────────────────────────────
// createCategory
// ─────────────────────────────────────────────────────────────────────────────
const createCategory = catchAsync(async (req: Request, res: Response) => {
  const userId = getUserIdFromReq(req);

  const result = await categoryService.createCategory(userId, req.body);

  sendResponse(res, {
    statusCode: HTTP_STATUS.CREATED,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getAllCategories
// GET /api/v1/categories
// ─────────────────────────────────────────────────────────────────────────────
const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const userId = getUserIdFromReq(req);
  const query = req.query as unknown as ICategoryQuery;

  const { data, meta } = await categoryService.getAllCategories(userId, query);

  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    success: true,
    message: 'Categories retrieved successfully',
    data,
    meta,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getCategoryById
// GET /api/v1/categories/:id
// ─────────────────────────────────────────────────────────────────────────────
const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const userId = getUserIdFromReq(req);
  const { id } = req.params;

  const result = await categoryService.getCategoryById(id!, userId);

  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    success: true,
    message: 'Category retrieved successfully',
    data: result,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// updateCategory
// PATCH /api/v1/categories/:id
// ─────────────────────────────────────────────────────────────────────────────
const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const userId = getUserIdFromReq(req);
  const { id } = req.params;

  const result = await categoryService.updateCategory(id!, userId, req.body);

  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    success: true,
    message: 'Category updated successfully',
    data: result,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// deleteCategory
// DELETE /api/v1/categories/:id
// ─────────────────────────────────────────────────────────────────────────────
const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const userId = getUserIdFromReq(req);
  const { id } = req.params;

  await categoryService.deleteCategory(id!, userId);

  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    success: true,
    message: 'Category deleted successfully',
    data: null,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Export — named object keeps import sites readable and consistent across
// all modules (userController, categoryController, transactionController …).
// ─────────────────────────────────────────────────────────────────────────────
export const categoryController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
