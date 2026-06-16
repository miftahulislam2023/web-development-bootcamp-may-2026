import { z } from 'zod';

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;
const OTP_LENGTH = 6;
const DIGIT_REGEX = /\d/;
const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>]/;

const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, {
    error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
  })
  .max(PASSWORD_MAX_LENGTH, {
    error: `Password must not exceed ${PASSWORD_MAX_LENGTH} characters`,
  })
  .regex(DIGIT_REGEX, { error: 'Password must contain at least one number' })
  .regex(SPECIAL_CHAR_REGEX, {
    error: 'Password must contain at least one special character',
  });

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, { error: 'Name is required' }),
    email: z.email({ error: 'Please provide a valid email address' }),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.email({ error: 'Please provide a valid email address' }),
  password: z.string().min(1, { error: 'Password is required' }),
});

export const forgotPasswordSchema = z.object({
  email: z.email({ error: 'Please provide a valid email address' }),
});

export const verifyOtpSchema = z.object({
  email: z.email({ error: 'Please provide a valid email address' }),
  otp: z
    .string()
    .length(OTP_LENGTH, { error: `OTP must be exactly ${OTP_LENGTH} digits` })
    .regex(/^\d+$/, { error: 'OTP must contain only numbers' }),
});

export const resetPasswordSchema = z
  .object({
    resetToken: z.string().min(1, { error: 'Reset token is required' }),
    newPassword: passwordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    error: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
