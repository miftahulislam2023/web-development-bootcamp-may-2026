import express from "express";

const router = express.Router();

import { register, login, forgotPassword, changePassword, resetPassword, getProfile } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/jwt.js"


router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/change-password", authenticateToken, changePassword);
router.post("/reset-password", resetPassword);
router.get("/profile", authenticateToken, getProfile);


export default router;