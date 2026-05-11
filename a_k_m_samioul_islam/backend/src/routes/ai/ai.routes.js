import express from "express";
import { verifyFirebaseToken } from "../../middlewares/auth/auth.middleware.js";
import { loadDbUser } from "../../middlewares/dbuser/dbuser.middleware.js";
import { getRecommendation } from "../../controllers/ai/ai.controller.js";

const router=express.Router();

router.get("/ai", verifyFirebaseToken, loadDbUser, getRecommendation);

export default router;