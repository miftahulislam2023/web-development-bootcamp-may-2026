import { z } from "zod";

export const createExpenseValidation =
  z.object({

    expenseType: z.string(),

    title: z.string().min(2),

    amount: z.number(),

    note: z.string().optional(),

  });

  export const updateExpenseValidation =
  z.object({



    title:
      z.string()
        .min(2)
        .optional(),

    amount:
      z.number().optional(),

    note:
      z.string().optional(),

  });