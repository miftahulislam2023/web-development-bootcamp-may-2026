import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateInvoicePdfBuffer } from "@/lib/invoice-pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { purchaseId } = await params;
    if (!purchaseId?.trim()) {
      return NextResponse.json({ error: "Purchase ID is required" }, { status: 400 });
    }

    const purchase = await prisma.templatePurchase.findFirst({
      where: {
        id: purchaseId.trim(),
        userId: session.user.id,
        status: "succeeded",
      },
      include: {
        template: { select: { name: true } },
        user: { select: { name: true, email: true } },
      },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: "Invoice not found or payment not completed" },
        { status: 404 },
      );
    }

    if (!purchase.template?.name) {
      return NextResponse.json({ error: "Template data missing for invoice" }, { status: 422 });
    }

    const buffer = await generateInvoicePdfBuffer({
      invoiceId: purchase.id,
      userName: purchase.user?.name || purchase.user?.email || "Customer",
      userEmail: purchase.user?.email || session.user.email || "",
      templateName: purchase.template.name,
      amountCents: purchase.amountCents ?? 0,
      date: purchase.createdAt,
      currency: (purchase.currency || "usd").toUpperCase(),
      paymentStatus: "SUCCESS",
    });

    if (!buffer?.length) {
      return NextResponse.json({ error: "PDF generation returned empty file" }, { status: 500 });
    }

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${purchase.id.slice(0, 8)}.pdf"`,
        "Cache-Control": "private, no-cache",
      },
    });
  } catch (e) {
    console.error("[invoice]", e);
    const message =
      e instanceof Error ? e.message : "Failed to generate invoice";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
