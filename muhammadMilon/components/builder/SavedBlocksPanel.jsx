"use client";

import { useEffect, useState } from "react";
import { Bookmark, Globe, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { listSavedBlocks, saveBlock, deleteSavedBlock, updateGlobalBlock } from "@/actions/blocks";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { addSection, updateSectionProps } from "@/redux/slices/builderSlice";
import { createId } from "@/utils/id";
import { Button } from "@/components/ui/Button";

export function SavedBlocksPanel({ open, onClose, projectId }) {
  const dispatch = useAppDispatch();
  const selectedId = useAppSelector((s) => s.builder.selectedSectionId);
  const section = useAppSelector((s) =>
    s.builder.document.sections.find((x) => x.id === selectedId),
  );
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    if (open) listSavedBlocks(projectId).then(setBlocks);
  }, [open, projectId]);

  async function onSaveCurrent() {
    if (!section) {
      toast.error("Select a section to save");
      return;
    }
    const name = window.prompt("Block name:");
    if (!name) return;
    const isGlobal = window.confirm("Save as global block? (updates sync when you edit globally)");
    const res = await saveBlock(projectId, name, section, isGlobal);
    if (res.ok) {
      toast.success("Block saved");
      setBlocks(await listSavedBlocks(projectId));
    }
  }

  function insertBlock(block) {
    const copy = JSON.parse(JSON.stringify(block.sectionData));
    copy.id = createId();
    dispatch(addSection({ section: copy }));
    toast.success("Block inserted");
    onClose();
  }

  async function syncGlobal(block) {
    if (!section || section.type !== block.sectionData?.type) {
      toast.error("Select a matching section to push global updates");
      return;
    }
    await updateGlobalBlock(block.blockKey, section);
    toast.success("Global block template updated");
    setBlocks(await listSavedBlocks(projectId));
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="font-display font-bold flex items-center gap-2">
            <Bookmark className="size-4" /> Saved blocks
          </h2>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--muted)]">
            <X className="size-4" />
          </button>
        </div>
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          <Button size="sm" className="w-full" onClick={onSaveCurrent} disabled={!section}>
            Save selected section
          </Button>
          {blocks.length === 0 ? (
            <p className="text-sm text-[var(--muted-foreground)]">No saved blocks yet.</p>
          ) : (
            blocks.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-2 rounded-xl border border-[var(--border)] p-3">
                <div>
                  <div className="font-medium text-sm">{b.name}</div>
                  <div className="text-xs opacity-60 capitalize">{b.sectionData?.type}</div>
                  {b.isGlobal ? (
                    <span className="text-[10px] text-violet-500 flex items-center gap-1">
                      <Globe className="size-3" /> Global
                    </span>
                  ) : null}
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="secondary" onClick={() => insertBlock(b)}>Use</Button>
                  <Button size="sm" variant="ghost" onClick={() => insertBlock(b)} title="Duplicate insert">
                    Dup
                  </Button>
                  {b.isGlobal ? (
                    <Button size="sm" variant="ghost" onClick={() => syncGlobal(b)} title="Update global template">
                      Sync
                    </Button>
                  ) : null}
                  <button type="button" onClick={async () => { await deleteSavedBlock(b.id); setBlocks(await listSavedBlocks(projectId)); }} className="p-2 text-red-500">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
