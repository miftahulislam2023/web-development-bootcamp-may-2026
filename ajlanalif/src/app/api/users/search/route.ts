import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { searchUsersQuerySchema } from "@/lib/validations/direct-messages";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = searchUsersQuerySchema.safeParse({
    q: searchParams.get("q") ?? undefined,
  });

  if (!parsed.success) {
    return Response.json(
      {
        message: "Invalid query parameters.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const query = parsed.data.q ?? "";

  if (query.length < 1) {
    return Response.json([]);
  }

  const users = await prisma.user.findMany({
    where: {
      id: { not: session.user.id },
      username: {
        contains: query,
        mode: "insensitive",
      },
    },
    take: 10,
    orderBy: {
      username: "asc",
    },
    select: {
      id: true,
      username: true,
      name: true,
      image: true,
      bio: true,
    },
  });

  return Response.json(users);
}
