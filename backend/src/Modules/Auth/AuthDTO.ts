// src/Modules/Auth/AuthDTO.ts
import { z } from "zod";

export const createUserSchema = {
  body: z.object({
    email: z.string().email("Invalid email address"),
    firstName: z.string().min(2, "First name is too short"),
    lastName: z.string().min(2, "Last name is too short"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    username: z.string().optional(),
  }),
};

export const loginSchema = {
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
};

export const refreshTokenSchema = {
  cookies: z.object({
    refreshToken: z.string().optional(),
  }),
};

export const updateProfileSchema = {
  body: z.object({
    firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional(),
    displayName: z.string().optional(),
    bio: z.string().max(500).optional(),
  }),
};

// Extract the inferred TypeScript types for the validated bodies
export type CreateUserDTO = z.infer<typeof createUserSchema.body>;
export type LoginDTO = z.infer<typeof loginSchema.body>;
export type UpdateProfileDTO = z.infer<typeof updateProfileSchema.body>;

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  accessToken: string;
}
