import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(80),
    email: z.string().email("Valid email required"),
    password: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "At least 8 characters"),
});

export const seoSchema = z.object({
  metaTitle: z.string().max(70).optional().nullable(),
  metaDescription: z.string().max(320).optional().nullable(),
  ogImage: z
    .string()
    .optional()
    .nullable()
    .refine((v) => !v || v === "" || /^https?:\/\//.test(v), "Must be a valid URL"),
});

export const pageUpdateSchema = z.object({
  title: z.string().min(1).max(120),
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
});

export const projectCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  description: z.string().max(500).optional().nullable(),
});

