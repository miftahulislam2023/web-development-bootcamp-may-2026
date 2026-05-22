"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { completeCheckoutFromSession } from "@/actions/billing";
import { DownloadTemplateButton } from "@/components/dashboard/DownloadTemplateButton";
import { DownloadInvoiceButton } from "@/components/dashboard/DownloadInvoiceButton";

export function PurchasesView({ purchases }) {
  const searchParams = useSearchParams();
  const paid = searchParams.get("paid");
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (paid !== "1") return;
    if (!sessionId) {
      toast.success("Thank you for your purchase.");
      return;
    }
    completeCheckoutFromSession(sessionId).then((res) => {
      if (res.ok) toast.success("Payment successful — purchase saved.");
      else toast.error(res.error || "Could not confirm payment — contact support if charged.");
    });
  }, [paid, sessionId]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Purchases</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Completed template purchases only — download ZIP source or invoice PDF.
        </p>
      </div>

      {purchases.length === 0 ? (
        <p className="text-sm text-[var(--muted-foreground)]">
          No completed purchases yet.{" "}
          <Link href="/dashboard/templates" className="text-[var(--accent)] hover:underline">
            Browse templates
          </Link>
        </p>
      ) : (
        <ul className="space-y-3">
          {purchases.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-4"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <p className="font-display font-semibold">{p.template?.name || "Template"}</p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Payment status:{" "}
                  <span className="font-semibold text-emerald-600">SUCCESS</span>
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {new Date(p.createdAt).toLocaleString()}
                  {p.amountCents != null ? ` · $${(p.amountCents / 100).toFixed(2)}` : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <DownloadTemplateButton
                  templateId={p.templateId}
                  templateSlug={p.template?.slug || p.templateId}
                  label="Download ZIP"
                />
                <DownloadInvoiceButton purchaseId={p.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

