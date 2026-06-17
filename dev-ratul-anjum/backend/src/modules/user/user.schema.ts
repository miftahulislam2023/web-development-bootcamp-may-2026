import z from "zod";

export const registerUserSchema = z.object({
  name: z.string("Name is required.").trim().nonempty("Name cannot be empty."),
  email: z
    .string("Email is required.")
    .trim()
    .nonempty("Email cannot be empty."),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
});

export const updateUserProfileSchema = z.object({
  name: z.string().trim().optional(),
  bio: z.string().trim().optional(),
});

export type TRegisterUserSchema = z.infer<typeof registerUserSchema>;
export type TUpdateUserProfileSchema = z.infer<typeof updateUserProfileSchema>;
