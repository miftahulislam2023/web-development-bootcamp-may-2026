"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export type LoginState = { error?: string };

export async function loginUser(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    // On bad credentials signIn throws AuthError; on success it throws the
    // redirect — which must be re-thrown so Next.js can perform it.
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }

  return {};
}
