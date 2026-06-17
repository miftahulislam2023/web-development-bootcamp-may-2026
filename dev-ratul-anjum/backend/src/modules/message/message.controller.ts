import { Request, Response } from "express";
import catchAsync from "$/utils/catchAsync.js";
import responseHandler from "$/utils/responseHandler.js";
import { ApiError } from "$/middlewares/errorHandler.js";
import messageService from "./message.service.js";
import { uploadMultipleToCloudinary } from "$/utils/fileUploader.js";
import { resolve } from "node:path";

const createMessage = catchAsync(async (req: Request, res: Response) => {
  const senderId = req.user?.id!;
  const files = req.files as Express.Multer.File[];
  let attachments: string[] = [];

  if (files?.length < 1 && !req.body.text) {
    throw new ApiError(400, "Text or attachments is required.");
  }

  if (files?.length > 0) {
    const resuljs = await uploadMultipleToCloudinary(files);
    const urls = resuljs.map((r) => r.secure_url);
    attachments = urls;
  }
  const newMessage = await messageService.createMessage(
    req.body,
    senderId,
    attachments,
  );
  return responseHandler(res, 201, {
    success: true,
    message: "Message created Successfully!",
    data: newMessage,
  });
});

const deleteMessage = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id!;
  const messageId = req.params.messageId;

  if (!messageId || typeof messageId !== "string") {
    throw new ApiError(400, "Required parameters not provided");
  }
  await messageService.deleteMessage(userId, messageId);
  return responseHandler(res, 200, {
    success: true,
    message: "Message deleted Successfully!",
  });
});

const getConversationMessages = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id!;
    const conversationId = req.params.conversationId;
    const { page } = req.query;
    const pageNumber = !isNaN(Number(page)) ? Number(page) : undefined;

    if (!conversationId || typeof conversationId !== "string") {
      throw new ApiError(400, "Required parameters not provided");
    }
    const data = await messageService.getConversationMessages(
      userId,
      conversationId,
      pageNumber,
    );
    return responseHandler(res, 200, {
      success: true,
      message: "Messages retrive Successfully!",
      data,
    });
  },
);

// Get Conversation Star Messages
const getConversationStarMessages = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id!;
    const conversationId = req.params.conversationId;
    const { page } = req.query;
    const pageNumber = !isNaN(Number(page)) ? Number(page) : undefined;

    if (!conversationId || typeof conversationId !== "string") {
      throw new ApiError(400, "Required parameters not provided");
    }
    const data = await messageService.getConversationStarMessages(
      userId,
      conversationId,
      pageNumber,
    );

    return responseHandler(res, 200, {
      success: true,
      message: "Conversation star messages retrive Successfully!",
      data,
    });
  },
);

// Get Conversation All Media
const getConversationMedia = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id!;
  const conversationId = req.params.conversationId;
  const { page } = req.query;
  const pageNumber = !isNaN(Number(page)) ? Number(page) : undefined;

  if (!conversationId || typeof conversationId !== "string") {
    throw new ApiError(400, "Required parameters not provided");
  }
  const data = await messageService.getConversationMedia(
    userId,
    conversationId,
    pageNumber,
  );

  return responseHandler(res, 200, {
    success: true,
    message: "Conversation media retrive Successfully!",
    data,
  });
});

const messageController = {
  createMessage,
  deleteMessage,
  getConversationMessages,
  getConversationStarMessages,
  getConversationMedia,
};

export default messageController;
