"use client";

import { useDraggable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ELEMENT_REGISTRY, PALETTE } from "@/lib/builder/defaults";
import { SECTION_PRESETS } from "@/lib/builder/presets";
import { cn } from "@/lib/cn";
import type { ElementType } from "@/types/builder";

const tileBase =
  "group flex w-full cursor-grab items-center gap-3 rounded-xl border bg-white p-3 text-left transition active:cursor-grabbing";

/** Shared visual content of a draggable palette tile. */
function TileContent({
  icon: Icon,
  label,
  description,
}: {
  icon: LucideIcon;
  label: string;
  description: string;
}) {
  return (
    <>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-primary">
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-fg">{label}</span>
        <span className="block truncate text-xs text-fg-subtle">
          {description}
        </span>
      </span>
      <GripVertical className="size-4 shrink-0 text-fg-subtle/60" />
    </>
  );
}

function PaletteItem({ type }: { type: ElementType }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { source: "palette", type },
  });

  const { icon, label, description } = ELEMENT_REGISTRY[type];

  return (
    <button
      ref={setNodeRef}
      type="button"
      {...attributes}
      {...listeners}
      className={cn(
        tileBase,
        isDragging
          ? "border-primary/40 opacity-50"
          : "border-border hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card",
      )}
    >
      <TileContent icon={icon} label={label} description={description} />
    </button>
  );
}

function PresetItem({ presetKey }: { presetKey: string }) {
  const preset = SECTION_PRESETS.find((p) => p.key === presetKey)!;

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `preset-${presetKey}`,
    data: { source: "palette", preset: presetKey },
  });

  return (
    <button
      ref={setNodeRef}
      type="button"
      {...attributes}
      {...listeners}
      className={cn(
        tileBase,
        isDragging
          ? "border-primary/40 opacity-50"
          : "border-border hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card",
      )}
    >
      <TileContent
        icon={preset.icon}
        label={preset.label}
        description={preset.description}
      />
    </button>
  );
}

function GroupHeading({ children }: { children: string }) {
  return (
    <h2 className="px-1 pb-2 text-xs font-semibold uppercase tracking-wide text-fg-subtle">
      {children}
    </h2>
  );
}

export function Palette() {
  return (
    <aside className="overflow-y-auto border-r border-border bg-white p-3">
      <GroupHeading>Blocks</GroupHeading>
      <div className="flex flex-col gap-2">
        {PALETTE.map((type) => (
          <PaletteItem key={type} type={type} />
        ))}
      </div>

      <div className="pt-5">
        <GroupHeading>Sections</GroupHeading>
        <div className="flex flex-col gap-2">
          {SECTION_PRESETS.map((preset) => (
            <PresetItem key={preset.key} presetKey={preset.key} />
          ))}
        </div>
      </div>
    </aside>
  );
}
