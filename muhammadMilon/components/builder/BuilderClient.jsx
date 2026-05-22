"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import {
  ArrowLeft,
  Download,
  Monitor,
  Redo2,
  Save,
  Smartphone,
  Tablet,
  Undo2,
  UploadCloud,
  FileText,
  Globe,
  EyeOff,
  Eye,
  History,
  Image,
  Bookmark,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { 
  COMPONENT_PALETTE, 
  createSection, 
  getRecommendedComponents 
} from "@/features/builder/componentRegistry";
import { SectionRenderer } from "@/features/builder/SectionRenderer";
import { updateProjectCanvas, createPage } from "@/actions/projects";
import { publishProject, unpublishProject } from "@/actions/publish";
import { PageManager } from "@/components/builder/PageManager";
import { SeoPanel } from "@/components/builder/SeoPanel";
import { SaveHistoryPanel } from "@/components/builder/SaveHistoryPanel";
import { BuilderPreviewMode } from "@/components/builder/BuilderPreviewMode";
import { MediaLibraryPanel } from "@/components/builder/MediaLibraryPanel";
import { SavedBlocksPanel } from "@/components/builder/SavedBlocksPanel";
import { BuilderViewportProvider } from "@/features/builder/BuilderViewportContext";
import { saveCanvasRevision } from "@/actions/history";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { BuilderInspector } from "@/components/builder/BuilderInspector";
import { CanvasEndDrop } from "@/components/builder/CanvasEndDrop";
import { PaletteItem } from "@/components/builder/PaletteItem";
import { SortableSection } from "@/components/builder/SortableSection";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/common/Logo";
import {
  addSection,
  hydrateFromServer,
  insertSectionAt,
  markSaved,
  redo,
  reorderSections,
  selectSection,
  setViewport,
  setSiteType,
  setPreviewMode,
  undo,
} from "@/redux/slices/builderSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { cn } from "@/utils/cn";

