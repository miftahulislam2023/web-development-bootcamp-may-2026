// src/Modules/Categories/CategoryDTO.ts
import { z } from "zod";

export const createCategorySchema = {
  body: z.object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(["income", "expense", "transfer"]),
    icon: z.string().optional(),
    color: z.string().optional(),
  }),
};

export type CreateCategoryDTO = z.infer<typeof createCategorySchema.body>;

