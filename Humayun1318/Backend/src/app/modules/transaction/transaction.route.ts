import { Router } from 'express';
import { UserRole } from '../user/user.constants';
import { transactionController } from './transaction.controller';
import { mongoIdParamSchema, transactionValidation } from './transaction.validation';
import { authenticate } from '../../middlewares/authenticate';
import { validateRequest } from '../../middlewares/validateRequest';
import { validateQuery } from '../../middlewares/validateQuery';
import { validateParams } from '../../middlewares/validateParams';

const router = Router();

// ---------------------------------------------------------------------------
// IMPORTANT: This route MUST be declared before /:id to prevent Express from
// interpreting "summary" as a MongoDB ObjectId param.
// ---------------------------------------------------------------------------
router.get(
  '/summary',
  authenticate(UserRole.USER, UserRole.ADMIN),
  transactionController.getTransactionSummary,
);

// ---------------------------------------------------------------------------
// POST /api/v1/transactions - creates a new transaction for the authenticated user.
// ---------------------------------------------------------------------------
router.post(
  '/',
  authenticate(UserRole.USER, UserRole.ADMIN),
  validateRequest(transactionValidation.createTransactionSchema),
  transactionController.createTransaction,
);

// ---------------------------------------------------------------------------
// GET /api/v1/transactions- gets all transactions for the authenticated user, with optional filters.
// ---------------------------------------------------------------------------
router.get(
  '/',
  authenticate(UserRole.USER, UserRole.ADMIN),
  validateQuery(transactionValidation.getTransactionsQuerySchema),
  transactionController.getAllTransactions,
);

// ---------------------------------------------------------------------------
// GET /api/v1/transactions/:id
// ---------------------------------------------------------------------------
router.get(
  '/:id',
  authenticate(UserRole.USER, UserRole.ADMIN),
  validateParams(mongoIdParamSchema),
  transactionController.getTransactionById,
);

// ---------------------------------------------------------------------------
// PATCH /api/v1/transactions/:id
// ---------------------------------------------------------------------------
router.patch(
  '/:id',
  authenticate(UserRole.USER, UserRole.ADMIN),
  validateRequest(transactionValidation.updateTransactionSchema),
  transactionController.updateTransaction,
);

// ---------------------------------------------------------------------------
// DELETE /api/v1/transactions/:id
// ---------------------------------------------------------------------------
router.delete(
  '/:id',
  authenticate(UserRole.USER, UserRole.ADMIN),
  validateParams(mongoIdParamSchema),
  transactionController.deleteTransaction,
);

export const transactionRoutes = router;
