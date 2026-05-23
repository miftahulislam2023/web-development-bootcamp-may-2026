import { z } from "zod";

export const createSavingsGoalSchema = {
  body: z.object({
    name: z.string().min(1, "Goal name is required"),
    targetAmount: z.coerce.number().positive("Target amount must be positive"),
    currentAmount: z.coerce.number().nonnegative().default(0),
    currency: z.string().default("USD"),
    deadline: z
      .string()
      .datetime()
      .or(z.string().refine((val) => !isNaN(Date.parse(val)))),
  }),
};

export type CreateSavingsGoalDTO = z.infer<typeof createSavingsGoalSchema.body>;
