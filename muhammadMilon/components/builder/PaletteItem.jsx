"use client";

import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/utils/cn";

export function PaletteItem({ type, label }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette:${type}`,
    data: { fromPalette: true, type },
  });

  return (
    <button
      type="button"
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "flex w-full items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-left text-sm font-medium text-[var(--foreground)] shadow-sm transition hover:border-[var(--accent)]/40",
        isDragging && "opacity-60",
      )}
    >
      <span>{label}</span>
      <span className="text-[10px] uppercase tracking-wide text-[var(--muted-foreground)]">
        Drag
      </span>
    </button>
  );
}
