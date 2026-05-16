"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { importTemplateFromJson } from "@/actions/templates-user";
import { Button } from "@/components/ui/Button";

export function ImportTemplateDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [json, setJson] = useState("");
  const [name, setName] = useState("Imported site");
  const [loading, setLoading] = useState(false);

  async function onImport() {
    setLoading(true);
    try {
      const res = await importTemplateFromJson(json, name);
      if (!res.ok) {
        toast.error(res.error || "Import failed");
        return;
      }
      toast.success("Template imported as new project");
      setOpen(false);
      router.push(`/dashboard/projects/${res.project.slug}/builder`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <Button type="button" variant="secondary" size="sm" onClick={() => setOpen(true)}>
        Import JSON
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-4">
        <h3 className="font-display font-bold">Import template JSON</h3>
        <p className="text-xs text-[var(--muted-foreground)]">
          Paste exported canvas JSON with a <code>sections</code> array.
        </p>
        <input
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          className="w-full min-h-[160px] rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs font-mono"
          placeholder='{"version":1,"sections":[...]}'
          value={json}
          onChange={(e) => setJson(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={onImport} disabled={loading || !json.trim()}>
            {loading ? "Importing…" : "Import"}
          </Button>
        </div>
      </div>
    </div>
  );
}
