// src/Modules/Budgets/BudgetDTO.ts
import { z } from "zod";

export const createBudgetSchema = {
  body: z.object({
    name: z.string().min(1, "Name is required"),
    categoryId: z.string().uuid().optional(),
    limitAmount: z.number().positive("Amount must be positive"),
    currency: z.string().default("USD"),
    period: z.enum(["monthly", "yearly"]),
    alertThreshold: z.number().int().min(0).max(100).default(80),
  }),
};

export const updateBudgetSchema = {
  body: z.object({
    name: z.string().min(1).optional(),
    limitAmount: z.number().positive().optional(),
    alertThreshold: z.number().int().min(0).max(100).optional(),
  }),
};

export type CreateBudgetDTO = z.infer<typeof createBudgetSchema.body>;
export type UpdateBudgetDTO = z.infer<typeof updateBudgetSchema.body>;

