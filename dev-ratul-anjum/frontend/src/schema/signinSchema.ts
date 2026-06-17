import z from "zod";

export const signinSchema = z.object({
  email: z
    .string("Email is required.")
    .trim()
    .nonempty("Email cannot be empty."),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .nonempty("Password cannot be empty."),
});
