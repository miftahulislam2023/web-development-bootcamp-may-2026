// schemas/transaction.schema.ts
import { z } from "zod";
import { PAYMENT_METHOD, RECURRENCE_FREQUENCY, TRANSACTION_TYPE } from "@/types";

// ─── Transaction Schema ───────────────────────────────────────────────────────
export const transactionSchema = z.object({
  type: z.enum([TRANSACTION_TYPE.INCOME, TRANSACTION_TYPE.EXPENSE], {
    message: "Please select a type.",
  }),
  categoryId: z.string().min(1, { message: "Category is required." }),
  amount: z
    .number({ message: "Amount must be a number." })
    .positive({ message: "Amount must be greater than 0." }),
  date: z.string().min(1, { message: "Date is required." }),
  paymentMethod: z.enum(
    [
      PAYMENT_METHOD.CASH,
      PAYMENT_METHOD.CARD,
      PAYMENT_METHOD.BANK_TRANSFER,
      PAYMENT_METHOD.MOBILE_BANKING,
      PAYMENT_METHOD.OTHER,
    ]
  ).optional(),
  description: z.string().max(500).optional(),
  tags: z.string().optional(),
  referenceNote: z.string().max(200).optional(),
  isRecurring: z.boolean().default(false).optional(),
  recurring: z.object({
    frequency: z
      .enum([
        RECURRENCE_FREQUENCY.DAILY,
        RECURRENCE_FREQUENCY.WEEKLY,
        RECURRENCE_FREQUENCY.MONTHLY,
        RECURRENCE_FREQUENCY.YEARLY,
      ])
      .optional(),
    interval: z.number().min(1).max(365).default(1).optional(),
    nextDueDate: z.string().optional(),
    endDate: z.string().optional(),
  }).optional(),
});

// Separate refined schema for conditional validation
export const transactionSchemaRefined = transactionSchema.superRefine((data, ctx) => {
  // Only validate recurring fields if isRecurring is true
  if (data.isRecurring === true) {
    if (!data.recurring?.frequency) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Frequency is required for recurring transactions.",
        path: ["recurring", "frequency"],
      });
    }
    if (!data.recurring?.nextDueDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Next due date is required for recurring transactions.",
        path: ["recurring", "nextDueDate"],
      });
    }
  }
});

export type TransactionFormValues = z.infer<typeof transactionSchemaRefined>;

// ─── Standalone Recurring Schema ─────────────────────────────────────────────
export const recurringSchema = z.object({
  categoryId: z.string().min(1, { message: "Category is required." }),
  type: z.enum([TRANSACTION_TYPE.INCOME, TRANSACTION_TYPE.EXPENSE], {
    message: "Please select a type.",
  }),
  amount: z
    .number({ message: "Amount must be a number." })
    .positive({ message: "Amount must be greater than 0." }),
  paymentMethod: z.enum(
    [
      PAYMENT_METHOD.CASH,
      PAYMENT_METHOD.CARD,
      PAYMENT_METHOD.BANK_TRANSFER,
      PAYMENT_METHOD.MOBILE_BANKING,
      PAYMENT_METHOD.OTHER,
    ]
  ).optional(),
  description: z.string().max(500).optional(),
  frequency: z.enum(
    [
      RECURRENCE_FREQUENCY.DAILY,
      RECURRENCE_FREQUENCY.WEEKLY,
      RECURRENCE_FREQUENCY.MONTHLY,
      RECURRENCE_FREQUENCY.YEARLY,
    ],
    { message: "Please select a frequency." }
  ),
  interval: z.number().min(1).max(365).default(1).optional(),
  nextDueDate: z.string().min(1, { message: "Next due date is required." }),
  endDate: z.string().optional(),
  isActive: z.boolean().default(true).optional(),
});

export type RecurringFormValues = z.infer<typeof recurringSchema>;