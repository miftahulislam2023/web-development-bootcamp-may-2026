
import express from "express";

const router = express.Router();

import { listFiles, toggleFileAccess, deleteFile, renameFile, getShareFile, searchFiles } from "../controllers/fileController.js";

import { authenticateToken } from "../middleware/jwt.js";

router.get("/get-all", authenticateToken, listFiles);
router.get("/search", authenticateToken, searchFiles);
router.patch("/toggle-access/:fileId", authenticateToken, toggleFileAccess);
router.patch("/rename/:fileId", authenticateToken, renameFile);
router.delete("/delete/:fileId", authenticateToken, deleteFile);

router.get("/share/:id", getShareFile);

export default router;