import { hash } from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          message: "Invalid request body.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { username, email, password } = parsed.data;
    const normalizedEmail = email.trim().toLowerCase();

    const [existingEmail, existingUsername] = await Promise.all([
      prisma.user.findUnique({ where: { email: normalizedEmail } }),
      prisma.user.findUnique({ where: { username } }),
    ]);

    if (existingEmail) {
      return Response.json({ message: "Email is already registered." }, { status: 409 });
    }

    if (existingUsername) {
      return Response.json({ message: "Username is already taken." }, { status: 409 });
    }

    const passwordHash = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: username,
        username,
        email: normalizedEmail,
        passwordHash,
      },
      select: {
        id: true,
        username: true,
        email: true,
        image: true,
      },
    });

    return Response.json(
      {
        message: "Account created successfully.",
        user,
      },
      { status: 201 }
    );
  } catch {
    return Response.json({ message: "Internal server error." }, { status: 500 });
  }
}
