import { z } from "zod";

export const createTransactionSchema = {
  body: z.object({
    accountId: z.string().uuid().optional(),
    categoryId: z.string().uuid().optional(),
    name: z.string().optional(),
    paymentMethod: z.enum(["cash", "card", "bank_transfer", "wallet"]),
    type: z.enum(["income", "expense", "transfer"]),
    amount: z.coerce.number().positive("Amount must be positive"),
    currency: z.string().default("USD"),
    date: z
      .string()
      .datetime()
      .or(z.string().refine((val) => !isNaN(Date.parse(val)))),
    notes: z.string().optional(),
  }),
};

export const listTransactionsSchema = {
  query: z.object({
    page: z.string().default("1").transform(Number),
    limit: z.string().default("20").transform(Number),
    type: z.enum(["income", "expense", "transfer"]).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
};

export type CreateTransactionDTO = z.infer<typeof createTransactionSchema.body>;
export type ListTransactionsQuery = z.infer<
  typeof listTransactionsSchema.query
>;
