// ai.routes.ts — /api/ai/* routes
import { Router } from "express";
import { handleAIEnhance } from "../handlers/index.js";

const router = Router();
router.post("/enhance", handleAIEnhance);

export default router;
