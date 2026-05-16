import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createRoomSchema } from "@/lib/validations/rooms";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createRoomSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      {
        message: "Invalid request body.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const existingRoom = await prisma.room.findUnique({
    where: { name: parsed.data.name },
  });

  if (existingRoom) {
    return Response.json({ message: "Room name already exists." }, { status: 409 });
  }

  const room = await prisma.room.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      createdById: session.user.id,
      members: {
        create: {
          userId: session.user.id,
        },
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return Response.json(room, { status: 201 });
}

export async function GET() {
  const rooms = await prisma.room.findMany({
    orderBy: {
      createdAt: "desc",
    },
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

  return Response.json(
    rooms.map((room) => ({
      id: room.id,
      name: room.name,
      description: room.description,
      createdAt: room.createdAt,
      memberCount: room._count.members,
    }))
  );
}
