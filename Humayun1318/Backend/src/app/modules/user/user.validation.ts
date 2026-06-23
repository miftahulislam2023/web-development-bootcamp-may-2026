import { z } from 'zod';
import {
  SUPPORTED_CURRENCIES,
  SUPPORTED_TIMEZONES,
  UserStatus,
  USER_VALIDATION,
  UserRole,
} from './user.constants';

// ---------------------------------------------------------------------------
// Reusable field definitions
// ---------------------------------------------------------------------------

export const nameSchema = z
  .string({
    error: (issue) => (issue.input === undefined ? 'Name is required' : 'Name must be a string'),
  })
  .trim()
  .min(USER_VALIDATION.NAME_MIN_LENGTH, {
    message: `Name must be at least ${USER_VALIDATION.NAME_MIN_LENGTH} characters`,
  })
  .max(USER_VALIDATION.NAME_MAX_LENGTH, {
    message: `Name cannot exceed ${USER_VALIDATION.NAME_MAX_LENGTH} characters`,
  });

// ---------------------------------------------------------------------------
// Email Schema
// ---------------------------------------------------------------------------
export const emailSchema = z
  .string({
    error: (issue) => (issue.input === undefined ? 'Email is required' : 'Email must be a string'),
  })
  .trim()
  .superRefine((val, ctx) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(val)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Invalid email format',
      });
    }
  })
  .transform((val) => val.toLowerCase());

// ---------------------------------------------------------------------------
// Password Schema
// ---------------------------------------------------------------------------
export const passwordSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined ? 'Password is required' : 'Password must be a string',
  })
  .min(USER_VALIDATION.PASSWORD_MIN_LENGTH, {
    message: `Password must be at least ${USER_VALIDATION.PASSWORD_MIN_LENGTH} characters`,
  })
  .max(USER_VALIDATION.PASSWORD_MAX_LENGTH, {
    message: `Password cannot exceed ${USER_VALIDATION.PASSWORD_MAX_LENGTH} characters`,
  })
  .refine((val) => /[a-z]/.test(val), {
    message: 'Password must contain at least one lowercase letter',
  })
  .refine((val) => /[A-Z]/.test(val), {
    message: 'Password must contain at least one uppercase letter',
  })
  .refine((val) => /\d/.test(val), {
    message: 'Password must contain at least one number',
  });

// ---------------------------------------------------------------------------
// Currency Schema
// ---------------------------------------------------------------------------
export const currencySchema = z
  .enum(SUPPORTED_CURRENCIES, {
    message: 'Unsupported currency code',
  })
  .optional();

// ---------------------------------------------------------------------------
// Timezone Schema
// ---------------------------------------------------------------------------
export const timezoneSchema = z
  .enum(SUPPORTED_TIMEZONES, {
    message: 'Unsupported timezone',
  })
  .optional();

// ---------------------------------------------------------------------------
// MongoDB ID Schema
// ---------------------------------------------------------------------------
export const mongoIdSchema = z
  .string({
    error: (issue) => (issue.input === undefined ? 'ID is required' : 'ID must be a string'),
  })
  .regex(/^[a-f\d]{24}$/i, {
    message: 'Invalid MongoDB ObjectId',
  });

// ---------------------------------------------------------------------------
// Register Schema
// ---------------------------------------------------------------------------
export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  currency: currencySchema,
  timezone: timezoneSchema,
  role: z.enum(Object.values(UserRole) as [string, ...string[]]).optional(),
});

// ---------------------------------------------------------------------------
// Update Profile Schema
// ---------------------------------------------------------------------------
export const updateProfileSchema = z
  .object({
    name: nameSchema.optional(),

    avatarUrl: z
      .string({
        error: (issue) =>
          issue.input === undefined ? 'Avatar URL must be a string' : 'Avatar URL must be a string',
      })
      .trim()
      .min(1, {
        message: 'Avatar URL cannot be empty',
      })
      .refine((val) => val === '' || /^https?:\/\/\S+$/.test(val), {
        message: 'avatarUrl must be a valid URL',
      })
      .max(USER_VALIDATION.AVATAR_URL_MAX_LENGTH, {
        message: 'Avatar URL is too long',
      })
      .optional()
      .nullable(),

    currency: currencySchema,

    timezone: timezoneSchema,
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'At least one field must be provided for update',
  });

// ---------------------------------------------------------------------------
// Change Password Schema
// ---------------------------------------------------------------------------
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? 'Current password is required'
            : 'Current password must be a string',
      })
      .min(1, {
        message: 'Current password is required',
      }),

    newPassword: passwordSchema,
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from the current password',
    path: ['newPassword'],
  });

// ---------------------------------------------------------------------------
// Update User Status Schema
// ---------------------------------------------------------------------------
export const updateUserStatusSchema = z.object({
  status: z.enum([...Object.values(UserStatus)], {
    message: 'Status must be active, suspended, or deleted',
  }),
});

export const userValidation = {
  registerSchema,
  updateProfileSchema,
  changePasswordSchema,
  updateUserStatusSchema,
};
