"use client";

import { useEffect, useState } from "react";
import { Folder, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  listMediaAssets,
  deleteMediaAsset,
  uploadMediaAsset,
  registerMediaAsset,
} from "@/actions/media";
import { isClientCloudinaryReady, uploadFileToCloudinary } from "@/lib/cloudinary-client";
import { Button } from "@/components/ui/Button";

const FOLDERS = ["general", "uploads", "heroes", "logos"];

export function MediaLibraryPanel({ open, onClose, projectId, onSelect }) {
  const [assets, setAssets] = useState([]);
  const [folder, setFolder] = useState("general");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const items = await listMediaAssets(projectId, { folder: folder === "all" ? null : folder, q });
      setAssets(items);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) load();
  }, [open, folder, q, projectId]);

  async function onUpload(e) {
    const files = e.target.files;
    if (!files?.length) return;
    for (const file of Array.from(files)) {
      let res;
      if (isClientCloudinaryReady()) {
        try {
          const uploaded = await uploadFileToCloudinary(file, { folder: `nexora/${folder}` });
          res = await registerMediaAsset({
            projectId,
            folder,
            filename: file.name,
            url: uploaded.url,
            publicId: uploaded.publicId,
            mimeType: file.type,
            sizeBytes: uploaded.bytes,
          });
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Upload failed");
          continue;
        }
      } else {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("projectId", projectId);
        fd.append("folder", folder);
        res = await uploadMediaAsset(fd);
      }
      if (!res.ok) toast.error(res.error);
    }
    toast.success("Upload complete");
    load();
  }

  async function onDelete(id) {
    await deleteMediaAsset(id);
    load();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex h-[85vh] w-full max-w-4xl flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <h2 className="font-display font-bold">Media library</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-[var(--muted)]">
            <X className="size-4" />
          </button>
        </div>
        <div className="flex flex-1 min-h-0">
          <aside className="w-40 border-r border-[var(--border)] p-3 space-y-1">
            <button type="button" onClick={() => setFolder("all")} className={`w-full text-left text-xs px-2 py-1.5 rounded ${folder === "all" ? "bg-violet-600/20" : ""}`}>All</button>
            {FOLDERS.map((f) => (
              <button key={f} type="button" onClick={() => setFolder(f)} className={`w-full text-left text-xs px-2 py-1.5 rounded flex items-center gap-1 capitalize ${folder === f ? "bg-violet-600/20" : ""}`}>
                <Folder className="size-3" /> {f}
              </button>
            ))}
          </aside>
          <div className="flex-1 flex flex-col min-h-0 p-4 gap-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2 size-4 opacity-40" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)]" />
              </div>
              <label className="cursor-pointer">
                <span className="inline-flex rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-bold text-white">Upload</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={onUpload} />
              </label>
            </div>
            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {loading ? <p className="text-sm col-span-full">Loading…</p> : null}
              {assets.map((a) => (
                <div key={a.id} className="group relative rounded-lg border border-[var(--border)] overflow-hidden">
                  <button type="button" className="w-full aspect-square" onClick={() => { onSelect?.(a.url, a.altText); onClose(); }}>
                    <img src={a.url} alt={a.altText || a.filename} className="w-full h-full object-cover" />
                  </button>
                  <button type="button" onClick={() => onDelete(a.id)} className="absolute top-1 right-1 p-1 rounded bg-red-500 text-white opacity-0 group-hover:opacity-100">
                    <Trash2 className="size-3" />
                  </button>
                  <p className="text-[10px] truncate px-1 py-0.5">{a.filename}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
