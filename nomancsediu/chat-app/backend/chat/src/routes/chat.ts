import express from 'express';
import { createNewChat, getAllChats, getMessagesByChat, sendMessage, deleteMessage, editMessage, reactToMessage, deleteChat } from '../controllers/chat.js';
import { isAuth } from '../middleware/isAuth.js';
import { upload } from '../middleware/multer.js';

const router = express.Router();

router.post('/chat/new', isAuth, createNewChat);
router.get('/chats/all', isAuth, getAllChats);
router.post("/message", isAuth, upload.single('image'), sendMessage);
router.get("/message/:chatId", isAuth, getMessagesByChat);
router.delete("/message/:messageId", isAuth, deleteMessage);
router.patch("/message/:messageId", isAuth, editMessage);
router.patch("/message/:messageId/react", isAuth, reactToMessage);
router.delete("/chat/:chatId", isAuth, deleteChat);

export default router;