// admin.routes.ts
import { Router } from 'express';
import * as AdminController from './admin.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { getAllUsersSchema, suspendUserSchema, unsuspendUserSchema, getConversationsSchema, deleteConversationSchema } from './admin.validation';
import { authorize } from '../../middlewares/authorize';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get('/users', validateRequest(getAllUsersSchema), AdminController.getAllUsers);

router.post('/users/:userId/suspend', validateRequest(suspendUserSchema), AdminController.suspendUser);

router.post('/users/:userId/unsuspend', validateRequest(unsuspendUserSchema), AdminController.unsuspendUser);

router.get('/stats', AdminController.getStats);

router.get('/conversations', validateRequest(getConversationsSchema), AdminController.getConversations);

router.delete('/conversations/:conversationId', validateRequest(deleteConversationSchema), AdminController.deleteConversation);

export const AdminRoutes = router;
