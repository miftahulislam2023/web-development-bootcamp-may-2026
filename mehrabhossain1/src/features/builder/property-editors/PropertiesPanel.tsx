"use client";

import { MousePointer2, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

import {
  ColorField,
  SelectField,
  SpacingField,
  TextField,
  UrlField,
} from "@/features/builder/property-editors/fields";
import { useEditorStore } from "@/features/builder/store/editorStore";
import { ELEMENT_REGISTRY } from "@/lib/builder/defaults";
import { findElement } from "@/lib/builder/tree";
import type {
  ButtonElement,
  ContainerElement,
  ImageElement,
  TextElement,
} from "@/types/builder";

/** A labelled group of related fields. */
function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-[11px] font-semibold uppercase tracking-wide text-fg-subtle">
        {title}
      </h3>
      {children}
    </section>
  );
}

function TextEditor({ element }: { element: TextElement }) {
  const updateProps = useEditorStore((s) => s.updateProps);
  const updateStyles = useEditorStore((s) => s.updateStyles);
  return (
    <>
      <Section title="Content">
        <TextField
          label="Text"
          value={element.props.content}
          onCommit={(v) => updateProps(element.id, { content: v })}
        />
      </Section>
      <Section title="Color">
        <ColorField
          label="Text color"
          value={element.styles.color ?? "#000000"}
          onCommit={(v) => updateStyles(element.id, { color: v })}
        />
      </Section>
    </>
  );
}

function ImageEditor({ element }: { element: ImageElement }) {
  const updateProps = useEditorStore((s) => s.updateProps);
  return (
    <Section title="Image">
      <UrlField
        label="Image URL"
        value={element.props.src}
        onCommit={(v) => updateProps(element.id, { src: v })}
      />
      <TextField
        label="Alt text"
        value={element.props.alt}
        onCommit={(v) => updateProps(element.id, { alt: v })}
      />
    </Section>
  );
}

function ButtonEditor({ element }: { element: ButtonElement }) {
  const updateProps = useEditorStore((s) => s.updateProps);
  const updateStyles = useEditorStore((s) => s.updateStyles);
  return (
    <>
      <Section title="Content">
        <TextField
          label="Label"
          value={element.props.label}
          onCommit={(v) => updateProps(element.id, { label: v })}
        />
        <UrlField
          label="Link"
          value={element.props.href}
          onCommit={(v) => updateProps(element.id, { href: v })}
        />
      </Section>
      <Section title="Colors">
        <ColorField
          label="Background"
          value={element.styles.backgroundColor ?? "#111827"}
          onCommit={(v) => updateStyles(element.id, { backgroundColor: v })}
        />
        <ColorField
          label="Text color"
          value={element.styles.color ?? "#ffffff"}
          onCommit={(v) => updateStyles(element.id, { color: v })}
        />
      </Section>
    </>
  );
}

function ContainerEditor({ element }: { element: ContainerElement }) {
  const updateStyles = useEditorStore((s) => s.updateStyles);
  return (
    <>
      <Section title="Layout">
        <SelectField
          label="Direction"
          value={element.styles.flexDirection ?? "column"}
          options={[
            { value: "column", label: "Vertical" },
            { value: "row", label: "Horizontal" },
          ]}
          onCommit={(v) => updateStyles(element.id, { flexDirection: v })}
        />
      </Section>
      <Section title="Spacing">
        <SpacingField
          label="Padding"
          value={element.styles.padding ?? "0px"}
          onCommit={(v) => updateStyles(element.id, { padding: v })}
        />
        <SpacingField
          label="Gap"
          value={element.styles.gap ?? "0px"}
          onCommit={(v) => updateStyles(element.id, { gap: v })}
        />
      </Section>
      <Section title="Background">
        <ColorField
          label="Color"
          value={element.styles.backgroundColor ?? "#ffffff"}
          onCommit={(v) => updateStyles(element.id, { backgroundColor: v })}
        />
      </Section>
    </>
  );
}

export function PropertiesPanel() {
  const selectedId = useEditorStore((s) => s.selectedId);
  const doc = useEditorStore((s) => s.doc);
  const removeElement = useEditorStore((s) => s.removeElement);
  const select = useEditorStore((s) => s.select);

  const selected = selectedId ? findElement(doc, selectedId) : null;

  if (!selected) {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
        <span className="flex size-10 items-center justify-center rounded-xl bg-surface text-fg-subtle">
          <MousePointer2 className="size-5" />
        </span>
        <p className="text-sm font-medium text-fg">No element selected</p>
        <p className="text-xs text-fg-muted">
          Click an element on the canvas to edit its properties.
        </p>
      </div>
    );
  }

  const meta = ELEMENT_REGISTRY[selected.type];
  const Icon = meta.icon;

  // Keyed by element id so switching selection re-mounts the fields with
  // fresh local state.
  return (
    <div key={selected.id} className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-accent-soft text-primary">
            <Icon className="size-4" />
          </span>
          <span className="text-sm font-semibold text-fg">{meta.label}</span>
        </div>
        <button
          type="button"
          aria-label="Delete element"
          onClick={() => {
            removeElement(selected.id);
            select(null);
          }}
          className="flex size-7 items-center justify-center rounded-md text-fg-subtle transition hover:bg-rose-50 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/40"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      {selected.type === "text" && <TextEditor element={selected} />}
      {selected.type === "image" && <ImageEditor element={selected} />}
      {selected.type === "button" && <ButtonEditor element={selected} />}
      {selected.type === "container" && <ContainerEditor element={selected} />}
    </div>
  );
}
