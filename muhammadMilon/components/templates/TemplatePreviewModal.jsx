"use client";

import { useEffect, useState } from "react";
import { X, Layout } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionRenderer } from "@/features/builder/SectionRenderer";

function resolveSections(canvasData) {
  if (Array.isArray(canvasData?.sections) && canvasData.sections.length) {
    return canvasData.sections;
  }
  return [];
}

export function TemplatePreviewModal({ template, isOpen, onClose, onUse }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setOpen(true));
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      const t = setTimeout(() => setOpen(false), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!isOpen && !open) return null;

  const sections = resolveSections(template?.canvasData);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm" onClick={onClose} aria-hidden />

      <div
        className={`relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--background)] shadow-2xl transition-transform duration-300 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--card)] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-violet-600/20 text-violet-500">
              <Layout className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">{template?.name}</h2>
              {template?.category ? (
                <p className="text-xs font-bold uppercase tracking-widest text-violet-500">
                  {template.category}
                </p>
              ) : null}
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 hover:bg-[var(--muted)]">
            <X className="size-5" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-140px)] overflow-y-auto bg-[var(--muted)]/20">
          <div className="border-b border-[var(--border)] bg-[var(--background)]">
            {sections.length > 0 ? (
              sections.map((section) => (
                <SectionRenderer key={section.id} section={section} isEditor={false} />
              ))
            ) : (
              <p className="p-12 text-center text-sm text-[var(--muted-foreground)]">
                This template has no sections in the database yet.
              </p>
            )}
          </div>

          {template?.description ? (
            <div className="border-t border-[var(--border)] bg-[var(--card)] p-6">
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                {template.description}
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2 border-t border-[var(--border)] bg-[var(--card)] p-4">
          <Button className="flex-1 min-w-[140px]" onClick={() => onUse?.(template?.id)}>
            Use template
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
