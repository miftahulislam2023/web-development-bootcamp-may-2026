"use client";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus } from "lucide-react";
import type { CSSProperties, MouseEvent } from "react";

import { useEditorStore } from "@/features/builder/store/editorStore";
import { ElementRenderer } from "@/features/renderer/ElementRenderer";
import { ELEMENT_REGISTRY } from "@/lib/builder/defaults";
import { cn } from "@/lib/cn";
import type { BuilderElement, ContainerElement } from "@/types/builder";

/** Designed drop zone shown inside an empty container. */
function EmptyDropZone({ isRoot }: { isRoot?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-10 text-center">
      <span className="flex size-9 items-center justify-center rounded-lg bg-accent-soft text-primary">
        <Plus className="size-5" />
      </span>
      <p className="text-sm font-medium text-fg-muted">
        {isRoot ? "Drag a block here to start" : "Drop blocks inside"}
      </p>
    </div>
  );
}

/** Renders a container's children inside a scoped SortableContext. */
export function ContainerBody({
  container,
  isRoot,
}: {
  container: ContainerElement;
  isRoot?: boolean;
}) {
  if (container.children.length === 0) {
    return <EmptyDropZone isRoot={isRoot} />;
  }
  return (
    <SortableContext
      items={container.children.map((child) => child.id)}
      strategy={verticalListSortingStrategy}
    >
      {container.children.map((child) => (
        <CanvasElement key={child.id} element={child} />
      ))}
    </SortableContext>
  );
}

/** A draggable / sortable / selectable element on the editor canvas. */
export function CanvasElement({ element }: { element: BuilderElement }) {
  const selectedId = useEditorStore((s) => s.selectedId);
  const select = useEditorStore((s) => s.select);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ id: element.id, data: { source: "canvas" } });

  const isSelected = selectedId === element.id;

  const dndStyle: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : undefined,
  };

  function handleClick(event: MouseEvent) {
    // Select this element; stop bubbling so the innermost element wins, and
    // prevent default so a button element's link doesn't navigate in-editor.
    event.stopPropagation();
    event.preventDefault();
    select(element.id);
  }

  // Floating type-label handle, shown while the element is selected.
  const handle = isSelected ? (
    <span className="absolute left-0 top-0 z-10 flex -translate-y-full items-center gap-1 rounded-t-md bg-primary px-1.5 py-0.5 text-[11px] font-medium leading-none text-white">
      <GripVertical className="size-3" />
      {ELEMENT_REGISTRY[element.type].label}
    </span>
  ) : null;

  if (element.type === "container") {
    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        onClick={handleClick}
        style={{ ...(element.styles as CSSProperties), ...dndStyle }}
        className={cn(
          "relative cursor-grab outline-2 -outline-offset-2 transition-[outline-color] active:cursor-grabbing",
          isOver
            ? "outline-dashed outline-primary"
            : isSelected
              ? "outline-primary"
              : "outline-transparent hover:outline-primary/40",
        )}
      >
        {handle}
        <ContainerBody container={element} />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      style={dndStyle}
      className={cn(
        "relative cursor-grab outline-2 -outline-offset-2 transition-[outline-color] active:cursor-grabbing",
        isSelected
          ? "outline-primary"
          : "outline-transparent hover:outline-primary/40",
      )}
    >
      {handle}
      <ElementRenderer element={element} mode="edit" />
    </div>
  );
}
