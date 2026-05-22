"use client";

import {
  Copy,
  Edit,
  File,
  FileArchive,
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
  Lock,
  Trash2,
  Unlock,
  Eye,
  Download,
} from "lucide-react";

const formatBytes = (bytes) => {
  if (bytes == null || Number.isNaN(bytes)) return "--";
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const precision = value >= 10 || unitIndex === 0 ? 0 : 1;
  return `${value.toFixed(precision)} ${units[unitIndex]}`;
};

const formatRelativeDate = (dateValue) => {
  if (!dateValue) return "--";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "--";

  const diffMs = date.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);
  const diffMonths = Math.round(diffMs / 2629800000);
  const diffYears = Math.round(diffMs / 31557600000);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(diffMinutes) < 60) return rtf.format(diffMinutes, "minute");
  if (Math.abs(diffHours) < 24) return rtf.format(diffHours, "hour");
  if (Math.abs(diffDays) < 30) return rtf.format(diffDays, "day");
  if (Math.abs(diffMonths) < 12) return rtf.format(diffMonths, "month");
  return rtf.format(diffYears, "year");
};

const getFileIcon = (file) => {
  const type = (file.type || "").toLowerCase();
  const name = (file.name || "").toLowerCase();

  if (type.includes("image")) return FileImage;
  if (type.includes("video")) return FileVideo;
  if (type.includes("audio")) return FileAudio;
  if (type.includes("pdf")) return FileText;
  if (type.includes("text")) return FileText;
  if (name.match(/\.(zip|rar|7z|tar|gz)$/)) return FileArchive;

  return File;
};

const canViewInBrowser = (type) => {
  if (!type) return false;
  const t = type.toLowerCase();
  return (
    t.startsWith("image/") ||
    t.startsWith("video/") ||
    t.startsWith("text/") ||
    t.includes("pdf") ||
    t.startsWith("audio/")
  );
};

export function FileTable({
  files,
  onCopyLink,
  onToggleAccess,
  onRename,
  onDelete,
  onView,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-black/30">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-5 py-4">File</th>
              <th className="px-5 py-4">Size</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => {
              const Icon = getFileIcon(file);
              const isPublic = file.access === "PUBLIC";

              return (
                <tr
                  key={file.id}
                  className="border-b border-zinc-900 last:border-b-0"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-black/40">
                        <Icon className="h-4 w-4 text-zinc-200" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {file.name || "Untitled file"}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {file.type || "Unknown type"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-zinc-300">
                    {formatBytes(file.size)}
                  </td>
                  <td className="px-5 py-4 text-zinc-300">
                    {formatRelativeDate(file.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
                        isPublic
                          ? "border-white/30 bg-white/10 text-white"
                          : "border-zinc-700 bg-black/50 text-zinc-400"
                      }`}
                    >
                      {isPublic ? "Public" : "Private"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onCopyLink?.(file)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-black/40 px-2.5 py-1 text-xs text-zinc-300 transition hover:border-white/40 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        Copy Link
                      </button>
                      {canViewInBrowser(file.type) && (
                        <button
                          type="button"
                          onClick={() => onView?.(file)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-black/40 px-2.5 py-1 text-xs text-zinc-300 transition hover:border-white/40 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>
                      )}
                      <a
                        href={file.url}
                        download={file.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-black/40 px-2.5 py-1 text-xs text-zinc-300 transition hover:border-white/40 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          const newName = window.prompt("Enter new file name: (WARNING: DO NOT CHANGE FILE EXTENSION!)", file.name);
                          if (newName && newName.trim() !== file.name) {
                            onRename?.(file, newName.trim());
                          }
                        }}
                        className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-black/40 px-2.5 py-1 text-xs text-zinc-300 transition hover:border-white/40 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Rename
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleAccess?.(file)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-black/40 px-2.5 py-1 text-xs text-zinc-300 transition hover:border-white/40 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                      >
                        {isPublic ? (
                          <Lock className="h-3.5 w-3.5" />
                        ) : (
                          <Unlock className="h-3.5 w-3.5" />
                        )}
                        {isPublic ? "Make Private" : "Make Public"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const confirmed = window.confirm(
                            "Delete this file from your stash? This cannot be undone.",
                          );
                          if (confirmed) onDelete?.(file);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700 bg-black/40 px-2.5 py-1 text-xs text-zinc-400 transition hover:border-white/40 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
