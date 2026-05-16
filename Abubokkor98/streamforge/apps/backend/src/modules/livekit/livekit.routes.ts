import { Router } from 'express';
import { optionalAuthenticate } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { livekitTokenSchema } from '@/modules/livekit/livekit.schema';
import * as livekitController from '@/modules/livekit/livekit.controller';

const router = Router();

const LIVEKIT_ROUTE_PATHS = {
  token: '/token',
  webhook: '/webhook',
} as const;

// optionalAuthenticate: sets req.user if JWT present, allows guests through
router.post(
  LIVEKIT_ROUTE_PATHS.token,
  optionalAuthenticate,
  validate(livekitTokenSchema),
  livekitController.getToken,
);

// webhook expects no standard auth, handled by WebhookReceiver inside controller
router.post(LIVEKIT_ROUTE_PATHS.webhook, livekitController.webhook);

export default router;
