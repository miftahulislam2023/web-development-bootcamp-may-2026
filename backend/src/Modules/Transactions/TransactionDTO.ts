// src/Modules/Transactions/TransactionDTO.ts
import { z } from "zod";

export const createTransactionSchema = {
  body: z.object({
    type: z.enum(["income", "expense", "transfer"]),
    amount: z.number().positive("Amount must be positive"),
    currency: z.string().default("USD"),
    date: z
      .string()
      .or(z.date())
      .transform((d) => new Date(d)),
    categoryId: z.string().uuid().optional(),
    accountId: z.string().uuid().optional(),
    notes: z.string().max(500).optional(),
  }),
};

export const updateTransactionSchema = {
  body: z.object({
    type: z.enum(["income", "expense", "transfer"]).optional(),
    amount: z.number().positive().optional(),
    date: z.string().or(z.date()).optional(),
    notes: z.string().max(500).optional(),
  }),
};

export type CreateTransactionDTO = z.infer<typeof createTransactionSchema.body>;
export type UpdateTransactionDTO = z.infer<typeof updateTransactionSchema.body>;
