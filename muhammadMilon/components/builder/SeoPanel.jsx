"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { updatePageSeo } from "@/actions/projects";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export function SeoPanel({
  open,
  onClose,
  projectId,
  projectSlug,
  publishedSubdomain,
  activePageId,
  activePageSlug,
  projectSeo,
  pageSeo,
}) {
  const [metaTitle, setMetaTitle] = useState(
    pageSeo?.metaTitle || projectSeo?.metaTitle || "",
  );
  const [metaDescription, setMetaDescription] = useState(
    pageSeo?.metaDescription || projectSeo?.metaDescription || "",
  );
  const [ogImage, setOgImage] = useState(projectSeo?.ogImage || "");
  const [scope, setScope] = useState(activePageId ? "page" : "project");
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  async function onSave() {
    setSaving(true);
    try {
      const res = await updatePageSeo(
        projectId,
        scope === "page" ? activePageId : null,
        { metaTitle, metaDescription, ogImage: scope === "project" ? ogImage : "" },
      );
      if (!res.ok) {
        toast.error(res.error || "Could not save SEO");
        return;
      }
      toast.success("SEO settings saved");
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <h2 className="font-display text-sm font-bold">SEO settings</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-[var(--muted)]">
            <X className="size-4" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          {activePageId ? (
            <div className="flex gap-2 p-1 rounded-lg bg-[var(--muted)]">
              <button
                type="button"
                className={`flex-1 text-xs font-bold py-1.5 rounded-md ${scope === "page" ? "bg-[var(--card)]" : ""}`}
                onClick={() => setScope("page")}
              >
                This page
              </button>
              <button
                type="button"
                className={`flex-1 text-xs font-bold py-1.5 rounded-md ${scope === "project" ? "bg-[var(--card)]" : ""}`}
                onClick={() => setScope("project")}
              >
                Whole site
              </button>
            </div>
          ) : null}
          <div className="space-y-1">
            <Label>Meta title</Label>
            <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} maxLength={70} />
            <p className="text-[10px] text-[var(--muted-foreground)]">{metaTitle.length}/70</p>
          </div>
          <div className="space-y-1">
            <Label>Meta description</Label>
            <textarea
              className="w-full min-h-[80px] rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              maxLength={320}
            />
            <p className="text-[10px] text-[var(--muted-foreground)]">{metaDescription.length}/320</p>
          </div>
          {scope === "project" ? (
            <div className="space-y-1">
              <Label>Open Graph image URL</Label>
              <Input value={ogImage} onChange={(e) => setOgImage(e.target.value)} placeholder="https://…" />
            </div>
          ) : null}
          <div className="rounded-lg bg-[var(--muted)] p-3 text-xs space-y-1">
            <p className="font-semibold">SEO-friendly URLs</p>
            <p className="text-[var(--muted-foreground)]">
              Project: <code className="text-violet-500">/dashboard/projects/{projectSlug}/builder</code>
            </p>
            {publishedSubdomain ? (
              <p className="text-[var(--muted-foreground)]">
                Live: <code className="text-violet-500">/p/{publishedSubdomain}</code>
                {activePageSlug && activePageSlug !== "home" ? ` (home: ${activePageSlug})` : ""}
              </p>
            ) : (
              <p className="text-[var(--muted-foreground)]">Publish to get a public URL at /p/your-subdomain</p>
            )}
          </div>
        </div>
        <div className="border-t border-[var(--border)] p-4 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={onSave} disabled={saving}>
            {saving ? "Saving…" : "Save SEO"}
          </Button>
        </div>
      </div>
    </div>
  );
}
