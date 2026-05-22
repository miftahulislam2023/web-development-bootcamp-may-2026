"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logProjectActivity } from "@/lib/activity";

const MAX_REVISIONS = 30;

export async function saveCanvasRevision(projectId, canvasData, pageId = null, label = null) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
  });
  if (!project) return { ok: false, error: "Not found" };

  const revision = await prisma.canvasRevision.create({
    data: {
      projectId,
      pageId,
      label: label || `Save ${new Date().toLocaleString()}`,
      canvasData,
    },
  });

  const count = await prisma.canvasRevision.count({ where: { projectId } });
  if (count > MAX_REVISIONS) {
    const oldest = await prisma.canvasRevision.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
      take: count - MAX_REVISIONS,
      select: { id: true },
    });
    await prisma.canvasRevision.deleteMany({
      where: { id: { in: oldest.map((o) => o.id) } },
    });
  }

  await logProjectActivity(session.user.id, "save_revision", {
    projectId,
    detail: revision.label,
  });

  return { ok: true, revision };
}

export async function listCanvasRevisions(projectId, pageId = null) {
  const session = await auth();
  if (!session?.user?.id) return [];

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
  });
  if (!project) return [];

  return prisma.canvasRevision.findMany({
    where: { projectId, ...(pageId ? { pageId } : {}) },
    orderBy: { createdAt: "desc" },
    take: MAX_REVISIONS,
    select: { id: true, label: true, createdAt: true, pageId: true },
  });
}

export async function restoreCanvasRevision(projectId, revisionId) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };

  const revision = await prisma.canvasRevision.findFirst({
    where: { id: revisionId, project: { userId: session.user.id, id: projectId } },
  });
  if (!revision) return { ok: false, error: "Revision not found" };

  if (revision.pageId) {
    await prisma.page.update({
      where: { id: revision.pageId },
      data: { canvasData: revision.canvasData },
    });
  } else {
    await prisma.project.update({
      where: { id: projectId },
      data: { canvasData: revision.canvasData },
    });
  }

  await logProjectActivity(session.user.id, "restore_revision", {
    projectId,
    detail: revision.label,
  });

  revalidatePath("/dashboard");
  return { ok: true, canvasData: revision.canvasData, pageId: revision.pageId };
}

export async function listRecentActivity(limit = 12) {
  const session = await auth();
  if (!session?.user?.id) return [];

  if (typeof prisma.projectActivity?.findMany === "function") {
    return prisma.projectActivity.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        project: { select: { name: true, slug: true } },
      },
    });
  }

  // Fallback when Prisma client is stale (before `npx prisma generate` + dev restart)
  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: { id: true, name: true, slug: true, updatedAt: true },
  });

  return projects.map((p) => ({
    id: `project-${p.id}`,
    userId: session.user.id,
    projectId: p.id,
    action: "project_updated",
    detail: p.name,
    createdAt: p.updatedAt,
    project: { name: p.name, slug: p.slug },
  }));
}
