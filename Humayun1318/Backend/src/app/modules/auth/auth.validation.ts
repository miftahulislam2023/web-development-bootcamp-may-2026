import z from 'zod';
import { emailSchema, passwordSchema } from '../user/user.validation';

// ---------------------------------------------------------------------------
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export const setPasswordSchema = z.object({
  password: passwordSchema,
});

export const authValidation = {
  loginSchema,
  setPasswordSchema,
};
