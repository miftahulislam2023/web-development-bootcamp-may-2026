import { z } from "zod";

export const createBudgetValidation =
  z.object({

    amount: z.number(),

    month: z.number(),

    year: z.number(),

  });