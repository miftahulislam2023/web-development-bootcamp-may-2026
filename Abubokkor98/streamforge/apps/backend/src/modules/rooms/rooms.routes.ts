import { Router } from 'express';
import { authenticate } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { createRoomSchema, updateRoomSchema, roomKeyParam } from '@/modules/rooms/rooms.schema';
import * as roomsController from '@/modules/rooms/rooms.controller';

const router = Router();

const ROOMS_ROUTE_PATHS = {
  root: '/',
  live: '/live',
  recent: '/recent',
  mine: '/mine',
  byKey: '/:roomKey',
} as const;

router.post(
  ROOMS_ROUTE_PATHS.root,
  authenticate,
  validate(createRoomSchema),
  roomsController.createRoom,
);

// Public endpoints — must be before :roomKey wildcard
router.get(ROOMS_ROUTE_PATHS.live, roomsController.getLiveRooms);
router.get(ROOMS_ROUTE_PATHS.recent, roomsController.getRecentRooms);

router.get(ROOMS_ROUTE_PATHS.mine, authenticate, roomsController.getMyRooms);

router.get(
  ROOMS_ROUTE_PATHS.byKey,
  validate(roomKeyParam, 'params'),
  roomsController.findRoomByKey,
);

router.patch(
  ROOMS_ROUTE_PATHS.byKey,
  authenticate,
  validate(roomKeyParam, 'params'),
  validate(updateRoomSchema),
  roomsController.updateRoom,
);

router.delete(
  ROOMS_ROUTE_PATHS.byKey,
  authenticate,
  validate(roomKeyParam, 'params'),
  roomsController.deleteRoom,
);

export default router;
