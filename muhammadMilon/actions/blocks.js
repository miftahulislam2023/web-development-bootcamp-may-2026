"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { savedBlock as savedBlockModel } from "@/lib/prisma-models";
import { createId } from "@/utils/id";

export async function saveBlock(projectId, name, sectionData, isGlobal = false) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { ok: false, error: "Unauthorized" };

    const blocks = savedBlockModel();
    if (!blocks) return { ok: false, error: "Saved blocks unavailable — run prisma generate" };

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: session.user.id },
    });
    if (!project) return { ok: false, error: "Not found" };

    const blockKey = isGlobal ? createId() : null;
    const block = await blocks.create({
      data: {
        userId: session.user.id,
        projectId,
        name: name.trim(),
        sectionData,
        isGlobal,
        blockKey,
      },
    });

    revalidatePath(`/dashboard/projects/${project.slug}/builder`);
    return { ok: true, block };
  } catch (e) {
    console.error("[saveBlock]", e);
    return { ok: false, error: e instanceof Error ? e.message : "Save failed" };
  }
}

export async function listSavedBlocks(projectId) {
  try {
    const session = await auth();
    if (!session?.user?.id) return [];

    const blocks = savedBlockModel();
    if (!blocks) return [];

    return await blocks.findMany({
      where: { projectId, userId: session.user.id },
      orderBy: { updatedAt: "desc" },
    });
  } catch (e) {
    console.error("[listSavedBlocks]", e);
    return [];
  }
}

export async function deleteSavedBlock(blockId) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { ok: false, error: "Unauthorized" };

    const blocks = savedBlockModel();
    if (!blocks) return { ok: false, error: "Saved blocks unavailable" };

    const block = await blocks.findFirst({
      where: { id: blockId, userId: session.user.id },
    });
    if (!block) return { ok: false, error: "Not found" };

    await blocks.delete({ where: { id: blockId } });
    return { ok: true };
  } catch (e) {
    console.error("[deleteSavedBlock]", e);
    return { ok: false, error: e instanceof Error ? e.message : "Delete failed" };
  }
}

export async function updateGlobalBlock(blockKey, sectionData) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { ok: false, error: "Unauthorized" };

    const blocks = savedBlockModel();
    if (!blocks) return { ok: false, error: "Saved blocks unavailable" };

    await blocks.updateMany({
      where: { blockKey, userId: session.user.id, isGlobal: true },
      data: { sectionData, updatedAt: new Date() },
    });

    return { ok: true };
  } catch (e) {
    console.error("[updateGlobalBlock]", e);
    return { ok: false, error: e instanceof Error ? e.message : "Update failed" };
  }
}
