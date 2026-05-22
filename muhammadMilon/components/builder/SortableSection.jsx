"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { SectionRenderer } from "@/features/builder/SectionRenderer";
import { SectionResizeHandle } from "@/components/builder/SectionResizeHandle";
import { cn } from "@/utils/cn";

export function SortableSection({ section, selected, isEditor, onSelect }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
    data: { fromPalette: false },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative">
      {isEditor && (
        <button
          type="button"
          className={cn(
            "absolute left-1 top-4 z-20 flex size-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] opacity-0 shadow-sm transition-opacity group-hover:opacity-100",
            selected && "opacity-100",
          )}
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
      )}
      <div
        className={cn(
          "relative rounded-xl border border-transparent",
          selected && isEditor && "border-[var(--accent)]/60 shadow-[0_0_0_1px_color-mix(in_oklab,var(--accent)_35%,transparent)]",
        )}
      >
        <SectionRenderer section={section} isEditor={isEditor} onSelect={onSelect} />
        {isEditor ? (
          <SectionResizeHandle
            sectionId={section.id}
            minHeight={Number(section.style?.minHeight) || 0}
          />
        ) : null}
      </div>
    </div>
  );
}
