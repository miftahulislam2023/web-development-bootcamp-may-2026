"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/utils/cn";

export function CanvasEndDrop() {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas-end" });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex h-10 items-center justify-center rounded-lg border border-dashed text-xs text-[var(--muted-foreground)] transition-colors",
        isOver
          ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--foreground)]"
          : "border-[var(--border)]",
      )}
    >
      Drop here to append
    </div>
  );
}
