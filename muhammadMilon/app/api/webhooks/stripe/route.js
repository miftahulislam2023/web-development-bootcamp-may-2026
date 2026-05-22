import { NextResponse } from "next/server";
import Stripe from "stripe";
import { fulfillTemplatePurchase } from "@/lib/stripe-purchases";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!secret || !key) {
    return NextResponse.json({ error: "Stripe webhook not configured" }, { status: 501 });
  }

  const buf = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = new Stripe(key);
  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, secret);
  } catch (err) {
    console.error("[stripe webhook]", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const checkout = event.data.object;
      await fulfillTemplatePurchase({
        stripeSessionId: checkout.id,
        userId: checkout.metadata?.userId,
        templateId: checkout.metadata?.templateId,
        purchaseId: checkout.metadata?.purchaseId,
        amountCents: checkout.amount_total ?? undefined,
      });
    }
    if (event.type === "checkout.session.expired") {
      const checkout = event.data.object;
      const { default: prisma } = await import("@/lib/prisma");
      await prisma.templatePurchase.updateMany({
        where: { stripeSessionId: checkout.id, status: "pending" },
        data: { status: "failed" },
      });
    }
  } catch (e) {
    console.error("[stripe webhook handler]", e);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
