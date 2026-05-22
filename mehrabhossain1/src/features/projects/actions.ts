"use server";

import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { createEmptyDocument } from "@/lib/builder/defaults";
import { pageDocumentSchema } from "@/lib/builder/schema";
import { prisma } from "@/lib/prisma";
import type { PageDocument } from "@/types/builder";

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session.user.id;
}

/** Creates a project for the current user and opens it in the builder. */
export async function createProject(formData: FormData) {
  const userId = await requireUserId();

  const rawName = formData.get("name");
  const name =
    (typeof rawName === "string" && rawName.trim()) || "Untitled Project";

  const project = await prisma.project.create({
    data: {
      name: name.slice(0, 100),
      tree: createEmptyDocument() as unknown as Prisma.InputJsonValue,
      userId,
    },
  });

  revalidatePath("/dashboard");
  redirect(`/builder/${project.id}`);
}

/** Saves the page document of a project the current user owns. */
export async function updateProject(id: string, tree: PageDocument) {
  const userId = await requireUserId();

  const parsed = pageDocumentSchema.safeParse(tree);
  if (!parsed.success) {
    throw new Error("Invalid page document");
  }

  const result = await prisma.project.updateMany({
    where: { id, userId },
    data: { tree: parsed.data as unknown as Prisma.InputJsonValue },
  });
  if (result.count === 0) {
    throw new Error("Project not found");
  }

  // Only the dashboard list needs revalidating; the builder owns its own
  // client state, so refreshing its route here could clobber live edits.
  revalidatePath("/dashboard");
}

/** Deletes a project the current user owns. */
export async function deleteProject(id: string) {
  const userId = await requireUserId();

  await prisma.project.deleteMany({ where: { id, userId } });

  revalidatePath("/dashboard");
}
