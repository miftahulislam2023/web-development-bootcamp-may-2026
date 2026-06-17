import validateSchema from "$/middlewares/validateSchema.js";
import express from "express";
import { registerUserSchema, updateUserProfileSchema } from "./user.schema.js";
import userController from "./user.controller.js";
import { uploader } from "$/utils/fileUploader.js";
import checkAuth from "$/middlewares/checkAuth.js";

const userRouter = express.Router();

// Upload user avatar
userRouter.post(
  "/v1/upload-avatar",
  uploader(
    ["image/png", "image/jpeg", "image/jpg"],
    100 * 1024,
    "Only JPG, JPEG, and PNG image files are allowed.",
  ).single("photo"),
  userController.uploadUserAvatar,
);

// Get user profile 
userRouter.get(
  "/v1/profile",
  checkAuth,
  userController.getProfile,
);

userRouter.get(
  "/v1/chats/available-users",
  checkAuth,
  userController.getUsersForAddNewChat,
);

// Update User Profile
userRouter.patch(
  "/v1/update-profile",
  checkAuth,
  uploader(
    ["image/png", "image/jpeg", "image/jpg"],
    100 * 1024,
    "Only JPG, JPEG, and PNG image files are allowed.",
  ).single("photo"),
  validateSchema(updateUserProfileSchema),
  userController.updateUserProfile,
);

// Block User
userRouter.post("/v1/block/:blockedId", checkAuth, userController.blockUser);

// Unblock User
userRouter.delete(
  "/v1/unblock/:blockedId",
  checkAuth,
  userController.unblockUser,
);

// Check Block User
userRouter.get(
  "/v1/check-block/:blockedId",
  checkAuth,
  userController.checkBlockUser,
);

// Report User
userRouter.post(
  "/v1/report/:reportedUserId",
  checkAuth,
  userController.reportUser,
);
export default userRouter;
