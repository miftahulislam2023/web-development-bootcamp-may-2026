"use client";

import { useDroppable } from "@dnd-kit/core";
import type { CSSProperties } from "react";

import { ContainerBody } from "@/features/builder/components/CanvasElement";
import { useEditorStore } from "@/features/builder/store/editorStore";
import { cn } from "@/lib/cn";

export function Canvas() {
  const doc = useEditorStore((s) => s.doc);
  const select = useEditorStore((s) => s.select);

  // The root container is a drop target; its id lets dropped elements land
  // straight in the root.
  const { setNodeRef, isOver } = useDroppable({ id: doc.root.id });

  return (
    <main
      className="overflow-auto bg-surface p-8"
      onClick={() => select(null)}
    >
      <div className="mx-auto flex min-h-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border bg-white shadow-card">
        {/* Device chrome */}
        <div className="flex shrink-0 items-center gap-1.5 border-b border-border bg-surface px-3 py-2.5">
          <span className="size-2.5 rounded-full bg-rose-400" />
          <span className="size-2.5 rounded-full bg-amber-400" />
          <span className="size-2.5 rounded-full bg-emerald-400" />
        </div>
        {/* The page being built */}
        <div
          ref={setNodeRef}
          style={doc.root.styles as CSSProperties}
          className={cn(
            "flex-1 outline-2 -outline-offset-2 transition-[outline-color]",
            isOver ? "outline-dashed outline-primary" : "outline-transparent",
          )}
        >
          <ContainerBody container={doc.root} isRoot />
        </div>
      </div>
    </main>
  );
}
