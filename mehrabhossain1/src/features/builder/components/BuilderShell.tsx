"use client";

import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { Check, Download, Eye, Loader2, Monitor, Save } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { BrandMark } from "@/components/BrandMark";
import { Button, buttonClass } from "@/components/ui/Button";
import { toast } from "@/components/ui/toast";
import { Canvas } from "@/features/builder/components/Canvas";
import { Palette } from "@/features/builder/components/Palette";
import { PropertiesPanel } from "@/features/builder/property-editors/PropertiesPanel";
import { useEditorStore } from "@/features/builder/store/editorStore";
import { updateProject } from "@/features/projects/actions";
import { ElementRenderer } from "@/features/renderer/ElementRenderer";
import { createElement, ELEMENT_REGISTRY } from "@/lib/builder/defaults";
import { createPreset, SECTION_PRESETS } from "@/lib/builder/presets";
import { findElement, findParent } from "@/lib/builder/tree";
import type { ElementType, PageDocument } from "@/types/builder";

/**
 * Resolves a drop target id into a parent container + insertion index:
 * dropping over a container nests into it; dropping over a leaf inserts
 * next to it within its parent.
 */
function resolveDrop(
  doc: PageDocument,
  overId: string,
): { parentId: string; index: number } {
  const overEl = findElement(doc, overId);
  if (overEl?.type === "container") {
    return { parentId: overId, index: overEl.children.length };
  }
  const parent = findParent(doc, overId);
  if (parent) {
    return {
      parentId: parent.id,
      index: parent.children.findIndex((child) => child.id === overId),
    };
  }
  return { parentId: doc.root.id, index: doc.root.children.length };
}

/** Drag ghost for a palette block being dragged onto the canvas. */
function PaletteGhost({ type }: { type: ElementType }) {
  const { icon: Icon, label } = ELEMENT_REGISTRY[type];
  return (
    <div className="flex items-center gap-2 rounded-btn border border-border bg-white px-3 py-2 shadow-pop">
      <span className="flex size-7 items-center justify-center rounded-lg bg-accent-soft text-primary">
        <Icon className="size-4" />
      </span>
      <span className="text-sm font-medium text-fg">{label}</span>
    </div>
  );
}

/** Drag ghost for a section preset being dragged onto the canvas. */
function PresetGhost({ presetKey }: { presetKey: string }) {
  const preset = SECTION_PRESETS.find((p) => p.key === presetKey);
  if (!preset) return null;
  const Icon = preset.icon;
  return (
    <div className="flex items-center gap-2 rounded-btn border border-border bg-white px-3 py-2 shadow-pop">
      <span className="flex size-7 items-center justify-center rounded-lg bg-accent-soft text-primary">
        <Icon className="size-4" />
      </span>
      <span className="text-sm font-medium text-fg">{preset.label}</span>
    </div>
  );
}

/** Toolbar save-state indicator. */
function SaveStatus({ saving, dirty }: { saving: boolean; dirty: boolean }) {
  if (saving) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-fg-muted">
        <Loader2 className="size-3.5 animate-spin" />
        Saving…
      </span>
    );
  }
  if (dirty) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-fg-muted">
        <span className="size-2 rounded-full bg-amber-500" />
        Unsaved changes
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-xs text-fg-muted">
      <Check className="size-3.5 text-primary" />
      All changes saved
    </span>
  );
}

