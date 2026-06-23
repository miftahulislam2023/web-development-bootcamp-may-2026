import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { joinRoomSchema } from "@/lib/validations/rooms";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = joinRoomSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      {
        message: "Invalid request body.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const room = await prisma.room.findUnique({
    where: { id: parsed.data.roomId },
    select: { id: true },
  });

  if (!room) {
    return Response.json({ message: "Room not found." }, { status: 404 });
  }

  const existingMembership = await prisma.roomMember.findUnique({
    where: {
      roomId_userId: {
        roomId: parsed.data.roomId,
        userId: session.user.id,
      },
    },
  });

  if (existingMembership) {
    return Response.json({ message: "Already joined this room." }, { status: 409 });
  }

  await prisma.roomMember.create({
    data: {
      roomId: parsed.data.roomId,
      userId: session.user.id,
    },
  });

  return Response.json({ message: "Joined room successfully." }, { status: 200 });
}
