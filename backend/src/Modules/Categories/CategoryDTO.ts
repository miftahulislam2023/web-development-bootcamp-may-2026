import { z } from "zod";

export const createCategorySchema = {
  body: z.object({
    name: z.string().min(1, "Category name is required"),
    type: z.enum(["income", "expense", "transfer"]),
    icon: z.string().optional(),
    color: z.string().optional(),
  }),
};

export const listCategoriesSchema = {
  query: z.object({
    type: z.enum(["income", "expense", "transfer"]).optional(),
  }),
};

export type CreateCategoryDTO = z.infer<typeof createCategorySchema.body>;
export type ListCategoriesQuery = z.infer<typeof listCategoriesSchema.query>;
