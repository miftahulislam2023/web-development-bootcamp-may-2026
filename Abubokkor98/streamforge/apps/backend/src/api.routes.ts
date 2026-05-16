import { Router } from 'express';
import authRoutes from '@/modules/auth/auth.routes';
import roomsRoutes from '@/modules/rooms/rooms.routes';
import livekitRoutes from '@/modules/livekit/livekit.routes';
import streamsRoutes from '@/modules/streams/streams.routes';

const apiRouter = Router();

const API_ROUTE_PATHS = {
  auth: '/auth',
  rooms: '/rooms',
  livekit: '/livekit',
  streams: '/streams',
} as const;

apiRouter.use(API_ROUTE_PATHS.auth, authRoutes);
apiRouter.use(API_ROUTE_PATHS.rooms, roomsRoutes);
apiRouter.use(API_ROUTE_PATHS.livekit, livekitRoutes);
apiRouter.use(API_ROUTE_PATHS.streams, streamsRoutes);

export default apiRouter;

