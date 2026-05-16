import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import { createApp } from './src/app.js';
import { registerRealtimeHandlers } from './src/modules/realtime/realtime.service.js';
import { startCache } from './src/shared/cache.js';
import prisma from './src/shared/db.js';

const PORT = process.env.PORT || 4000;
process.env.DATABASE_URL = process.env.DATABASE_URL
  || 'postgresql://chatuser:chatpassword@localhost:5433/chatdb';

const { app, corsOrigins } = createApp();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: corsOrigins,
    methods: ['GET', 'POST']
  }
});

registerRealtimeHandlers(io);

Promise.all([
  prisma.$connect(),
  startCache()
])
  .then(() => {
    console.log('Connected to PostgreSQL');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('PostgreSQL connection error:', err);
  });
