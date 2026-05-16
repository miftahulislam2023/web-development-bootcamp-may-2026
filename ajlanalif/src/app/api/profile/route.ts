import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const profileUpdateSchema = z.object({
  name: z.string().max(100).optional(),
  username: z.string().min(3).max(32).optional(),
  bio: z.string().max(160).optional(),
});

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = profileUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      {
        message: "Invalid request body.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const name = parsed.data.name?.trim() ?? "";
  const username = parsed.data.username?.trim() ?? "";
  const bio = parsed.data.bio?.trim() ?? "";

  if (!username) {
    return Response.json({ message: "Username is required." }, { status: 400 });
  }

  if (username !== session.user.username) {
    const existingUsername = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (existingUsername && existingUsername.id !== session.user.id) {
      return Response.json({ message: "Username is already taken." }, { status: 409 });
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: name.length > 0 ? name : null,
      username,
      bio: bio.length > 0 ? bio : null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      bio: true,
      image: true,
    },
  });

  return Response.json({
    user: updatedUser,
  });
}