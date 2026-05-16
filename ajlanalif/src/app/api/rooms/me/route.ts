import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const memberships = await prisma.roomMember.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      joinedAt: "desc",
    },
    select: {
      joinedAt: true,
      room: {
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
        },
      },
    },
  });

  return Response.json(
    memberships.map((membership) => ({
      joinedAt: membership.joinedAt,
      room: membership.room,
    }))
  );
}
