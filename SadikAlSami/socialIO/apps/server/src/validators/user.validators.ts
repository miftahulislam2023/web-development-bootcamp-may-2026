import { z } from "zod";

import { publicUser, userUpdateSchema } from "@socialIO/db/validators/user.validators";

export const publicUserResponseSchema = publicUser;

export const updateUserBodySchema = userUpdateSchema
	.pick({ name: true })
	.superRefine((data, ctx) => {
		if (!data.name) {
			ctx.addIssue({
				code: "custom",
				message: "name is required",
				path: ["name"],
			});
		}
	});

export const updateUserImageBodySchema = userUpdateSchema
	.pick({ imageUrl: true, imagePublicId: true })
	.superRefine((data, ctx) => {
		if (!data.imageUrl) {
			ctx.addIssue({
				code: "custom",
				message: "imageUrl is required",
				path: ["imageUrl"],
			});
		}

		if (!data.imagePublicId) {
			ctx.addIssue({
				code: "custom",
				message: "imagePublicId is required",
				path: ["imagePublicId"],
			});
		}
	});

export type PublicUserResponse = z.infer<typeof publicUserResponseSchema>;
export type UpdateUserBody = z.infer<typeof updateUserBodySchema>;
export type UpdateUserImageBody = z.infer<typeof updateUserImageBodySchema>;
