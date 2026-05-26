// admin.controller.ts
import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const { search } = req.query;
  const options = {
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
  };

  const result = await AdminService.getAllUsers(
    search as string | undefined,
    options
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

export const suspendUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const result = await AdminService.suspendUser(userId as string,);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User suspended successfully",
    data: result,
  });
});

export const unsuspendUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const result = await AdminService.unsuspendUser(userId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User unsuspended successfully",
    data: result,
  });
});

export const getStats = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getStats();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Stats retrieved successfully",
    data: result,
  });
});

export const getConversations = catchAsync(async (req: Request, res: Response) => {
  const options = {
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
  };

  const result = await AdminService.getConversations(options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Conversations retrieved successfully",
    data: result,
  });
});

export const deleteConversation = catchAsync(async (req: Request, res: Response) => {
  const { conversationId } = req.params;

  const result = await AdminService.deleteConversation(conversationId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: result,
  });
});