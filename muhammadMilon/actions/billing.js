"use server";

import Stripe from "stripe";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { fulfillTemplatePurchase } from "@/lib/stripe-purchases";

function getOrigin() {
  const raw = process.env.AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

export async function completeCheckoutFromSession(stripeSessionId) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!process.env.STRIPE_SECRET_KEY) {
    return { ok: false, error: "Stripe is not configured" };
  }
  if (!stripeSessionId?.trim()) {
    return { ok: false, error: "Missing session" };
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const checkout = await stripe.checkout.sessions.retrieve(stripeSessionId);

  if (checkout.payment_status !== "paid") {
    return { ok: false, error: "Payment not completed" };
  }

  const userId = checkout.metadata?.userId;
  const templateId = checkout.metadata?.templateId;
  const purchaseId = checkout.metadata?.purchaseId;

  if (userId !== session.user.id) {
    return { ok: false, error: "Forbidden" };
  }

  return fulfillTemplatePurchase({
    stripeSessionId: checkout.id,
    userId,
    templateId,
    purchaseId,
    amountCents: checkout.amount_total ?? undefined,
  });
}

export async function createTemplateCheckout(templateId) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!process.env.STRIPE_SECRET_KEY) {
    return { ok: false, error: "Stripe is not configured (set STRIPE_SECRET_KEY)" };
  }

  const template = await prisma.template.findUnique({ where: { id: templateId } });
  if (!template) return { ok: false, error: "Template not found" };
  if (!template.isPremium || template.priceCents < 1) {
    return { ok: false, error: "This template is free — no checkout needed" };
  }

  const existing = await prisma.templatePurchase.findFirst({
    where: { userId: session.user.id, templateId: template.id, status: "succeeded" },
  });
  if (existing) return { ok: false, error: "You already own this template" };

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const origin = getOrigin();

  const purchase = await prisma.templatePurchase.create({
    data: {
      userId: session.user.id,
      templateId: template.id,
      status: "pending",
      amountCents: template.priceCents,
    },
  });

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: session.user.email || undefined,
    success_url: `${origin}/dashboard/purchases?paid=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/dashboard/templates?canceled=1`,
    metadata: {
      userId: session.user.id,
      templateId: template.id,
      purchaseId: purchase.id,
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: template.priceCents,
          product_data: { name: template.name },
        },
        quantity: 1,
      },
    ],
  });

  await prisma.templatePurchase.update({
    where: { id: purchase.id },
    data: { stripeSessionId: checkoutSession.id },
  });

  return { ok: true, url: checkoutSession.url };
}
