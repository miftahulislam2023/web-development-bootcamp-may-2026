"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export function DownloadTemplateButton({
  templateId,
  templateSlug,
  label = "Download ZIP",
  variant = "outline",
  size = "sm",
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleDownload() {
    setIsDownloading(true);
    toast.loading("Preparing ZIP export…", { id: "download" });

    try {
      const response = await fetch("/api/templates/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const msg = err.error || "Download failed";
        if (response.status === 403) {
          throw new Error("Purchase required");
        }
        throw new Error(msg);
      }

      const blob = await response.blob();
      if (!blob.size) {
        throw new Error("ZIP file is empty");
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${templateSlug || "template"}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Template ZIP downloaded", { id: "download" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Download failed", { id: "download" });
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleDownload}
      disabled={isDownloading}
      className="flex items-center gap-2"
    >
      <Download className="size-3" />
      {isDownloading ? "Downloading…" : label}
    </Button>
  );
}
