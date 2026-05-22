"use client";

import { useState, useMemo } from "react";
import { 
  Trash2, 
  Copy, 
  Settings2, 
  Palette, 
  Layout as LayoutIcon,
  MousePointer2,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  addChildSection,
  duplicateSection,
  removeSection,
  updateSectionProps,
  updateSectionStyle,
  updateResponsiveStyle,
  setSectionDimensions,
} from "@/redux/slices/builderSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { COMPONENT_LIBRARY } from "@/features/builder/componentLibrary";
import { FONT_OPTIONS } from "@/lib/builder-styles";
import { cn } from "@/utils/cn";
import { 
  TextField, 
  TextAreaField, 
  SelectField, 
  ToggleField, 
  AlignmentField, 
  ColorField 
} from "./EditorFields";
import { ImageUploadField } from "./ImageUploadField";
import { RichTextEditor } from "./RichTextEditor";
import { MediaLibraryPanel } from "./MediaLibraryPanel";

export function BuilderInspector({ projectId }) {
  const dispatch = useAppDispatch();
  const selectedId = useAppSelector((s) => s.builder.selectedSectionId);
  const viewport = useAppSelector((s) => s.builder.viewport);
  const section = useAppSelector((s) =>
    s.builder.document.sections.find((x) => x.id === selectedId),
  );
  
  const [activeTab, setActiveTab] = useState("content");
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaPickHandler, setMediaPickHandler] = useState(null);

  const componentDef = useMemo(() => {
    if (!section) return null;
    return COMPONENT_LIBRARY.find(c => c.type === section.type);
  }, [section]);

  if (!section) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
        <div className="size-12 rounded-2xl bg-[var(--muted)] flex items-center justify-center opacity-20">
          <MousePointer2 className="size-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-display font-bold text-sm">Nothing selected</h3>
          <p className="text-xs text-[var(--muted-foreground)]">
            Select a block on the canvas to customize its properties.
          </p>
        </div>
      </div>
    );
  }

  const onProp = (key, value) => {
    dispatch(updateSectionProps({ id: section.id, props: { [key]: value } }));
  };

  const onStyle = (key, value) => {
    dispatch(updateSectionStyle({ id: section.id, style: { [key]: value } }));
  };

  const onResponsive = (key, value) => {
    dispatch(
      updateResponsiveStyle({
        id: section.id,
        viewport,
        style: { [key]: value },
      }),
    );
  };

  const responsive = section.style?.responsive?.[viewport] || {};

  const schema = componentDef?.schema || [];
  const props = section.props || {};
  const style = section.style || {};

  return (
    <div className="flex h-full flex-col bg-[var(--card)]">
      {/* HEADER */}
      <div className="border-b border-[var(--border)] p-4 bg-[var(--background)]/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex items-center gap-3">
             <div className="size-8 rounded-lg bg-violet-600/10 flex items-center justify-center text-violet-500">
                <LayoutIcon className="size-4" />
             </div>
             <div>
               <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] leading-none mb-1">
                 Component
               </div>
               <div className="font-display font-bold text-sm capitalize">{section.type.replace(/-/g, ' ')}</div>
             </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => dispatch(duplicateSection(section.id))}
              className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors text-[var(--muted-foreground)]"
              title="Duplicate"
            >
              <Copy className="size-4" />
            </button>
            <button
              onClick={() => dispatch(removeSection(section.id))}
              className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-red-500"
              title="Delete"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex p-1 rounded-xl bg-[var(--muted)]">
          {[
            { id: "content", label: "Content", icon: Settings2 },
            { id: "style", label: "Design", icon: Palette },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all",
                activeTab === tab.id 
                  ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm" 
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              )}
            >
              <tab.icon className="size-3" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT SCROLL AREA */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
        {activeTab === "content" && (
          <>
            {schema.filter(f => f.group === "content" || !f.group).length > 0 ? (
              <div className="space-y-4">
                {schema.filter(f => f.group === "content" || !f.group).map(field => (
                  <EditorField 
                    key={field.prop} 
                    field={field} 
                    value={props[field.prop]} 
                    section={section}
                    projectId={projectId}
                    onOpenMedia={(cb) => { setMediaPickHandler(() => cb); setMediaOpen(true); }}
                    onChange={(val) => onProp(field.prop, val)} 
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                 <p className="text-xs text-[var(--muted-foreground)]">No content properties for this block.</p>
              </div>
            )}

            {section.type === "layout-columns" && (
              <div className="space-y-3 pt-4 border-t border-[var(--border)]">
                <div className="text-[10px] font-black uppercase tracking-tighter text-violet-500/50">
                  Nested layout
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="w-full"
                  onClick={() =>
                    dispatch(addChildSection({ parentId: section.id, type: "card-feature", columnIndex: 0 }))
                  }
                >
                  + Add card to column 1
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="w-full"
                  onClick={() =>
                    dispatch(addChildSection({ parentId: section.id, type: "button-cta", columnIndex: 1 }))
                  }
                >
                  + Add button to column 2
                </Button>
              </div>
            )}

            {/* SETTINGS GROUP */}
            {schema.filter(f => f.group === "settings").length > 0 && (
              <div className="space-y-4 pt-6 border-t border-[var(--border)]">
                <div className="text-[10px] font-black uppercase tracking-tighter text-violet-500/50">Settings</div>
                {schema.filter(f => f.group === "settings").map(field => (
                  <EditorField 
                    key={field.prop} 
                    field={field} 
                    value={props[field.prop]} 
                    section={section}
                    projectId={projectId}
                    onOpenMedia={(cb) => { setMediaPickHandler(() => cb); setMediaOpen(true); }}
                    onChange={(val) => onProp(field.prop, val)} 
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "style" && (
          <div className="space-y-6">
            <div className="space-y-4">
               <div className="text-[10px] font-black uppercase tracking-tighter text-violet-500/50">Layout & Spacing</div>
               <div className="grid grid-cols-2 gap-3">
                  <TextField label="Padding Y" value={responsive.paddingY ?? style.paddingY} onChange={(v) => onResponsive("paddingY", Number(v))} />
                  <TextField label="Padding X" value={responsive.paddingX ?? style.paddingX} onChange={(v) => onResponsive("paddingX", Number(v))} />
               </div>
               <TextField label="Max width (px)" value={style.maxWidth} onChange={(v) => onStyle("maxWidth", Number(v))} />
               <TextField label="Min height (px)" value={style.minHeight} onChange={(v) => onStyle("minHeight", Number(v))} />
               <TextField label="Width %" value={style.widthPercent ?? 100} onChange={(v) => onStyle("widthPercent", Number(v))} />
               <TextField label="Border radius (px)" value={style.borderRadius} onChange={(v) => onStyle("borderRadius", Number(v))} />
               <SelectField label="Font" value={style.fontFamily || "inherit"} options={FONT_OPTIONS.map((f) => f.value)} onChange={(v) => onStyle("fontFamily", v)} />
            </div>

            <div className="space-y-4 pt-6 border-t border-[var(--border)]">
               <div className="text-[10px] font-black uppercase tracking-tighter text-violet-500/50">Colors</div>
               <ColorField 
                  label="Background" 
                  value={style.background} 
                  onChange={(val) => onStyle("background", val)} 
               />
               <ColorField 
                  label="Text Color" 
                  value={style.textColor} 
                  onChange={(val) => onStyle("textColor", val)} 
               />
            </div>

            {/* Component Specific Design Props */}
            {schema.filter(f => f.group === "design").length > 0 && (
              <div className="space-y-4 pt-6 border-t border-[var(--border)]">
                <div className="text-[10px] font-black uppercase tracking-tighter text-violet-500/50">Component Design</div>
                {schema.filter(f => f.group === "design").map(field => (
                  <EditorField 
                    key={field.prop} 
                    field={field} 
                    value={props[field.prop]} 
                    section={section}
                    projectId={projectId}
                    onOpenMedia={(cb) => { setMediaPickHandler(() => cb); setMediaOpen(true); }}
                    onChange={(val) => onProp(field.prop, val)} 
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {projectId ? (
        <MediaLibraryPanel
          open={mediaOpen}
          onClose={() => { setMediaOpen(false); setMediaPickHandler(null); }}
          projectId={projectId}
          onSelect={(url) => {
            mediaPickHandler?.(url);
            setMediaOpen(false);
            setMediaPickHandler(null);
          }}
        />
      ) : null}
    </div>
  );
}

function EditorField({ field, value, onChange, section, projectId, onOpenMedia }) {
  switch (field.type) {
    case "text":
      return <TextField label={field.label} value={value} onChange={onChange} />;
    case "textarea":
      return <TextAreaField label={field.label} value={value} onChange={onChange} />;
    case "select":
      return <SelectField label={field.label} value={value} options={field.options || []} onChange={onChange} />;
    case "toggle":
      return <ToggleField label={field.label} value={value} onChange={onChange} />;
    case "alignment":
      return <AlignmentField label={field.label} value={value} onChange={onChange} />;
    case "image":
      return (
        <ImageUploadField
          label={field.label}
          value={value}
          onChange={onChange}
          projectId={projectId}
          onPickLibrary={onOpenMedia ? () => onOpenMedia(onChange) : undefined}
        />
      );
    case "richtext":
      return (
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-[var(--muted-foreground)] px-0.5">{field.label}</label>
          <RichTextEditor sectionId={section.id} html={value} isEditor />
        </div>
      );
    case "color":
      return <ColorField label={field.label} value={value} onChange={onChange} />;
    default:
      return null;
  }
}
