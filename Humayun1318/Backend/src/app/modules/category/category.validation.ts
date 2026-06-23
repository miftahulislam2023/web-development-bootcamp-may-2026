import { z } from 'zod';
import {
  CATEGORY_ICON,
  CATEGORY_SORT_FIELDS,
  CATEGORY_TYPE,
  CATEGORY_VALIDATION,
} from './category.constants';

// ---------------------------------------------------------------------------
// Reusable field schemas
// Category Name Schema
// ---------------------------------------------------------------------------
export const nameSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined ? 'Category name is required' : 'Category name must be a string',
  })
  .trim()
  .min(CATEGORY_VALIDATION.NAME_MIN_LENGTH, {
    message: `Name must be at least ${CATEGORY_VALIDATION.NAME_MIN_LENGTH} characters`,
  })
  .max(CATEGORY_VALIDATION.NAME_MAX_LENGTH, {
    message: `Name cannot exceed ${CATEGORY_VALIDATION.NAME_MAX_LENGTH} characters`,
  });

// ---------------------------------------------------------------------------
// Category Type Schema
// ---------------------------------------------------------------------------
export const typeSchema = z.enum(Object.values(CATEGORY_TYPE), {
  message: 'Type must be income or expense',
});

// ---------------------------------------------------------------------------
// Category Icon Schema
// ---------------------------------------------------------------------------
export const iconSchema = z
  .enum(Object.values(CATEGORY_ICON), {
    message: 'Invalid category icon',
  })
  .optional();

// ---------------------------------------------------------------------------
// Color Hex Schema
// ---------------------------------------------------------------------------
export const colorHexSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined ? 'Color hex must be a string' : 'Color hex must be a string',
  })
  .trim()
  .regex(CATEGORY_VALIDATION.COLOR_HEX_REGEX, {
    message: 'colorHex must be a valid hex colour (#RGB or #RRGGBB)',
  })
  .optional()
  .nullable();

// ---------------------------------------------------------------------------
// Create schema — type is required; icon and color are optional.
// ---------------------------------------------------------------------------
const createCategorySchema = z.object({
  name: nameSchema,
  type: typeSchema,
  icon: iconSchema,
  colorHex: colorHexSchema,
});

// ---------------------------------------------------------------------------
// Update schema — every field is optional (PATCH semantics).
// type is intentionally excluded: changing a category's type mid-life would
// ---------------------------------------------------------------------------
const updateCategorySchema = z
  .object({
    name: nameSchema.optional(),
    icon: iconSchema,
    colorHex: colorHexSchema,
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: 'At least one field must be provided for update',
  });

// ---------------------------------------------------------------------------
// Query schema — validates and coerces URL search parameters.
// ---------------------------------------------------------------------------
const getCategoriesQuerySchema = z.object({
  type: z.enum(Object.values(CATEGORY_TYPE) as [string, ...string[]]).optional(),
  isActive: z
    .string()
    .transform((v) => v === 'true')
    .optional(),
  includeSystem: z
    .string()
    .transform((v) => v === 'true')
    .optional(),
  page: z
    .string()
    .transform(Number)
    .refine((n) => n > 0, 'page must be a positive integer')
    .optional(),
  limit: z
    .string()
    .transform(Number)
    .refine((n) => n > 0, 'limit must be a positive integer')
    .optional(),
  searchTerm: z.string().trim().max(100).optional(),
  // Sorting
  sort: z.enum(CATEGORY_SORT_FIELDS).optional(),
});

export const categoryValidation = {
  createCategorySchema,
  updateCategorySchema,
  getCategoriesQuerySchema,
};
