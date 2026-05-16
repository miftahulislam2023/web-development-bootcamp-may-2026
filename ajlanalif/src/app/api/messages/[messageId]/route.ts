import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { editMessageSchema } from "@/lib/validations/messages";

type MessageParams = {
  params: Promise<{
    messageId: string;
  }>;
};

export async function PATCH(request: Request, { params }: MessageParams) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { messageId } = await params;
  const body = await request.json().catch(() => null);
  const parsed = editMessageSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      {
        message: "Invalid request body.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const existingMessage = await prisma.message.findUnique({
    where: { id: messageId },
    select: {
      id: true,
      authorId: true,
      roomId: true,
    },
  });

  if (!existingMessage) {
    return Response.json({ message: "Message not found." }, { status: 404 });
  }

  if (existingMessage.authorId !== session.user.id) {
    return Response.json({ message: "You do not own this message." }, { status: 403 });
  }

  const updatedMessage = await prisma.message.update({
    where: { id: messageId },
    data: {
      content: parsed.data.content,
      editedAt: new Date(),
    },
    select: {
      id: true,
      content: true,
      roomId: true,
      editedAt: true,
      author: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
    },
  });

  return Response.json(
    {
      id: updatedMessage.id,
      content: updatedMessage.content,
      roomId: updatedMessage.roomId,
      editedAt: updatedMessage.editedAt,
      author: updatedMessage.author,
    },
    { status: 200 }
  );
}

export async function DELETE(_request: Request, { params }: MessageParams) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { messageId } = await params;

  const existingMessage = await prisma.message.findUnique({
    where: { id: messageId },
    select: {
      id: true,
      authorId: true,
      roomId: true,
    },
  });

  if (!existingMessage) {
    return Response.json({ message: "Message not found." }, { status: 404 });
  }

  if (existingMessage.authorId !== session.user.id) {
    return Response.json({ message: "You do not own this message." }, { status: 403 });
  }

  const deletedAt = new Date();

  await prisma.message.update({
    where: { id: messageId },
    data: {
      content: "[deleted]",
      deletedAt,
    },
  });

  return Response.json(
    {
      messageId,
      roomId: existingMessage.roomId,
      deletedAt,
    },
    { status: 200 }
  );
}