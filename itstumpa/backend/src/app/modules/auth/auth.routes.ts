// src/app/modules/auth/auth.routes.ts
import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { validateRequest } from '../../middlewares/validateRequest';
import * as authController from './auth.controller';
import { changePasswordSchema, forgotPasswordSchema, signinSchema, signupSchema } from './auth.validation';

const router = Router();

// ── Public ─────────────────────────────────────────────────────────────────
router.post('/signup', validateRequest(signupSchema), authController.signup);
router.get('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendEmailVerification);
router.post('/signin', validateRequest(signinSchema), authController.signin);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.requestPasswordReset);
router.post('/verify-reset-code', authController.verifyResetCode);
router.post('/reset-password', validateRequest(forgotPasswordSchema), authController.resetPasswordController);

// ── Protected ───────────────────────────────────────────────────────────────
router.use(authenticate);
router.get('/me', authController.getMe);
router.post('/logout', authController.logout);
router.post('/change-password', validateRequest(changePasswordSchema), authController.changePasswordController);

export const authRoute = router;
