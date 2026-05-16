import express from 'express';
import {
  createConversation,
  getConversations,
  getUsers,
  leaveConversation
} from './conversations.controller.js';

const router = express.Router();

router.get('/', getConversations);
router.post('/', createConversation);
router.get('/users', getUsers);
router.patch('/:id/leave', leaveConversation);

export default router;
