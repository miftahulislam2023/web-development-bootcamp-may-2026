import { Router } from 'express';
import { authenticate } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { roomKeyParam, sessionDetailParam } from '@/modules/streams/streams.schema';
import * as streamsController from '@/modules/streams/streams.controller';

const router = Router();

const STREAMS_ROUTE_PATHS = {
  myHistory: '/my-history',
  start: '/:roomKey/start',
  end: '/:roomKey/end',
  history: '/:roomKey/history',
  summary: '/:roomKey/summary/:sessionId',
} as const;

// Static routes MUST be registered before parameterized /:roomKey routes
router.get(
  STREAMS_ROUTE_PATHS.myHistory,
  authenticate,
  streamsController.getAllStreamHistory,
);

router.post(
  STREAMS_ROUTE_PATHS.start,
  authenticate,
  validate(roomKeyParam, 'params'),
  streamsController.startStream,
);

router.post(
  STREAMS_ROUTE_PATHS.end,
  authenticate,
  validate(roomKeyParam, 'params'),
  streamsController.endStream,
);

router.get(
  STREAMS_ROUTE_PATHS.history,
  authenticate,
  validate(roomKeyParam, 'params'),
  streamsController.getStreamHistory,
);

router.get(
  STREAMS_ROUTE_PATHS.summary,
  authenticate,
  validate(sessionDetailParam, 'params'),
  streamsController.getStreamSummary,
);

export default router;
