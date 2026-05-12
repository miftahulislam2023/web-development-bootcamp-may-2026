import { z } from "zod";

export const createBudgetSchema = {
  body: z.object({
    categoryId: z.string().uuid().optional(),
    name: z.string().min(1, "Budget name is required"),
    limitAmount: z.coerce.number().positive("Limit must be positive"),
    currency: z.string().default("USD"),
    period: z.enum(["monthly", "yearly"]),
    alertThreshold: z.coerce.number().int().min(0).max(100).default(80),
    startDate: z
      .string()
      .datetime()
      .or(z.string().refine((val) => !isNaN(Date.parse(val)))),
    endDate: z
      .string()
      .datetime()
      .or(z.string().refine((val) => !isNaN(Date.parse(val)))),
  }),
};

export type CreateBudgetDTO = z.infer<typeof createBudgetSchema.body>;
