import { z } from 'zod';
import {
  PAYMENT_METHOD,
  TRANSACTION_SORT_FIELDS,
  TRANSACTION_TYPE,
  TRANSACTION_VALIDATION,
} from './transaction.constants';

// ---------------------------------------------------------------------------
// Reusable field definitions
// MongoDB ID Schema
// ---------------------------------------------------------------------------
const mongoIdSchema = z
  .string({
    error: (issue) => (issue.input === undefined ? 'ID is required' : 'ID must be a string'),
  })
  .regex(/^[a-f\d]{24}$/i, {
    message: 'Invalid MongoDB ObjectId',
  });

// ---------------------------------------------------------------------------
// Amount Schema
// ---------------------------------------------------------------------------
const amountSchema = z
  .number({
    error: (issue) =>
      issue.input === undefined ? 'Amount is required' : 'Amount must be a number',
  })
  .min(TRANSACTION_VALIDATION.AMOUNT_MIN, {
    message: `Amount must be at least ${TRANSACTION_VALIDATION.AMOUNT_MIN}`,
  });

// ---------------------------------------------------------------------------
// Type Schema
// ---------------------------------------------------------------------------
const typeSchema = z.enum(Object.values(TRANSACTION_TYPE) as [string, ...string[]], {
  message: 'Type must be income or expense',
});

// ---------------------------------------------------------------------------
// Payment Method Schema
// ---------------------------------------------------------------------------
const paymentMethodSchema = z
  .enum(Object.values(PAYMENT_METHOD) as [string, ...string[]], {
    message: 'Invalid payment method',
  })
  .optional();

// ---------------------------------------------------------------------------
// Date Schema (ISO string or Date object)
// ---------------------------------------------------------------------------
export const dateSchema = z.coerce.date({
  error: (issue) =>
    issue.input === undefined ? 'Transaction date is required' : 'Invalid transaction date',
});

// ---------------------------------------------------------------------------
// Tags Schema
// ---------------------------------------------------------------------------
const tagsSchema = z
  .array(
    z
      .string({
        error: (issue) => (issue.input === undefined ? 'Tag is required' : 'Tag must be a string'),
      })
      .trim()
      .max(TRANSACTION_VALIDATION.TAG_MAX_LENGTH, {
        message: `Each tag cannot exceed ${TRANSACTION_VALIDATION.TAG_MAX_LENGTH} characters`,
      }),
  )
  .max(TRANSACTION_VALIDATION.TAGS_MAX_COUNT, {
    message: `Cannot have more than ${TRANSACTION_VALIDATION.TAGS_MAX_COUNT} tags`,
  })
  .optional();

// ---------------------------------------------------------------------------
// Create schema
// ---------------------------------------------------------------------------
const createTransactionSchema = z.object({
  categoryId: mongoIdSchema,
  type: typeSchema,
  amount: amountSchema,
  // currency: z.string().trim().length(3, 'Currency must be a 3-letter ISO code').optional(),
  description: z
    .string()
    .trim()
    .max(
      TRANSACTION_VALIDATION.DESCRIPTION_MAX_LENGTH,
      `Description cannot exceed ${TRANSACTION_VALIDATION.DESCRIPTION_MAX_LENGTH} characters`,
    )
    .optional()
    .nullable(),
  paymentMethod: paymentMethodSchema,
  tags: tagsSchema,
  date: dateSchema,
  referenceNote: z
    .string()
    .trim()
    .max(
      TRANSACTION_VALIDATION.REFERENCE_NOTE_MAX_LENGTH,
      `Reference note cannot exceed ${TRANSACTION_VALIDATION.REFERENCE_NOTE_MAX_LENGTH} characters`,
    )
    .optional()
    .nullable(),
});

// ---------------------------------------------------------------------------
// Update schema — all fields optional, at least one required (PATCH semantics)
// type and userId are intentionally excluded:
//   • type change would corrupt category ↔ type consistency
//   • userId re-assignment is a security concern
// ---------------------------------------------------------------------------
const updateTransactionSchema = z
  .object({
    categoryId: mongoIdSchema.optional(),
    amount: amountSchema.optional(),
    description: z
      .string()
      .trim()
      .max(TRANSACTION_VALIDATION.DESCRIPTION_MAX_LENGTH)
      .optional()
      .nullable(),
    paymentMethod: paymentMethodSchema,
    tags: tagsSchema,
    date: dateSchema.optional(),
    referenceNote: z
      .string()
      .trim()
      .max(TRANSACTION_VALIDATION.REFERENCE_NOTE_MAX_LENGTH)
      .optional()
      .nullable(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: 'At least one field must be provided for update',
  });

// ---------------------------------------------------------------------------
// List query schema — validates and coerces all search/filter/pagination params
// ---------------------------------------------------------------------------
const getTransactionsQuerySchema = z.object({
  type: z.enum(Object.values(TRANSACTION_TYPE) as [string, ...string[]]).optional(),
  categoryId: mongoIdSchema.optional(),
  paymentMethod: z.enum(Object.values(PAYMENT_METHOD) as [string, ...string[]]).optional(),

  // Date range — coerce string → Date
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),

  // Amount range
  minAmount: z.coerce.number().min(0).optional(),
  maxAmount: z.coerce.number().min(0).optional(),

  // Search string — matched against description + referenceNote via text index
  searchTerm: z.string().trim().max(100).optional(),

  // Pagination
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),

  // Sorting
  sort: z.enum(TRANSACTION_SORT_FIELDS).optional(),
});

// ---------------------------------------------------------------------------
// Params schema — shared by GET /:id and DELETE /:id
// ---------------------------------------------------------------------------
export const mongoIdParamSchema = z.object({
  id: mongoIdSchema,
});

export const transactionValidation = {
  createTransactionSchema,
  updateTransactionSchema,
  getTransactionsQuerySchema,
  mongoIdParamSchema,
};
