import { Router } from 'express';
import {
  getRooms,
  getMyRooms,
  getRoomById,
  createRoom,
  joinRoom,
  leaveRoom,
  getRoomRequests,
  respondToJoinRequest,
  deleteRoom,
  getOrCreateDirectRoom,
  getUsers,
} from '../controllers/room.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/users', getUsers);
router.get('/', getRooms);
router.get('/my', getMyRooms);
router.get('/:id', getRoomById);
router.get('/:id/requests', getRoomRequests);
router.post('/', createRoom);
router.post('/direct/:userId', getOrCreateDirectRoom);
router.post('/:id/join', joinRoom);
router.post('/requests/respond', respondToJoinRequest);
router.delete('/:id/leave', leaveRoom);
router.delete('/:id', deleteRoom);

export default router;