export function BuilderShell({
  projectId,
  projectName,
  initialDoc,
}: {
  projectId: string;
  projectName: string;
  initialDoc: PageDocument;
}) {
  const doc = useEditorStore((s) => s.doc);
  const isDirty = useEditorStore((s) => s.isDirty);
  const addElement = useEditorStore((s) => s.addElement);
  const moveElement = useEditorStore((s) => s.moveElement);
  const setDoc = useEditorStore((s) => s.setDoc);
  const markSaved = useEditorStore((s) => s.markSaved);

  const [saving, setSaving] = useState(false);
  const [draggingType, setDraggingType] = useState<ElementType | null>(null);
  const [draggingElementId, setDraggingElementId] = useState<string | null>(
    null,
  );
  const [draggingPreset, setDraggingPreset] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  // Load the project's document into the store after mount. Effects don't run
  // during SSR, so the server keeps the pristine default doc — server and
  // client first-render produce identical markup (no hydration mismatch).
  useEffect(() => {
    setDoc(initialDoc);
  }, [initialDoc, setDoc]);

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current;
    if (data?.source === "palette") {
      if (data.preset) {
        setDraggingPreset(String(data.preset));
      } else if (data.type) {
        setDraggingType(data.type as ElementType);
      }
    } else if (data?.source === "canvas") {
      setDraggingElementId(String(event.active.id));
    }
  }

  function clearDrag() {
    setDraggingType(null);
    setDraggingElementId(null);
    setDraggingPreset(null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    clearDrag();
    if (!over) return;

    const data = active.data.current;
    const currentDoc = useEditorStore.getState().doc;
    const target = resolveDrop(currentDoc, String(over.id));

    if (data?.source === "palette") {
      if (data.preset) {
        const section = createPreset(String(data.preset));
        if (section) addElement(target.parentId, section, target.index);
        return;
      }
      addElement(
        target.parentId,
        createElement(data.type as ElementType),
        target.index,
      );
      return;
    }

    if (data?.source === "canvas") {
      const activeId = String(active.id);
      if (activeId === String(over.id)) return;
      moveElement(activeId, target.parentId, target.index);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateProject(projectId, useEditorStore.getState().doc);
      markSaved();
      toast.success("Project saved");
    } catch {
      toast.error("Couldn’t save — please try again.");
    } finally {
      setSaving(false);
    }
  }

  const draggingElement = draggingElementId
    ? findElement(doc, draggingElementId)
    : null;

  return (
    <DndContext
      id="builder-dnd"
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={clearDrag}
    >
      {/* Small-screen notice — the builder is a desktop tool. */}
      <div className="flex h-[100dvh] flex-col items-center justify-center gap-4 bg-surface px-6 text-center lg:hidden">
        <Link href="/dashboard">
          <BrandMark />
        </Link>
        <span className="flex size-14 items-center justify-center rounded-2xl bg-accent-soft text-primary">
          <Monitor className="size-7" />
        </span>
        <div>
          <h1 className="text-lg font-semibold text-fg">
            A bigger screen is needed
          </h1>
          <p className="mt-1 max-w-xs text-sm text-fg-muted">
            The drag-and-drop builder works on tablet and desktop. Open this
            project on a wider screen.
          </p>
        </div>
        <Link href="/dashboard" className={buttonClass("secondary", "md")}>
          Back to dashboard
        </Link>
      </div>

      {/* Builder — desktop and up. */}
      <div className="hidden h-[100dvh] flex-col overflow-hidden bg-surface lg:flex">
        {/* Toolbar */}
        <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-white px-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/dashboard" className="shrink-0">
              <BrandMark />
            </Link>
            <span className="h-5 w-px shrink-0 bg-border" />
            <span className="truncate text-sm font-medium text-fg">
              {projectName}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <SaveStatus saving={saving} dirty={isDirty} />
            {/* Preview shows the last saved tree; unsaved edits need a Save
                first. Opens in a new tab so live editor state is kept. */}
            <a
              href={`/preview/${projectId}`}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("secondary", "sm")}
            >
              <Eye className="size-4" />
              Preview
            </a>
            {/* Export downloads the last saved tree as a standalone .html
                file; the attachment header makes the browser download it. */}
            <a
              href={`/api/projects/${projectId}/export`}
              className={buttonClass("secondary", "sm")}
            >
              <Download className="size-4" />
              Export
            </a>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!isDirty || saving}
              loading={saving}
              leftIcon={<Save className="size-4" />}
            >
              Save
            </Button>
          </div>
        </header>

        {/* 3-column body: palette / canvas / properties */}
        <div className="grid min-h-0 flex-1 grid-cols-[248px_1fr_320px]">
          <Palette />
          <Canvas />
          <aside className="overflow-y-auto border-l border-border bg-white p-3">
            <h2 className="px-1 pb-2 text-xs font-semibold uppercase tracking-wide text-fg-subtle">
              Properties
            </h2>
            <PropertiesPanel />
          </aside>
        </div>
      </div>

      <DragOverlay>
        {draggingType ? (
          <PaletteGhost type={draggingType} />
        ) : draggingPreset ? (
          <PresetGhost presetKey={draggingPreset} />
        ) : draggingElement ? (
          <div style={{ opacity: 0.85 }}>
            <ElementRenderer element={draggingElement} mode="preview" />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
