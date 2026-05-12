import { z } from "zod";

export const createExpenseTypeValidation =
  z.object({

    name: z.string().min(2),

  });