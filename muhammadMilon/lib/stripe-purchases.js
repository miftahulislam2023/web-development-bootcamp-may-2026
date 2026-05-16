import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function fulfillTemplatePurchase({
  stripeSessionId,
  userId,
  templateId,
  purchaseId,
  amountCents,
}) {
  if (!stripeSessionId || !userId || !templateId) {
    return { ok: false, error: "Missing checkout data" };
  }

  let purchase = null;

  if (purchaseId) {
    purchase = await prisma.templatePurchase.findFirst({
      where: { id: purchaseId, userId },
    });
  }

  if (!purchase) {
    purchase = await prisma.templatePurchase.findFirst({
      where: { stripeSessionId },
    });
  }

  if (!purchase) {
    purchase = await prisma.templatePurchase.findFirst({
      where: { userId, templateId, status: "pending" },
      orderBy: { createdAt: "desc" },
    });
  }

  if (purchase) {
    await prisma.templatePurchase.update({
      where: { id: purchase.id },
      data: {
        status: "succeeded",
        stripeSessionId,
        amountCents: amountCents ?? purchase.amountCents,
        templateId,
        userId,
      },
    });
  } else {
    await prisma.templatePurchase.create({
      data: {
        userId,
        templateId,
        stripeSessionId,
        status: "succeeded",
        amountCents: amountCents ?? 0,
      },
    });
  }

  revalidatePath("/dashboard/purchases");
  revalidatePath("/dashboard/templates");
  return { ok: true };
}
