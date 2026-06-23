import type { Request, Response } from 'express';
import { userService } from './user.service';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { HTTP_STATUS } from '../../utils/HTTP_STATUS_CODE';
import { setAuthCookie } from '../../utils/setAuthCookie';
import { getUserIdFromReq } from '../../utils/getUserIdFromReq';

// ─────────────────────────────────────────────
// Register
// ─────────────────────────────────────────────
const register = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.register(req.body);

  // Set auth tokens in HTTP-only cookies
  setAuthCookie(res, result.tokens);

  sendResponse(res, {
    statusCode: HTTP_STATUS.CREATED,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

// ─────────────────────────────────────────────
// Get My Profile
// ─────────────────────────────────────────────
const getMe = catchAsync(async (req: Request, res: Response) => {
  const userId = getUserIdFromReq(req);
  const result = await userService.getMe(userId);

  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    success: true,
    message: 'Profile retrieved successfully',
    data: result,
  });
});

// ─────────────────────────────────────────────
// Update Profile
// ─────────────────────────────────────────────
const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = getUserIdFromReq(req);
  const result = await userService.updateProfile(userId, req.body);

  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});

// ─────────────────────────────────────────────
// Change Password
// ─────────────────────────────────────────────
const changePassword = catchAsync(async (req: Request, res: Response) => {
  await userService.changePassword(getUserIdFromReq(req), req.body);

  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    success: true,
    message: 'Password changed successfully',
    data: null,
  });
});

// ─────────────────────────────────────────────
// Delete Own Account
// ─────────────────────────────────────────────
const deleteOwnAccount = catchAsync(async (req: Request, res: Response) => {
  await userService.deleteOwnAccount(getUserIdFromReq(req), req.body.password);

  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    success: true,
    message: 'Account deleted successfully',
    data: null,
  });
});

// ─────────────────────────────────────────────
// Admin: Get All Users
// ─────────────────────────────────────────────
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const { data, meta } = await userService.getAllUsers(req.query);

  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    success: true,
    message: 'Users retrieved successfully',
    data: data,
    meta,
  });
});

// ─────────────────────────────────────────────
// Admin: Get User By ID
// ─────────────────────────────────────────────
const getUserById = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getUserById(req.params.id!);

  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

// ─────────────────────────────────────────────
// Admin: Update User Status
// ─────────────────────────────────────────────
const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.updateUserStatus(req.params.id!, req.body.status);

  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    success: true,
    message: 'User status updated successfully',
    data: result,
  });
});

// ─────────────────────────────────────────────
// Admin: Get Analytics
// ─────────────────────────────────────────────
const getAnalytics = catchAsync(async (_req: Request, res: Response) => {
  const analytics = await userService.getAnalytics();

  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    success: true,
    message: 'Analytics retrieved successfully',
    data: analytics,
  });
});

// ─────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────
export const userController = {
  register,
  getMe,
  updateProfile,
  changePassword,
  deleteOwnAccount,
  getAllUsers,
  getUserById,
  updateUserStatus,
  getAnalytics,
};
