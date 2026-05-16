"use client";

import { useCallback, useState } from "react";
import { ImageIcon, Upload } from "lucide-react";
import { toast } from "sonner";
import { uploadMediaAsset, registerMediaAsset } from "@/actions/media";
import { isClientCloudinaryReady, uploadFileToCloudinary } from "@/lib/cloudinary-client";
import { cn } from "@/utils/cn";

export function ImageUploadField({
  label,
  value,
  onChange,
  projectId,
  altValue,
  onAltChange,
  onPickLibrary,
}) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFiles = useCallback(
    async (files) => {
      if (!files?.length) return;
      setUploading(true);
      try {
        for (const file of Array.from(files)) {
          if (!file.type.startsWith("image/")) continue;

          let res;
          if (isClientCloudinaryReady()) {
            const uploaded = await uploadFileToCloudinary(file, {
              folder: projectId ? `nexora/uploads` : undefined,
            });
            res = await registerMediaAsset({
              projectId: projectId || null,
              folder: "uploads",
              filename: file.name,
              url: uploaded.url,
              publicId: uploaded.publicId,
              mimeType: file.type,
              sizeBytes: uploaded.bytes,
              altText: file.name.replace(/\.[^.]+$/, ""),
            });
          } else {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("projectId", projectId || "");
            fd.append("folder", "uploads");
            res = await uploadMediaAsset(fd);
          }

          if (res.ok) {
            onChange(res.asset.url);
            if (onAltChange && !altValue) onAltChange(file.name.replace(/\.[^.]+$/, ""));
            toast.success("Image uploaded to Cloudinary");
            break;
          } else {
            toast.error(res.error || "Upload failed");
          }
        }
      } finally {
        setUploading(false);
      }
    },
    [projectId, onChange, onAltChange, altValue],
  );

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    uploadFiles(e.dataTransfer.files);
  }

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase text-[var(--muted-foreground)]">{label}</label>
      {value ? (
        <div className="relative aspect-video rounded-lg overflow-hidden border border-[var(--border)] group">
          <img src={value} alt={altValue || "Preview"} className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100"
          >
            Remove
          </button>
        </div>
      ) : null}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          "border-2 border-dashed rounded-xl p-4 text-center transition-colors",
          dragOver ? "border-violet-500 bg-violet-500/10" : "border-[var(--border)]",
        )}
      >
        <Upload className="size-6 mx-auto mb-2 opacity-40" />
        <p className="text-xs text-[var(--muted-foreground)] mb-2">Drag & drop or click to upload</p>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-bold text-white">
          <ImageIcon className="size-3.5" />
          {uploading ? "Uploading…" : "Choose file"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(e) => uploadFiles(e.target.files)}
          />
        </label>
        {onPickLibrary ? (
          <button
            type="button"
            onClick={onPickLibrary}
            className="mt-2 block w-full text-xs font-semibold text-violet-500 hover:underline"
          >
            Choose from media library
          </button>
        ) : null}
      </div>
      <input
        type="text"
        placeholder="Or paste image URL"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs"
      />
      {onAltChange ? (
        <input
          type="text"
          placeholder="Alt text (accessibility)"
          value={altValue || ""}
          onChange={(e) => onAltChange(e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs"
        />
      ) : null}
    </div>
  );
}
