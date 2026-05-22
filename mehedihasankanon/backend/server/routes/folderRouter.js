import express from "express";

import { listFolders, createFolder, renameFolder, deleteFolder } from "../controllers/folderController.js";
import { authenticateToken } from "../middleware/jwt.js";

const router = express.Router();

router.get("/get-all", authenticateToken, listFolders);
router.post("/create", authenticateToken, createFolder);
router.patch("/rename/:folderId", authenticateToken, renameFolder);
router.delete("/delete/:folderId", authenticateToken, deleteFolder);

export default router;
