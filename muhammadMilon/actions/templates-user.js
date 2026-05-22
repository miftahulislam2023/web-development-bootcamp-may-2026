"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ensureUniqueSlug } from "@/actions/auth";
import { emptyCanvasDocument } from "@/features/builder/componentRegistry";
import { logProjectActivity } from "@/lib/activity";

export async function duplicateTemplateAsProject(templateId) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };

  const template = await prisma.template.findUnique({ where: { id: templateId } });
  if (!template) return { ok: false, error: "Template not found" };

  if (template.isPremium && template.priceCents > 0) {
    const purchase = await prisma.templatePurchase.findFirst({
      where: { userId: session.user.id, templateId: template.id, status: "succeeded" },
    });
    if (!purchase) return { ok: false, error: "Purchase this template first" };
  }

  const name = `${template.name} (copy)`;
  const slug = await ensureUniqueSlug(session.user.id, name);
  const canvas = template.canvasData || emptyCanvasDocument();

  const project = await prisma.project.create({
    data: {
      name,
      slug,
      description: template.description,
      userId: session.user.id,
      siteType: (template.category || "saas").toLowerCase(),
      canvasData: canvas,
      pages: {
        create: {
          title: "Home",
          slug: "home",
          sortOrder: 0,
          canvasData: canvas,
        },
      },
    },
  });

  await logProjectActivity(session.user.id, "duplicate_template", {
    projectId: project.id,
    detail: template.name,
  });

  revalidatePath("/dashboard");
  return { ok: true, project };
}

export async function importTemplateFromJson(jsonString, projectName = "Imported site") {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };

  let canvas;
  try {
    canvas = JSON.parse(jsonString);
    if (!canvas?.sections || !Array.isArray(canvas.sections)) {
      return { ok: false, error: "JSON must include a sections array" };
    }
  } catch {
    return { ok: false, error: "Invalid JSON" };
  }

  const slug = await ensureUniqueSlug(session.user.id, projectName);

  const project = await prisma.project.create({
    data: {
      name: projectName.trim(),
      slug,
      userId: session.user.id,
      canvasData: canvas,
      pages: {
        create: {
          title: "Home",
          slug: "home",
          sortOrder: 0,
          canvasData: canvas,
        },
      },
    },
  });

  await logProjectActivity(session.user.id, "import_template", {
    projectId: project.id,
    detail: projectName,
  });

  revalidatePath("/dashboard");
  return { ok: true, project };
}
