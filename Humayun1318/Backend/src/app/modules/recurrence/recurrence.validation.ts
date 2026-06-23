import { z } from 'zod';
import {
  RECURRENCE_FREQUENCY,
  RECURRENCE_SORT_FIELDS,
  RECURRENCE_VALIDATION,
} from './recurrence.constants';
import { TRANSACTION_TYPE, PAYMENT_METHOD } from '../transaction/transaction.constants';
import { mongoIdSchema } from '../user/user.validation';
import { dateSchema } from '../transaction/transaction.validation';

// ---------------------------------------------------------------------------
// Reusable field schemas
// ---------------------------------------------------------------------------
// Frequency Schema
// ---------------------------------------------------------------------------
const frequencySchema = z.enum(Object.values(RECURRENCE_FREQUENCY), {
  message: 'Frequency must be daily, weekly, monthly, or yearly',
});

// ---------------------------------------------------------------------------
// Interval Schema
// ---------------------------------------------------------------------------
const intervalSchema = z
  .number({
    error: (issue) =>
      issue.input === undefined ? 'Interval is required' : 'Interval must be a number',
  })
  .int('Interval must be a whole number')
  .min(RECURRENCE_VALIDATION.INTERVAL_MIN)
  .max(RECURRENCE_VALIDATION.INTERVAL_MAX)
  .default(1);

// ---------------------------------------------------------------------------
// Amount Schema
// ---------------------------------------------------------------------------
const amountSchema = z
  .number({
    error: (issue) =>
      issue.input === undefined ? 'Amount is required' : 'Amount must be a number',
  })
  .min(RECURRENCE_VALIDATION.AMOUNT_MIN, {
    message: `Amount must be greater than ${RECURRENCE_VALIDATION.AMOUNT_MIN}`,
  });

// ---------------------------------------------------------------------------
// Description Schema
// ---------------------------------------------------------------------------
const descriptionSchema = z
  .string()
  .trim()
  .max(RECURRENCE_VALIDATION.DESCRIPTION_MAX_LENGTH)
  .optional()
  .nullable();

// Start Date (business rule enforced)
const startDateSchema = dateSchema.refine((d) => d >= new Date(new Date().setHours(0, 0, 0, 0)), {
  message: 'Start date cannot be in the past',
});

// ---------------------------------------------------------------------------
// Create Recurrence Schema
// ---------------------------------------------------------------------------
const createRecurrenceSchema = z
  .object({
    categoryId: mongoIdSchema,

    type: z.enum(Object.values(TRANSACTION_TYPE), {
      message: 'Type must be income or expense',
    }),

    amount: amountSchema,

    // currency: z
    //   .string()
    //   .trim()
    //   .length(3)
    //   .optional()
    //   .default('BDT'),

    description: descriptionSchema,

    paymentMethod: z.enum(Object.values(PAYMENT_METHOD) as [string, ...string[]]).optional(),

    frequency: frequencySchema,

    interval: intervalSchema,

    // First execution date (IMPORTANT)
    startDate: startDateSchema,

    endDate: dateSchema.optional().nullable(),
  })
  .refine((data) => !data.endDate || data.endDate > data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

// ---------------------------------------------------------------------------
// Update Recurrence Schema (PATCH semantics)
// ---------------------------------------------------------------------------
const updateRecurrenceSchema = z
  .object({
    amount: amountSchema.optional(),

    description: descriptionSchema,

    paymentMethod: z.enum(Object.values(PAYMENT_METHOD) as [string, ...string[]]).optional(),

    frequency: frequencySchema.optional(),

    interval: intervalSchema.optional(),

    // Allow manual override only if needed (advanced cases)
    startDate: dateSchema.optional(),

    endDate: dateSchema.optional().nullable(),

    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: 'At least one field must be provided for update',
  });

// ---------------------------------------------------------------------------
// Query Schema
// ---------------------------------------------------------------------------
const getRecurrencesQuerySchema = z.object({
  isActive: z
    .string()
    .transform((v) => v === 'true')
    .optional(),

  frequency: frequencySchema.optional(),
  searchTerm: z.string().trim().max(100).optional(),

  page: z.coerce.number().int().min(1).optional(),
  // Sorting
  sort: z.enum(RECURRENCE_SORT_FIELDS).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------
export const recurrenceValidation = {
  createRecurrenceSchema,
  updateRecurrenceSchema,
  getRecurrencesQuerySchema,
};
