import { Router } from 'express';
import { getMessages, markRead } from '../controllers/message.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/:roomId', getMessages);
router.post('/:messageId/read', markRead);

export default router;
