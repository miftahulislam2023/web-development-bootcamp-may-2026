import { Router } from 'express';
import { userController } from './user.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { userValidation } from './user.validation';
import { authenticate } from '../../middlewares/authenticate';
import { UserRole } from './user.constants';

const router = Router();

// ─────────────────────────────────────────────
// Public Routes
// ─────────────────────────────────────────────
router.post('/register', validateRequest(userValidation.registerSchema), userController.register);

// ─────────────────────────────────────────────
// User (Authenticated)
// ─────────────────────────────────────────────
router.get('/me', authenticate(UserRole.USER, UserRole.ADMIN), userController.getMe);

router.patch(
  '/update-profile',
  authenticate(UserRole.USER, UserRole.ADMIN),
  validateRequest(userValidation.updateProfileSchema),
  userController.updateProfile,
);

router.patch(
  '/change-password',
  authenticate(UserRole.USER, UserRole.ADMIN),
  validateRequest(userValidation.changePasswordSchema),
  userController.changePassword,
);

router.delete(
  '/delete-account',
  authenticate(UserRole.USER, UserRole.ADMIN),
  userController.deleteOwnAccount,
);

// ─────────────────────────────────────────────
// Admin Routes
// ─────────────────────────────────────────────
router.get('/analytics', authenticate(UserRole.ADMIN), userController.getAnalytics);

router.get('/', authenticate(UserRole.ADMIN), userController.getAllUsers);

router.get('/:id', authenticate(UserRole.ADMIN), userController.getUserById);

router.patch(
  '/:id/status',
  authenticate(UserRole.ADMIN),
  validateRequest(userValidation.updateUserStatusSchema),
  userController.updateUserStatus,
);

// ─────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────
export const userRoutes = router;
