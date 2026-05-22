import { z } from "zod/v3";

export const createTransactionSchema = z.object({
  amount: z.coerce
    .number()
    .positive({ message: "Amount must be greater than 0" }),
  description: z.string().optional(),
  category_name: z.string().min(1, { message: "Category name is required" }),
  type: z.enum(["income", "expense"]),
  date: z.coerce.date({ message: "Please enter the datetime" }),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, { message: "Category name is required" })
    .max(32, { message: "Category name is too long" }),
  type: z.enum(["income", "expense"]),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
