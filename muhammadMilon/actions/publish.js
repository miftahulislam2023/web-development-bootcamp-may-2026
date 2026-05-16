"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { slugify } from "@/utils/id";
import { logProjectActivity } from "@/lib/activity";

function randomToken() {
  return Math.random().toString(36).slice(2, 10);
}

function buildPublishSnapshot(project, pages, activePageId) {
  const orderedPages = [...pages].sort((a, b) => a.sortOrder - b.sortOrder);
  const home =
    orderedPages.find((p) => p.slug === "home") ||
    orderedPages.find((p) => p.id === activePageId) ||
    orderedPages[0];

  const homeDoc = home?.canvasData;
  const sections = Array.isArray(homeDoc?.sections) ? homeDoc.sections : [];

  return {
    version: 2,
    homeSlug: home?.slug || "home",
    pages: orderedPages.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      metaTitle: p.metaTitle,
      metaDescription: p.metaDescription,
      canvasData: p.canvasData,
    })),
    sections,
  };
}

export async function publishProject(projectId, preferredSubdomain, activePageId = null) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
    include: { pages: { orderBy: { sortOrder: "asc" } } },
  });
  if (!project) {
    return { ok: false, error: "Not found" };
  }

  let subdomain = slugify(preferredSubdomain || project.slug).slice(0, 48);
  if (!subdomain) subdomain = `site-${randomToken()}`;

  let candidate = subdomain;
  let i = 0;
  for (;;) {
    const taken = await prisma.publishedWebsite.findFirst({
      where: { subdomain: candidate },
    });
    if (!taken || taken.projectId === projectId) break;
    i += 1;
    candidate = `${subdomain}-${i}`;
  }

  const snapshot = buildPublishSnapshot(project, project.pages, activePageId);
  const seoMeta = {
    metaTitle: project.metaTitle || project.name,
    metaDescription: project.metaDescription || project.description || "",
    ogImage: project.ogImage || null,
  };

  const published = await prisma.publishedWebsite.upsert({
    where: { projectId },
    create: {
      projectId,
      subdomain: candidate,
      snapshotData: snapshot,
      seoMeta,
      isActive: true,
    },
    update: {
      subdomain: candidate,
      snapshotData: snapshot,
      seoMeta,
      isActive: true,
    },
  });

  await prisma.project.update({
    where: { id: projectId },
    data: { status: "published" },
  });

  await logProjectActivity(session.user.id, "publish", {
    projectId,
    detail: candidate,
  });

  revalidatePath("/dashboard");
  revalidatePath(`/p/${published.subdomain}`);
  return { ok: true, published };
}

export async function unpublishProject(projectId) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
    include: { published: true },
  });
  if (!project?.published) {
    return { ok: false, error: "Site is not published" };
  }

  await prisma.$transaction([
    prisma.publishedWebsite.update({
      where: { projectId },
      data: { isActive: false },
    }),
    prisma.project.update({
      where: { id: projectId },
      data: { status: "draft" },
    }),
  ]);

  await logProjectActivity(session.user.id, "unpublish", { projectId });

  revalidatePath("/dashboard");
  revalidatePath(`/p/${project.published.subdomain}`);
  return { ok: true };
}

export async function setCustomDomain(projectId, customDomain) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
    include: { published: true },
  });
  if (!project?.published) {
    return { ok: false, error: "Publish the site first" };
  }

  const domain = customDomain?.trim().toLowerCase() || null;
  const verifyToken = domain ? `nexora-verify-${randomToken()}${randomToken()}` : null;

  await prisma.publishedWebsite.update({
    where: { projectId },
    data: {
      customDomain: domain,
      domainVerified: false,
      domainVerifyToken: verifyToken,
    },
  });

  return { ok: true, verifyToken, domain };
}

export async function verifyCustomDomain(projectId) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };

  const published = await prisma.publishedWebsite.findFirst({
    where: { projectId, project: { userId: session.user.id } },
  });
  if (!published?.customDomain || !published.domainVerifyToken) {
    return { ok: false, error: "No domain to verify" };
  }

  // Manual verification step — user confirms DNS TXT record was added
  await prisma.publishedWebsite.update({
    where: { projectId },
    data: { domainVerified: true },
  });

  return { ok: true };
}

export async function updatePublishedSubdomain(projectId, newSubdomain) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };

  let candidate = slugify(newSubdomain).slice(0, 48);
  if (!candidate) return { ok: false, error: "Invalid subdomain" };

  const taken = await prisma.publishedWebsite.findFirst({
    where: { subdomain: candidate, NOT: { projectId } },
  });
  if (taken) return { ok: false, error: "Subdomain already taken" };

  const published = await prisma.publishedWebsite.update({
    where: { projectId },
    data: { subdomain: candidate },
  });

  revalidatePath(`/p/${published.subdomain}`);
  return { ok: true, published };
}
