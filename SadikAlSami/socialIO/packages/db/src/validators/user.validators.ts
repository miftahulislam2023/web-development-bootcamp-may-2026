import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod';

import { user } from '../schema/auth';

// Shared field constraints for auth tables.
export const USER_NAME_MAX = 80;
export const USER_EMAIL_MAX = 320;
export const USER_IMAGE_URL_MAX = 2048;
export const USER_IMAGE_PUBLIC_ID_MAX = 256;

const userFieldOverrides = {
	name: (schema: z.ZodString) => schema.min(1).max(USER_NAME_MAX),
	email: (schema: z.ZodString) => schema.max(USER_EMAIL_MAX),
	imageUrl: (schema: z.ZodString) => schema.max(USER_IMAGE_URL_MAX),
	imagePublicId: (schema: z.ZodString) => schema.max(USER_IMAGE_PUBLIC_ID_MAX),
};

export const userSelectSchema = createSelectSchema(user, userFieldOverrides);
export const userInsertSchema = createInsertSchema(user, userFieldOverrides);
export const userUpdateSchema = createUpdateSchema(user, userFieldOverrides);

export const publicUser = userSelectSchema.omit({ imagePublicId: true });

export type UserSelect = z.infer<typeof userSelectSchema>;
export type UserInsert = z.infer<typeof userInsertSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;

export type PublicUser = z.infer<typeof publicUser>;
