import express from "express"
import { createNewChat, getAllChats, getMessagesByChatId, sendMessage } from "../controllers/chatController.js";
import upload from "../middlewares/multer.js";
import { isAuth } from "../middlewares/isAuth.js";


const router = express.Router();

router.post("/new", isAuth, createNewChat);
router.get("/all", isAuth, getAllChats);
router.post("/message", isAuth, upload.single("image"), sendMessage);
router.get("/messages/:chatId", isAuth, getMessagesByChatId);


export default router;