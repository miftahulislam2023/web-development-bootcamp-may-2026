import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';
import { authController } from './auth.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import passport from 'passport';
import { authValidation } from './auth.validation';
import { UserRole } from '../user/user.constants';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();
// ─────────────────────────────────────────────
// Authentication routes
// ─────────────────────────────────────────────
router.post('/login', validateRequest(authValidation.loginSchema), authController.createAuth);
router.post('/refresh-token', authController.getNewAccessTokenUsingRefreshToken);
router.post('/logout', authController.logout);

router.post(
  '/set-password',
  authenticate(UserRole.USER, UserRole.ADMIN),
  validateRequest(authValidation.setPasswordSchema),
  authController.setPassword,
);

// ─────────────────────────────────────────────
// Google OAuth routes
// ─────────────────────────────────────────────
router.get('/google', async (req: Request, res: Response, next: NextFunction) => {
  const redirect = req.query.redirect || '/';
  const role = req.query.role || UserRole.USER; // default to USER if role is not provided
  const state = JSON.stringify({
    redirect,
    role,
  });
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state,
  })(req, res, next);
});

router.get('/google/callback', authController.googleCallbackController);
//________________________________________________________

export const authRoutes = router;
