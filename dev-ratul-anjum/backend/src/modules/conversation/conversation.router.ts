import validateSchema from "$/middlewares/validateSchema.js";
import express from "express";
import conversationController from "./conversation.controller.js";
import { createConversationSchema } from "./conversation.schema.js";
import checkAuth from "$/middlewares/checkAuth.js";

const conversationRouter = express.Router();

// Create Any Conversation
conversationRouter.post(
  "/v1/create",
  checkAuth,
  validateSchema(createConversationSchema),
  conversationController.createConversation,
);

// Delete Any Conversation
conversationRouter.delete(
  "/v1/delete/:conversationId",
  checkAuth,
  conversationController.deleteConversation,
);

// Get All Conversations
conversationRouter.get(
  "/v1/all",
  checkAuth,
  conversationController.getConversations,
);

// Get Conversation Info
conversationRouter.get(
  "/v1/info/:conversationId",
  checkAuth,
  conversationController.getConversationInfo,
);

export default conversationRouter;
