import { z } from 'zod';

import {
	profileSelectSchema,
	profileUpdateSchema,
	profileInsertSchema,
} from '@socialIO/db/validators/profile.validators';

// Profile response schema
export const profileResponseSchema = profileSelectSchema;

// Profile request validation schemas
export const createProfileBodySchema = profileInsertSchema.omit({ id: true });
export const updateProfileBodySchema = profileUpdateSchema
	.pick({ displayName: true, bio: true })
	.superRefine((data, ctx) => {
		if (!data.displayName && !data.bio) {
			ctx.addIssue({
				code: 'custom',
				message: 'displayName or bio is required',
				path: ['displayName'],
			});
		}
	});
export const updateProfileAvatarBodySchema = profileUpdateSchema.pick({ avatarUrl: true }).superRefine((data, ctx) => {
	if (!data.avatarUrl) {
		ctx.addIssue({
			code: 'custom',
			message: 'avatarUrl is required',
			path: ['avatarUrl'],
		});
	}
});

// Profile request types
export type CreateProfileBody = z.infer<typeof createProfileBodySchema>;
export type UpdateProfileBody = z.infer<typeof updateProfileBodySchema>;
export type UpdateProfileAvatarBody = z.infer<typeof updateProfileAvatarBodySchema>;

// Profile response type
export type ProfileResponse = z.infer<typeof profileResponseSchema>;
