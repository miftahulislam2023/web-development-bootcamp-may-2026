"use client";

import { useState } from "react";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export function DownloadInvoiceButton({ purchaseId }) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    toast.loading("Generating invoice…", { id: "invoice" });
    try {
      const res = await fetch(`/api/invoices/${purchaseId}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to generate invoice");
      }
      const blob = await res.blob();
      if (!blob.size) {
        throw new Error("Invoice file is empty");
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${purchaseId.slice(0, 8)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Invoice downloaded", { id: "invoice" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Invoice download failed", { id: "invoice" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      disabled={loading}
      onClick={handleDownload}
    >
      <FileDown className="mr-1 size-4" />
      {loading ? "Generating…" : "Download Invoice"}
    </Button>
  );
}
