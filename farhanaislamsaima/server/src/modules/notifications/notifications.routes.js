import express from 'express';
import { registerNotificationToken } from './notifications.controller.js';

const router = express.Router();

router.post('/token', registerNotificationToken);

export default router;
