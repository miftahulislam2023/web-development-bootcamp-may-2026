import prisma from "@/lib/prisma";

/**
 * Whether the user may download template source (ZIP).
 * Premium templates require a succeeded purchase.
 * Free templates require authentication only.
 */
export async function assertTemplateDownloadAccess(userId, template) {
  if (!userId) {
    return { allowed: false, error: "Sign in to download templates", status: 401 };
  }

  if (!template) {
    return { allowed: false, error: "Template not found", status: 404 };
  }

  const isPaidPremium =
    Boolean(template.isPremium) && Number(template.priceCents || 0) > 0;

  if (!isPaidPremium) {
    return { allowed: true };
  }

  const purchase = await prisma.templatePurchase.findFirst({
    where: {
      userId,
      templateId: template.id,
      status: "succeeded",
    },
    select: { id: true },
  });

  if (!purchase) {
    return {
      allowed: false,
      error: "Purchase required",
      status: 403,
    };
  }

  return { allowed: true };
}

export function isTemplateOwnedByUser(template, ownedIds) {
  if (!template) return false;
  const locked =
    Boolean(template.isPremium) && Number(template.priceCents || 0) > 0;
  if (!locked) return true;
  return ownedIds?.has?.(template.id) ?? false;
}
