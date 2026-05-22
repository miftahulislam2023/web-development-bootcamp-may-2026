import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

import { userProfile } from "../schema/profile";

// Shared field constraints for user profiles.
export const PROFILE_DISPLAY_NAME_MIN = 1;
export const PROFILE_DISPLAY_NAME_MAX = 80;
export const PROFILE_BIO_MAX = 280;
export const PROFILE_AVATAR_URL_MAX = 2048;

const profileFieldOverrides = {
	displayName: (schema: z.ZodString) =>
		schema.min(PROFILE_DISPLAY_NAME_MIN).max(PROFILE_DISPLAY_NAME_MAX),
	avatarUrl: (schema: z.ZodString) => schema.max(PROFILE_AVATAR_URL_MAX),
	bio: (schema: z.ZodString) => schema.max(PROFILE_BIO_MAX),
};

export const profileSelectSchema = createSelectSchema(userProfile, profileFieldOverrides);
export const profileInsertSchema = createInsertSchema(userProfile, profileFieldOverrides);
export const profileUpdateSchema = createUpdateSchema(userProfile, profileFieldOverrides);

export type ProfileSelect = z.infer<typeof profileSelectSchema>;
export type ProfileInsert = z.infer<typeof profileInsertSchema>;
export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;
