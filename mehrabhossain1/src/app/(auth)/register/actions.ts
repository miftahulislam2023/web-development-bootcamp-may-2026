"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";

export type RegisterState = { error?: string };

export async function registerUser(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Email already registered" };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({ data: { name, email, passwordHash } });
  } catch {
    return { error: "Something went wrong. Please try again." };
  }

  // redirect() throws — must be called outside the try/catch above.
  redirect("/login");
}
