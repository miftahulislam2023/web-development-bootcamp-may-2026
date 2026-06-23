import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { UserRole } from '../user/user.constants';
import { recurrenceController } from './recurrence.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { recurrenceValidation } from './recurrence.validation';
import { validateParams } from '../../middlewares/validateParams';
import { mongoIdParamSchema } from '../transaction/transaction.validation';
import { validateQuery } from '../../middlewares/validateQuery';

const router = Router();

// ---------------------------------------------------------------------------
// POST /api/v1/recurrences/trigger  — ADMIN ONLY,
// Manually fires the cron logic
// ---------------------------------------------------------------------------
router.post('/trigger', authenticate(UserRole.ADMIN), recurrenceController.triggerManually);

// ---------------------------------------------------------------------------
// POST /api/v1/recurrences
// ---------------------------------------------------------------------------
router.post(
  '/',
  authenticate(UserRole.USER, UserRole.ADMIN),
  validateRequest(recurrenceValidation.createRecurrenceSchema),
  recurrenceController.createRecurrence,
);

// ---------------------------------------------------------------------------
// GET /api/v1/recurrences
// ---------------------------------------------------------------------------
router.get(
  '/',
  authenticate(UserRole.USER, UserRole.ADMIN),
  validateQuery(recurrenceValidation.getRecurrencesQuerySchema),
  recurrenceController.getAllRecurrences,
);

// ---------------------------------------------------------------------------
// GET /api/v1/recurrences/:id
// ---------------------------------------------------------------------------
router.get(
  '/:id',
  authenticate(UserRole.USER, UserRole.ADMIN),
  validateParams(mongoIdParamSchema),
  recurrenceController.getRecurrenceById,
);

// ---------------------------------------------------------------------------
// PATCH /api/v1/recurrences/:id
// ---------------------------------------------------------------------------
router.patch(
  '/:id',
  authenticate(UserRole.USER, UserRole.ADMIN),
  validateRequest(recurrenceValidation.updateRecurrenceSchema),
  recurrenceController.updateRecurrence,
);

// ---------------------------------------------------------------------------
// DELETE /api/v1/recurrences/:id
// ---------------------------------------------------------------------------
router.delete(
  '/:id',
  authenticate(UserRole.USER, UserRole.ADMIN),
  validateParams(mongoIdParamSchema),
  recurrenceController.deleteRecurrence,
);

export const recurrenceRoutes = router;
