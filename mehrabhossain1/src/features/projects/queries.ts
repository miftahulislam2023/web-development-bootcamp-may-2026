import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session.user.id;
}

/** Lists the current user's projects, most recently updated first. */
export async function listProjects() {
  const userId = await requireUserId();
  return prisma.project.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

/** Returns a project the current user owns, or null. */
export async function getProject(id: string) {
  const userId = await requireUserId();
  return prisma.project.findFirst({
    where: { id, userId },
  });
}

/**
 * Returns a project by id with no auth or ownership check — backs the public,
 * shareable `/preview/[id]` route. IDs are unguessable UUIDs, so a project is
 * only reachable by someone who has been given its link.
 */
export async function getPublicProject(id: string) {
  return prisma.project.findUnique({
    where: { id },
  });
}
