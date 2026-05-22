"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { projectCreateSchema, seoSchema, pageUpdateSchema } from "@/lib/validations";
import { slugify } from "@/utils/id";
import { ensureUniqueSlug } from "@/actions/auth";
import { emptyCanvasDocument } from "@/features/builder/componentRegistry";

async function revalidateBuilderByProjectId(projectId) {
  const p = await prisma.project.findUnique({
    where: { id: projectId },
    select: { slug: true },
  });
  if (p?.slug) {
    revalidatePath(`/dashboard/projects/${p.slug}/builder`);
  }
}

export async function createProject(input) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = projectCreateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid input", fields: parsed.error.flatten() };
  }

  const slug = await ensureUniqueSlug(session.user.id, parsed.data.name);

  const project = await prisma.project.create({
    data: {
      name: parsed.data.name.trim(),
      slug,
      description: parsed.data.description?.trim() || null,
      userId: session.user.id,
      siteType: "saas",
      canvasData: emptyCanvasDocument(),
      pages: {
        create: {
          title: "Home",
          slug: "home",
          sortOrder: 0,
          canvasData: emptyCanvasDocument(),
        },
      },
    },
  });

  revalidatePath("/dashboard");
  return { ok: true, project };
}

export async function createProjectFromTemplate(templateId) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };

  let template = null;
  const idLooksCuid = typeof templateId === "string" && /^c[a-z0-9]{24}$/i.test(templateId);
  if (idLooksCuid) {
    template = await prisma.template.findUnique({ where: { id: templateId } });
  }
  if (!template) {
    const slugKey = `market-${String(templateId).replace(/[^a-z0-9-]/gi, "-")}`;
    template = await prisma.template.findUnique({ where: { slug: slugKey } });
  }
  if (!template) return { ok: false, error: "Template not found" };

  if (template.isPremium && template.priceCents > 0) {
    const purchase = await prisma.templatePurchase.findFirst({
      where: {
        userId: session.user.id,
        templateId: template.id,
        status: "succeeded",
      },
    });
    if (!purchase) {
      return { ok: false, error: "Purchase this premium template to use it" };
    }
  }

  const name = `My ${template.name}`;
  const slug = await ensureUniqueSlug(session.user.id, name);

  try {
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

    revalidatePath("/dashboard");
    return { ok: true, project };
  } catch (e) {
    console.error(e);
    return { ok: false, error: "Failed to create project" };
  }
}

export async function updateProjectCanvas(projectId, canvasData, viewport, pageId = null) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
  });
  if (!project) {
    return { ok: false, error: "Not found" };
  }

  if (pageId) {
    await prisma.page.update({
      where: { id: pageId, projectId },
      data: { canvasData: canvasData ?? undefined },
    });
    if (viewport) {
      await prisma.project.update({
        where: { id: projectId },
        data: { viewport },
      });
    }
  } else {
    await prisma.project.update({
      where: { id: projectId },
      data: {
        canvasData: canvasData ?? project.canvasData,
        ...(viewport ? { viewport } : {}),
      },
    });
  }

  revalidatePath("/dashboard");
  await revalidateBuilderByProjectId(projectId);
  return { ok: true };
}

export async function createPage(projectId, title, slug) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
  });
  if (!project) return { ok: false, error: "Project not found" };

  try {
    const count = await prisma.page.count({ where: { projectId } });
    const page = await prisma.page.create({
      data: {
        projectId,
        title,
        slug,
        sortOrder: count,
        canvasData: emptyCanvasDocument(),
      },
    });
    await revalidateBuilderByProjectId(projectId);
    return { ok: true, page };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

export async function updatePage(projectId, pageId, input) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };

  const parsed = pageUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid page details" };
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
  });
  if (!project) return { ok: false, error: "Project not found" };

  const slug = slugify(parsed.data.slug) || "page";
  const existing = await prisma.page.findFirst({
    where: { projectId, slug, NOT: { id: pageId } },
  });
  if (existing) return { ok: false, error: "Slug already in use" };

  try {
    const page = await prisma.page.update({
      where: { id: pageId, projectId },
      data: {
        title: parsed.data.title.trim(),
        slug,
      },
    });
    await revalidateBuilderByProjectId(projectId);
    return { ok: true, page };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

export async function duplicatePage(projectId, pageId) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
    include: { pages: true },
  });
  if (!project) return { ok: false, error: "Project not found" };

  const source = project.pages.find((p) => p.id === pageId);
  if (!source) return { ok: false, error: "Page not found" };

  const baseSlug = `${source.slug}-copy`;
  let slug = baseSlug;
  let n = 0;
  while (project.pages.some((p) => p.slug === slug)) {
    n += 1;
    slug = `${baseSlug}-${n}`;
  }

  const maxOrder = Math.max(...project.pages.map((p) => p.sortOrder), 0);

  const page = await prisma.page.create({
    data: {
      projectId,
      title: `${source.title} (copy)`,
      slug,
      sortOrder: maxOrder + 1,
      canvasData: source.canvasData ?? emptyCanvasDocument(),
      metaTitle: source.metaTitle,
      metaDescription: source.metaDescription,
    },
  });

  await revalidateBuilderByProjectId(projectId);
  return { ok: true, page };
}

export async function updatePageSeo(projectId, pageId, input) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };

  const parsed = seoSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid SEO fields" };

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
  });
  if (!project) return { ok: false, error: "Not found" };

  const metaTitle = parsed.data.metaTitle?.trim() || null;
  const metaDescription = parsed.data.metaDescription?.trim() || null;
  const ogImage = parsed.data.ogImage?.trim() || null;

  try {
    if (pageId) {
      const page = await prisma.page.findFirst({
        where: { id: pageId, projectId },
        select: { id: true },
      });
      if (!page) return { ok: false, error: "Page not found" };

      await prisma.page.update({
        where: { id: pageId },
        data: { metaTitle, metaDescription },
      });
    } else {
      await prisma.project.update({
        where: { id: projectId },
        data: { metaTitle, metaDescription, ogImage },
      });
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Database update failed";
    if (msg.includes("metaTitle") || msg.includes("Unknown argument")) {
      return {
        ok: false,
        error: "Database schema out of date. Run: npx prisma db push && npx prisma generate, then restart the dev server.",
      };
    }
    return { ok: false, error: msg };
  }

  await revalidateBuilderByProjectId(projectId);
  return { ok: true };
}

export async function removePage(projectId, pageId) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
  });
  if (!project) return { ok: false, error: "Project not found" };

  try {
    const pageCount = await prisma.page.count({ where: { projectId } });
    if (pageCount <= 1) return { ok: false, error: "Cannot delete the last page" };

    const page = await prisma.page.findFirst({
      where: { id: pageId, projectId },
      select: { id: true },
    });
    if (!page) return { ok: false, error: "Page not found" };

    await prisma.page.delete({
      where: { id: pageId },
    });
    await revalidateBuilderByProjectId(projectId);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

export async function deleteProject(projectId) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }

  const existing = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
  });
  if (!existing) {
    return { ok: false, error: "Not found" };
  }

  await prisma.project.delete({ where: { id: projectId } });
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function getProjectForUser(slugOrId) {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.project.findFirst({
    where: {
      userId: session.user.id,
      OR: [{ slug: slugOrId }, { id: slugOrId }],
    },
    include: { published: true, pages: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function listProjectsForUser() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: { published: true },
  });
}
