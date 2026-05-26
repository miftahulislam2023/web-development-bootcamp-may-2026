import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { ChatService } from "./chat.service";
import { getIO } from "../../../lib/socket";
import ApiError from "../../../utils/apiErrors";
import { uploadToCloudinary } from "../../../utils/uploadToCloudinary";

const getConversation = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

const options = {
  page: Number(req.query.page) || 1,
  limit: Number(req.query.limit) || 20,
  sortOrder: (req.query.sortOrder as string) || "asc",
};

  const conversation = await ChatService.getConversation(
    id as string,
    req.user!.id,
    options,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Conversation fetched successfully",
    data: conversation,
  });
});

const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const { conversationId, content } = req.body;
  const file = req.file;

  if (!content && !file) {
    throw new ApiError(400, "Message must have content or file");
  }

  let fileData;

  if (file) {
    const isImage = file.mimetype.startsWith("image/");
    const resourceType = isImage ? "image" : "raw";

    const uploadResult = await uploadToCloudinary(
      file.buffer,
      "chat-uploads",
      resourceType
    );

    fileData = {
      fileUrl: uploadResult.secure_url,
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
    };
  }

  const newMessage = await ChatService.createMessage(
    conversationId,
    req.user!.id,
    content,
    fileData
  );

  const io = getIO();
  io.to(conversationId).emit("receive_message", newMessage);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Message sent successfully",
    data: newMessage,
  });
});

const getOrCreateConversation = catchAsync(
  async (req: Request, res: Response) => {

    const { otherUserId  } = req.body;

    const conversation = await ChatService.getOrCreateConversation([
      req.user!.id,
      otherUserId,
    ]);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Conversation ready",
      data: conversation,
    });
  },
);

const deleteConversation = catchAsync(async (req: Request, res: Response) => {
  const { conversationId } = req.params;

  const result = await ChatService.deleteConversation(
    conversationId as string,
    req.user!.id,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: null,
  });
});

const getUserConversations = catchAsync(
  async (req: Request, res: Response) => {
    const conversations = await ChatService.getUserConversations(
      req.user!.id,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Conversations fetched successfully",
      data: conversations,
    });
  },
);

export const ChatController = {
  getConversation,
  sendMessage,
  getOrCreateConversation,
  deleteConversation,
  getUserConversations,
};