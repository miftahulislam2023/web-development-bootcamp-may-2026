"use client";

import { useEffect, useState } from "react";
import { History, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { listCanvasRevisions, restoreCanvasRevision } from "@/actions/history";
import { Button } from "@/components/ui/Button";

export function SaveHistoryPanel({
  open,
  onClose,
  projectId,
  activePageId,
  onRestore,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    listCanvasRevisions(projectId, activePageId)
      .then(setItems)
      .finally(() => setLoading(false));
  }, [open, projectId, activePageId]);

  async function restore(id) {
    const res = await restoreCanvasRevision(projectId, id);
    if (!res.ok) {
      toast.error(res.error || "Restore failed");
      return;
    }
    onRestore(res.canvasData);
    toast.success("Version restored");
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <div className="flex items-center gap-2">
            <History className="size-4 text-violet-500" />
            <h2 className="font-display text-sm font-bold">Save history</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-[var(--muted)]">
            <X className="size-4" />
          </button>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-4 space-y-2">
          {loading ? (
            <p className="text-sm text-[var(--muted-foreground)]">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-[var(--muted-foreground)]">
              Snapshots are created when you save. Undo/redo still works for quick edits.
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-[var(--border)] p-3"
              >
                <div>
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">
                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                  </div>
                </div>
                <Button size="sm" variant="secondary" onClick={() => restore(item.id)}>
                  Restore
                </Button>
              </div>
            ))
          )}
        </div>
        <div className="border-t border-[var(--border)] p-4 flex justify-end">
          <Button size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
