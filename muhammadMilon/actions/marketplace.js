"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

function mapTemplateRow(t, ownedIds = new Set()) {
  return {
    id: t.id,
    name: t.name,
    slug: t.slug,
    description: t.description,
    category: t.category,
    thumbnail: t.thumbnail,
    isPremium: t.isPremium,
    priceCents: t.priceCents,
    owned: ownedIds.has(t.id),
  };
}

export async function listPublicTemplates() {
  const session = await auth();
  const templates = await prisma.template.findMany({
    orderBy: [{ isPremium: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      category: true,
      thumbnail: true,
      isPremium: true,
      priceCents: true,
      canvasData: true,
    },
  });

  let owned = new Set();
  if (session?.user?.id) {
    const purchases = await prisma.templatePurchase.findMany({
      where: { userId: session.user.id, status: "succeeded" },
      select: { templateId: true },
    });
    owned = new Set(purchases.map((p) => p.templateId));
  }

  return templates.map((t) => mapTemplateRow(t, owned));
}

export async function listMarketplaceTemplatesForUser() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const templates = await prisma.template.findMany({
    orderBy: [{ isPremium: "asc" }, { name: "asc" }],
  });
  const purchases = await prisma.templatePurchase.findMany({
    where: { userId: session.user.id, status: "succeeded" },
    select: { templateId: true },
  });
  const owned = new Set(purchases.map((p) => p.templateId));

  return templates.map((t) => mapTemplateRow(t, owned));
}

export async function listMyPurchases() {
  try {
    const session = await auth();
    if (!session?.user?.id) return [];

    return prisma.templatePurchase.findMany({
      where: { userId: session.user.id, status: "succeeded" },
      include: {
        template: {
          select: {
            id: true,
            name: true,
            slug: true,
            thumbnail: true,
            category: true,
            isPremium: true,
            priceCents: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("[listMyPurchases]", e);
    return [];
  }
}
