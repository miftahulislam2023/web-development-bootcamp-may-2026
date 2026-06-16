import app from '@/server';
import http from 'http';
import { initSocketServer } from '@/socket/socket-server';
import { logger } from '@/utils/logger';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize Socket.IO with typed events, auth middleware, and modular handlers
initSocketServer(server);

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
