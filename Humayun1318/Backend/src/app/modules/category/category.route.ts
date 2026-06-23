import { Router } from 'express';
import { UserRole } from '../user/user.constants';
import { categoryController } from './category.controller';
import { categoryValidation } from './category.validation';
import { authenticate } from '../../middlewares/authenticate';
import { validateRequest } from '../../middlewares/validateRequest';
import { validateQuery } from '../../middlewares/validateQuery';
import { validateParams } from '../../middlewares/validateParams';
import { mongoIdParamSchema } from '../transaction/transaction.validation';

const router = Router();

// ---------------------------------------------------------------------------
// Any authenticated user can create their own custom category.
// ---------------------------------------------------------------------------
router.post(
  '/',
  authenticate(UserRole.USER, UserRole.ADMIN),
  validateRequest(categoryValidation.createCategorySchema),
  categoryController.createCategory,
);

// ---------------------------------------------------------------------------
// Returns the user's own categories + system categories (default).
// ---------------------------------------------------------------------------
router.get(
  '/',
  authenticate(UserRole.USER, UserRole.ADMIN),
  validateQuery(categoryValidation.getCategoriesQuerySchema),
  categoryController.getAllCategories,
);

// ---------------------------------------------------------------------------
// GET /api/v1/categories/:id
// ---------------------------------------------------------------------------
router.get(
  '/:id',
  authenticate(UserRole.USER, UserRole.ADMIN),
  validateParams(mongoIdParamSchema),
  categoryController.getCategoryById,
);

// ---------------------------------------------------------------------------
// PATCH /api/v1/categories/:id
// Only the owner can update; system categories are rejected at service level.
// ---------------------------------------------------------------------------
router.patch(
  '/:id',
  authenticate(UserRole.USER, UserRole.ADMIN),
  validateRequest(categoryValidation.updateCategorySchema),
  categoryController.updateCategory,
);

// ---------------------------------------------------------------------------
// DELETE /api/v1/categories/:id
// Soft-delete — sets isActive = false; never removes the document.
// ---------------------------------------------------------------------------
router.delete(
  '/:id',
  authenticate(UserRole.USER, UserRole.ADMIN),
  validateParams(mongoIdParamSchema),
  categoryController.deleteCategory,
);

export const categoryRoutes = router;
