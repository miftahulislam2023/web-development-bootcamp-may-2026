import { Router } from 'express';
import { ChatController } from './chat.controller';
import { ChatValidation } from './chat.validation';
import { validateRequest } from '../../middlewares/validateRequest';
import { authorize } from '../../middlewares/authorize';
import { authenticate } from '../../middlewares/authenticate';
import { uploadFile } from '../../middlewares/upload';

const router = Router();
router.use(authenticate);
router.use(authorize("USER"));

// Get user's conversation list
router.get('/conversations', ChatController.getUserConversations);

// Get or create conversation with another user
router.post( '/conversations', validateRequest(ChatValidation.getOrCreateConversation), ChatController.getOrCreateConversation);

// Get single conversation with messages
router.get('/conversations/:id', validateRequest(ChatValidation.getConversation), ChatController.getConversation);

// Send message
router.post('/messages', uploadFile.single("file"), validateRequest(ChatValidation.sendMessage), ChatController.sendMessage);

// Delete conversation
router.delete('/conversations/:conversationId', validateRequest(ChatValidation.deleteConversation), ChatController.deleteConversation);

export const ChatRoutes = router;
