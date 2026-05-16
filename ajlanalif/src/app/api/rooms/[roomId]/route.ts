import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RoomParams = {
  params: Promise<{
    roomId: string;
  }>;
};

export async function GET(_request: Request, { params }: RoomParams) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { roomId } = await params;

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      _count: {
        select: {
          members: true,
        },
      },
    },
  });

  if (!room) {
    return Response.json({ message: "Room not found." }, { status: 404 });
  }

  return Response.json({
    id: room.id,
    name: room.name,
    description: room.description,
    createdAt: room.createdAt,
    memberCount: room._count.members,
  });
}
