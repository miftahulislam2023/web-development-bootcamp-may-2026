"use client";

import { useState } from "react";
import { Copy, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  createPage,
  duplicatePage,
  removePage,
  updatePage,
} from "@/actions/projects";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export function PageManager({
  open,
  onClose,
  projectId,
  pages,
  activePageId,
  onPagesChange,
  onActivePageChange,
}) {
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  function startEdit(page) {
    setEditingId(page.id);
    setTitle(page.title);
    setSlug(page.slug);
  }

  async function saveEdit(pageId) {
    setBusy(true);
    try {
      const res = await updatePage(projectId, pageId, { title, slug });
      if (!res.ok) {
        toast.error(res.error || "Could not update page");
        return;
      }
      onPagesChange(pages.map((p) => (p.id === pageId ? { ...p, ...res.page } : p)));
      setEditingId(null);
      toast.success("Page updated");
    } finally {
      setBusy(false);
    }
  }

  async function onDuplicate(pageId) {
    setBusy(true);
    try {
      const res = await duplicatePage(projectId, pageId);
      if (!res.ok) {
        toast.error(res.error || "Duplicate failed");
        return;
      }
      onPagesChange([...pages, res.page]);
      onActivePageChange(res.page.id);
      toast.success("Page duplicated");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(pageId) {
    if (!confirm("Delete this page?")) return;
    setBusy(true);
    try {
      const res = await removePage(projectId, pageId);
      if (!res.ok) {
        toast.error(res.error || "Delete failed");
        return;
      }
      const next = pages.filter((p) => p.id !== pageId);
      onPagesChange(next);
      if (activePageId === pageId) onActivePageChange(next[0]?.id);
      toast.success("Page deleted");
    } finally {
      setBusy(false);
    }
  }

  async function onCreate() {
    const t = window.prompt("Page title (e.g. About):");
    if (!t?.trim()) return;
    const s = t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setBusy(true);
    try {
      const res = await createPage(projectId, t.trim(), s || "page");
      if (!res.ok) {
        toast.error("Failed to create page");
        return;
      }
      onPagesChange([...pages, res.page]);
      onActivePageChange(res.page.id);
      toast.success("Page created");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <h2 className="font-display text-sm font-bold">Manage pages</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-[var(--muted)]">
            <X className="size-4" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          {pages.map((page) => (
            <div
              key={page.id}
              className="rounded-xl border border-[var(--border)] p-3 space-y-2"
            >
              {editingId === page.id ? (
                <>
                  <div className="space-y-1">
                    <Label>Title</Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Slug</Label>
                    <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" disabled={busy} onClick={() => saveEdit(page.id)}>
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="font-medium text-sm">{page.title}</div>
                    <div className="text-xs text-[var(--muted-foreground)]">/{page.slug}</div>
                    {activePageId === page.id ? (
                      <span className="text-[10px] font-bold uppercase text-violet-500">Active</span>
                    ) : null}
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      title="Edit"
                      className="p-2 rounded-lg hover:bg-[var(--muted)]"
                      onClick={() => startEdit(page)}
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Duplicate"
                      className="p-2 rounded-lg hover:bg-[var(--muted)]"
                      onClick={() => onDuplicate(page.id)}
                      disabled={busy}
                    >
                      <Copy className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      className="p-2 rounded-lg hover:bg-red-500/10 text-red-500"
                      onClick={() => onDelete(page.id)}
                      disabled={busy || pages.length <= 1}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--border)] p-4 flex justify-between">
          <Button variant="secondary" size="sm" onClick={onCreate} disabled={busy}>
            + New page
          </Button>
          <Button size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
