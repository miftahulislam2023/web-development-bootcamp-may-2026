import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import authRoutes from './modules/auth/auth.routes.js';
import conversationRoutes from './modules/conversations/conversations.routes.js';
import messageRoutes from './modules/messages/messages.routes.js';
import notificationRoutes from './modules/notifications/notifications.routes.js';
import uploadRoutes from './modules/uploads/uploads.routes.js';
import userRoutes from './modules/users/users.routes.js';
import { requireAuth } from './shared/auth.middleware.js';

function createApp() {
  const app = express();
  const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
  const CLIENT_URLS = CLIENT_URL
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean);
  const corsOptions = {
    origin(origin, callback) {
      if (!origin || CLIENT_URLS.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  };

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests. Please try again later.' }
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 40,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many login attempts. Please try again later.' }
  });

  app.use(cors(corsOptions));
  app.use(express.json({ limit: '1mb' }));
  app.use('/api', apiLimiter);
  app.use('/api/auth', authLimiter, authRoutes);
  app.use('/api/conversations', requireAuth, conversationRoutes);
  app.use('/api/messages', requireAuth, messageRoutes);
  app.use('/api/notifications', requireAuth, notificationRoutes);
  app.use('/api/uploads', requireAuth, uploadRoutes);
  app.use('/api/users', requireAuth, userRoutes);

  app.get('/', (req, res) => {
    res.send('Chat server is running');
  });

  return {
    app,
    corsOrigins: CLIENT_URLS
  };
}

export {
  createApp
};
