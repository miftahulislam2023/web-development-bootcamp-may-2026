// src/Modules/Auth/AuthDTO.ts
import { z } from "zod";

export const createUserSchema = {
  body: z.object({
    email: z.string().email("Invalid email address"),
    firstName: z.string().min(2, "First name is too short"),
    lastName: z.string().min(2, "Last name is too short"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    // You can make optional fields available too based on your Prisma schema
    username: z.string().optional(),
  }),
};

export const updateUserSchema = {
  body: z.object({
    firstName: z.string().min(2, "First name is too short").optional(),
    lastName: z.string().min(2, "Last name is too short").optional(),
    currency: z.string().min(1, "Currency is required").optional(),
    monthlyIncome: z.coerce.number().nonnegative().optional(),
  }),
};

// Extract the inferred TypeScript type for the validated body
export type CreateUserDTO = z.infer<typeof createUserSchema.body>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema.body>;
