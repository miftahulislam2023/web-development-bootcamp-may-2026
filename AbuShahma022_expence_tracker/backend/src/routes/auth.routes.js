import express from "express";

import { registerUser, loginUser,logoutUser, getCurrentUser,updateUser,sendOTP , verifyOTP,resetPassword} from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post(
  "/logout",
  authMiddleware,
  logoutUser
);

router.get(
  "/current_user",
  authMiddleware,
  getCurrentUser
);


router.patch(
  "/update-profile",
  authMiddleware,
  updateUser
);

router.post(
  "/send-otp",
  sendOTP
);

router.post(
  "/verify-otp",
  verifyOTP
);

router.post(
  "/reset-password",
  resetPassword
);

export default router;