export function BuilderClient({ project }) {
  const dispatch = useAppDispatch();
  const document = useAppSelector((s) => s.builder.document);
  const viewport = useAppSelector((s) => s.builder.viewport);
  const siteType = useAppSelector((s) => s.builder.siteType);
  const selectedId = useAppSelector((s) => s.builder.selectedSectionId);
  const isDirty = useAppSelector((s) => s.builder.isDirty);
  const previewMode = useAppSelector((s) => s.builder.previewMode);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [activeDrag, setActiveDrag] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageManagerOpen, setPageManagerOpen] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [blocksOpen, setBlocksOpen] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const autosaveTimer = useRef(null);

  const [pages, setPages] = useState(project.pages || []);
  const [activePageId, setActivePageId] = useState(project.pages?.[0]?.id || null);
  const activePage = pages.find((p) => p.id === activePageId) || pages[0];
  const isPublished = project.published?.isActive;

  useEffect(() => {
    const activePage = pages.find(p => p.id === activePageId) || pages[0];
    dispatch(
      hydrateFromServer({
        projectId: project.id,
        projectName: project.name,
        viewport: project.viewport || "desktop",
        siteType: project.siteType || "saas",
        canvasData: activePage ? activePage.canvasData : project.canvasData,
      }),
    );
  }, [dispatch, project.id, project.name, project.viewport, project.siteType, activePageId, project.canvasData, pages]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const sectionIds = useMemo(() => document.sections.map((s) => s.id), [document.sections]);

  const handleSave = useCallback(
    async (showAlert = true) => {
      setSaving(true);
      try {
        setPages((prev) =>
          prev.map((p) => (p.id === activePageId ? { ...p, canvasData: document } : p)),
        );
        const res = await updateProjectCanvas(project.id, document, viewport, activePageId);
        if (!res.ok) throw new Error(res.error || "Save failed");
        await saveCanvasRevision(project.id, document, activePageId);
        dispatch(markSaved());
        setLastSavedAt(new Date());
        if (showAlert) toast.success("Saved");
      } catch (e) {
        if (showAlert) toast.error(e instanceof Error ? e.message : "Save failed");
      } finally {
        setSaving(false);
      }
    },
    [activePageId, dispatch, document, project.id, viewport],
  );

  useEffect(() => {
    if (!isDirty) return;
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      handleSave(false);
    }, 8000);
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [document, isDirty, handleSave]);
  
  async function handlePageSwitch(newId) {
    if (newId === "new") {
      const title = window.prompt("New page title (e.g. About):");
      if (!title) return;
      handleSave(false); // auto-save current
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const res = await createPage(project.id, title, slug);
      if (res.ok) {
        setPages([...pages, res.page]);
        setActivePageId(res.page.id);
        toast.success("Page created");
      } else {
        toast.error("Failed to create page");
      }
      return;
    }
    await handleSave(false);
    setActivePageId(newId);
  }

  async function handlePublish() {
    setPublishing(true);
    try {
      await handleSave();
      const res = await publishProject(project.id, project.slug, activePageId);
      if (!res.ok) throw new Error(res.error || "Publish failed");
      const url = `${window.location.origin}/p/${res.published.subdomain}`;
      toast.success("Published", { description: url });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Publish failed");
    } finally {
      setPublishing(false);
    }
  }

  async function handleUnpublish() {
    if (!confirm("Unpublish this site? Visitors will no longer see it.")) return;
    setPublishing(true);
    try {
      const res = await unpublishProject(project.id);
      if (!res.ok) throw new Error(res.error || "Unpublish failed");
      toast.success("Site unpublished (draft)");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Unpublish failed");
    } finally {
      setPublishing(false);
    }
  }

  async function handleExportZip() {
    toast.loading("Building ZIP…", { id: "export-zip" });
    try {
      const res = await fetch("/api/projects/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Export failed");
      }
      const blob = await res.blob();
      if (!blob.size) throw new Error("ZIP file is empty");
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement("a");
      a.href = url;
      a.download = `${project.slug || "nexora-site"}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("ZIP exported (index.html, style.css, script.js)", { id: "export-zip" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Export failed", { id: "export-zip" });
    }
  }

  function onDragStart(event) {
    const { active } = event;
    if (active.data.current?.fromPalette) {
      setActiveDrag({ kind: "palette", type: active.data.current.type });
    } else {
      const sec = document.sections.find((s) => s.id === active.id);
      setActiveDrag({ kind: "sort", section: sec });
    }
  }

  function onDragEnd(event) {
    const { active, over } = event;
    setActiveDrag(null);
    if (!over) return;

    if (active.data.current?.fromPalette) {
      const type = active.data.current.type;
      if (String(over.id) === "canvas-end") {
        dispatch(addSection({ type }));
        return;
      }
      const overIndex = document.sections.findIndex((s) => s.id === over.id);
      if (overIndex >= 0) {
        dispatch(insertSectionAt({ index: overIndex, type }));
      }
      return;
    }

    if (active.id !== over.id) {
      dispatch(reorderSections({ activeId: active.id, overId: over.id }));
    }
  }

  const previewWidth =
    viewport === "mobile" ? "min-w-[320px] max-w-[390px]" : viewport === "tablet" ? "max-w-[768px]" : "max-w-5xl";

  return (
    <BuilderViewportProvider viewport={viewport}>
    <div className="flex h-[100dvh] flex-col bg-[var(--background)] text-[var(--foreground)]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--card)] px-4 py-3">
        <div className="flex min-w-[200px] items-center gap-3">
          <Link
            href="/dashboard"
            aria-label="Back to dashboard"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-transparent text-[var(--foreground)] hover:bg-[var(--muted)]"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <Logo size="sm" className="hidden lg:flex" />
          <div className="hidden sm:block">
            <div className="text-[10px] uppercase tracking-wide text-[var(--muted-foreground)]">
              Project
            </div>
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-semibold">{project.name}</span>
              <Link
                href={`/dashboard/projects/${project.slug}/settings`}
                className="text-[10px] font-medium text-[var(--accent)] hover:underline"
              >
                Settings
              </Link>
            </div>
          </div>
          <div className="h-6 w-[1px] bg-[var(--border)] hidden lg:block mx-1"></div>
          
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-[var(--muted-foreground)]" />
            <select
              value={activePageId || ""}
              onChange={(e) => handlePageSwitch(e.target.value)}
              className="bg-transparent text-sm font-medium outline-none cursor-pointer border border-transparent hover:border-[var(--border)] rounded px-1 py-0.5 transition-colors"
            >
              {pages.map((p) => (
                <option key={p.id} value={p.id} className="bg-[var(--background)] text-[var(--foreground)]">
                  {p.title || p.slug}
                </option>
              ))}
              <option value="new" className="bg-[var(--background)] text-[var(--foreground)]">
                + New Page
              </option>
            </select>
            <button
              type="button"
              onClick={() => setPageManagerOpen(true)}
              className="text-[10px] font-bold uppercase text-violet-500 hover:underline"
            >
              Manage
            </button>
            <span
              className={cn(
                "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full",
                isPublished ? "bg-emerald-500/15 text-emerald-600" : "bg-amber-500/15 text-amber-700",
              )}
            >
              {isPublished ? "Published" : "Draft"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="mr-1 flex items-center rounded-xl border border-[var(--border)] p-1">
            <Button
              type="button"
              variant={viewport === "desktop" ? "primary" : "ghost"}
              size="sm"
              className="px-2"
              onClick={() => dispatch(setViewport("desktop"))}
              aria-label="Desktop preview"
            >
              <Monitor className="size-4" />
            </Button>
            <Button
              type="button"
              variant={viewport === "tablet" ? "primary" : "ghost"}
              size="sm"
              className="px-2"
              onClick={() => dispatch(setViewport("tablet"))}
              aria-label="Tablet preview"
            >
              <Tablet className="size-4" />
            </Button>
            <Button
              type="button"
              variant={viewport === "mobile" ? "primary" : "ghost"}
              size="sm"
              className="px-2"
              onClick={() => dispatch(setViewport("mobile"))}
              aria-label="Mobile preview"
            >
              <Smartphone className="size-4" />
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => dispatch(undo())}
            aria-label="Undo"
          >
            <Undo2 className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => dispatch(redo())}
            aria-label="Redo"
          >
            <Redo2 className="size-4" />
          </Button>
          <ThemeToggle />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleExportZip}
          >
            <Download className="mr-1 size-4" />
            Export ZIP
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleSave}
            disabled={saving || !isDirty}
          >
            <Save className="mr-1 size-4" />
            {saving ? "Saving…" : "Save"}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setHistoryOpen(true)}>
            <History className="mr-1 size-4" />
            History
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setMediaOpen(true)}>
            <Image className="mr-1 size-4" />
            Media
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setBlocksOpen(true)}>
            <Bookmark className="mr-1 size-4" />
            Blocks
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => dispatch(setPreviewMode(previewMode ? null : "inline"))}
          >
            <Eye className="mr-1 size-4" />
            Preview
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => dispatch(setPreviewMode("fullscreen"))}
            title="Fullscreen preview"
          >
            Fullscreen
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setSeoOpen(true)}>
            <Globe className="mr-1 size-4" />
            SEO
          </Button>
          {isPublished ? (
            <Button type="button" variant="secondary" size="sm" onClick={handleUnpublish} disabled={publishing}>
              <EyeOff className="mr-1 size-4" />
              Unpublish
            </Button>
          ) : null}
          <Button type="button" size="sm" onClick={handlePublish} disabled={publishing}>
            <UploadCloud className="mr-1 size-4" />
            {publishing ? "Publishing…" : "Publish"}
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-80 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--card)] lg:flex">
          {/* Component Selection Header */}
          <div className="border-b border-[var(--border)] p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-bold">Components</span>
              <select 
                value={siteType}
                onChange={(e) => dispatch(setSiteType(e.target.value))}
                className="bg-[var(--muted)] text-[10px] rounded px-1.5 py-0.5 border-none outline-none font-semibold uppercase tracking-wider"
              >
                <option value="saas">SaaS</option>
                <option value="ecommerce">Ecommerce</option>
                <option value="portfolio">Portfolio</option>
                <option value="agency">Agency</option>
                <option value="blog">Blog</option>
              </select>
            </div>
            <input 
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          {/* Component List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {/* Recommended Section */}
            {!searchQuery && (
              <div className="p-3">
                <div className="text-[10px] font-bold uppercase text-violet-500 mb-2 px-1">Recommended for {siteType}</div>
                <div className="grid grid-cols-1 gap-1">
                  {getRecommendedComponents(siteType).slice(0, 4).map(c => (
                    <div key={c.type} className="group relative">
                      <PaletteItem type={c.type} label={c.label} />
                      <button 
                        onClick={() => dispatch(addSection({ type: c.type }))}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <UploadCloud className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Categorized Sections */}
            {["Layout", "Marketing", "Basic", "SaaS", "Ecommerce", "Portfolio", "Agency"].map(cat => {
              const filtered = COMPONENT_PALETTE.filter(c => 
                c.category === cat && 
                (!searchQuery || c.label.toLowerCase().includes(searchQuery.toLowerCase()))
              );
              if (filtered.length === 0) return null;

              return (
                <div key={cat} className="p-3 pt-1">
                  <div className="text-[10px] font-bold uppercase text-[var(--muted-foreground)] mb-2 px-1">{cat}</div>
                  <div className="grid grid-cols-1 gap-1">
                    {filtered.map(c => (
                      <div key={c.type} className="group relative">
                        <PaletteItem type={c.type} label={c.label} />
                        <button 
                          onClick={() => dispatch(addSection({ type: c.type }))}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <UploadCloud className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragCancel={() => setActiveDrag(null)}
        >
          <main
            className="min-h-0 flex-1 overflow-y-auto builder-canvas"
            onClick={() => dispatch(selectSection(null))}
          >
            <div className="mx-auto w-full px-4 py-6 transition-all">
              <div className={cn("mx-auto w-full", previewWidth)}>
                <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
                  <div className="flex flex-col gap-4">
                    {document.sections.map((section) => (
                      <div
                        key={section.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(selectSection(section.id));
                        }}
                      >
                        <SortableSection
                          section={section}
                          selected={selectedId === section.id}
                          isEditor
                          onSelect={(id) => dispatch(selectSection(id))}
                        />
                      </div>
                    ))}
                    <CanvasEndDrop />
                  </div>
                </SortableContext>
              </div>
            </div>
          </main>

          <DragOverlay dropAnimation={null}>
            {activeDrag?.kind === "palette" ? (
              <div className="rounded-xl border border-[var(--accent)] bg-[var(--card)] px-3 py-2 text-sm shadow-lg">
                {COMPONENT_PALETTE.find((c) => c.type === activeDrag.type)?.label}
              </div>
            ) : activeDrag?.kind === "sort" && activeDrag.section ? (
              <div className="opacity-90">
                <SectionRenderer section={activeDrag.section} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        <aside className="hidden w-[340px] shrink-0 border-l border-[var(--border)] bg-[var(--card)] xl:block">
          <BuilderInspector projectId={project.id} />
        </aside>
      </div>

      <div className="border-t border-[var(--border)] px-4 py-2 text-center text-xs text-[var(--muted-foreground)]">
        {isDirty
          ? "Unsaved changes — auto-save in ~8s or click Save."
          : lastSavedAt
            ? `All changes saved · ${lastSavedAt.toLocaleTimeString()}`
            : "All changes saved"}
      </div>

      <PageManager
        open={pageManagerOpen}
        onClose={() => setPageManagerOpen(false)}
        projectId={project.id}
        pages={pages}
        activePageId={activePageId}
        onPagesChange={setPages}
        onActivePageChange={setActivePageId}
      />
      <SeoPanel
        open={seoOpen}
        onClose={() => setSeoOpen(false)}
        projectId={project.id}
        projectSlug={project.slug}
        publishedSubdomain={project.published?.subdomain}
        activePageId={activePageId}
        activePageSlug={activePage?.slug}
        projectSeo={{
          metaTitle: project.metaTitle,
          metaDescription: project.metaDescription,
          ogImage: project.ogImage,
        }}
        pageSeo={{
          metaTitle: activePage?.metaTitle,
          metaDescription: activePage?.metaDescription,
        }}
      />
      <SaveHistoryPanel
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        projectId={project.id}
        activePageId={activePageId}
        onRestore={(canvas) => {
          dispatch(hydrateFromServer({
            projectId: project.id,
            projectName: project.name,
            viewport,
            siteType,
            canvasData: canvas,
          }));
        }}
      />
      <MediaLibraryPanel
        open={mediaOpen}
        onClose={() => setMediaOpen(false)}
        projectId={project.id}
      />
      <SavedBlocksPanel
        open={blocksOpen}
        onClose={() => setBlocksOpen(false)}
        projectId={project.id}
      />
      <BuilderPreviewMode
        mode={previewMode}
        onClose={() => dispatch(setPreviewMode(null))}
        document={document}
        viewport={viewport}
        projectSlug={project.slug}
        publishedSubdomain={project.published?.subdomain}
      />
    </div>
    </BuilderViewportProvider>
  );
}
