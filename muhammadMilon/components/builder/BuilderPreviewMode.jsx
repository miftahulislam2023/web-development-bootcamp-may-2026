"use client";

import { X, ExternalLink } from "lucide-react";
import { SectionRenderer } from "@/features/builder/SectionRenderer";
import { BuilderViewportProvider } from "@/features/builder/BuilderViewportContext";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

export function BuilderPreviewMode({
  mode,
  onClose,
  document,
  viewport,
  projectSlug,
  publishedSubdomain,
  previewSubdomain,
}) {
  const subdomain = publishedSubdomain || previewSubdomain || null;
  if (!mode) return null;

  const previewUrl = publishedSubdomain
    ? `/p/${publishedSubdomain}`
    : `/dashboard/projects/${projectSlug}/preview`;

  const widthClass =
    viewport === "mobile"
      ? "w-[390px]"
      : viewport === "tablet"
        ? "w-[768px]"
        : "w-full max-w-5xl";

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] bg-[var(--background)] flex flex-col",
        mode === "fullscreen" && "bg-black",
      )}
    >
      <header className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3 bg-[var(--card)] shrink-0">
        <div>
          <p className="text-xs uppercase text-[var(--muted-foreground)]">Live preview</p>
          <p className="font-display font-bold capitalize">{viewport} · {mode}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" href={previewUrl} target="_blank" rel="noreferrer">
            <ExternalLink className="mr-1 size-4" /> Open tab
          </Button>
          <Button size="sm" onClick={onClose}>
            <X className="mr-1 size-4" /> Exit preview
          </Button>
        </div>
      </header>
      <div className="flex-1 overflow-auto flex justify-center p-6 bg-[var(--muted)]/30">
        <BuilderViewportProvider viewport={viewport}>
          <div className={cn("bg-[var(--background)] shadow-2xl transition-all min-h-full", widthClass)}>
            {(document?.sections || []).map((section) => (
              <SectionRenderer key={section.id} section={section} isEditor={false} subdomain={subdomain} />
            ))}
          </div>
        </BuilderViewportProvider>
      </div>
    </div>
  );
}
