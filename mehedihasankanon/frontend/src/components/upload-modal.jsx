"use client";

import { useEffect, useState } from "react";
import { File, UploadCloud, X } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
} from "@/components/ui/dialog";
import { UploadDropzone } from "@/lib/uploadthing";

const ENDPOINT = "fileUploader";

export function UploadModal({
  open,
  onOpenChange,
  onUploadComplete,
  onToast,
  folderId,
}) {
  const [progress, setProgress] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setProgress(null);
      setStatus("idle");
      setError("");
    }
  }, [open]);

  const handleComplete = () => {
    setStatus("success");
    setProgress(100);
    onToast?.("File stashed successfully.");
    onUploadComplete?.();
    setTimeout(() => onOpenChange?.(false), 900);
  };

  const handleError = (err) => {
    let message = err?.message || "Upload failed.";
    if (message.includes("FileSizeMismatch") || message.includes("too large")) {
      message = "File too large";
    }
    setError(message);
    setStatus("error");
    onToast?.(message, "error");
  };

  const buildHeaders = () => {
    if (typeof window === "undefined") return {};
    const token = localStorage.getItem("token");
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    if (folderId) headers["x-folder-id"] = String(folderId);
    return headers;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="relative mx-auto w-full max-w-md border border-zinc-800 bg-black p-9 shadow-2xl selection:bg-white selection:text-black">
        <DialogClose className="absolute right-4 top-4 text-zinc-500 transition hover:text-white">
          <X className="h-4 w-4" />
        </DialogClose>

        <div className="rounded-2xl border border-zinc-800 bg-black/40 p-2 shadow-inner">
          <UploadDropzone
            endpoint={ENDPOINT}
            headers={() => buildHeaders()}
            onUploadBegin={() => {
              setError("");
              setStatus("uploading");
              setProgress(0);
            }}
            onUploadProgress={(value) => {
              setStatus("uploading");
              setProgress(value);
            }}
            onClientUploadComplete={handleComplete}
            onUploadError={handleError}
            appearance={{
              container:
                "rounded-2xl border border-dashed border-zinc-800 bg-black/20 px-6 py-12 text-zinc-200 transition-colors hover:bg-white/5",
              uploadIcon: "text-zinc-700",
              label: "text-sm font-semibold text-white",
              allowedContent: "hidden",
              button:
                "mt-6 h-12 w-full rounded-none border border-white bg-white text-xs uppercase tracking-widest font-black !text-black transition-all hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] active:scale-[0.98]",
            }}
            content={{
              uploadIcon: ({ files }) => {
                if (files.length > 0)
                  return (
                    <File className="h-16 w-16 text-white animate-in fade-in zoom-in duration-500" />
                  );
                return <UploadCloud className="h-16 w-16 text-zinc-800" />;
              },
              label: ({ files }) => {
                if (files.length > 0)
                  return (
                    <span className="text-white font-bold tracking-tight animate-in slide-in-from-bottom-2 duration-500">
                      {files[0].name}
                    </span>
                  );
                return "Choose a file or drop it here";
              },
              button: ({ files }) => {
                if (files.length > 0) return "Stash";
                return "Select File";
              },
              allowedContent: null,
            }}
          />
        </div>

        <div className="mt-8 border-t border-zinc-800 pt-8">
          <p className="text-[9px] uppercase tracking-[0.3em] font-black text-zinc-600 text-center">
            file upload max size
          </p>
          <div className="mt-6 grid grid-cols-2 gap-x-10 gap-y-3">
            <div className="flex justify-between text-[10px] text-zinc-500">
              <span className="font-medium uppercase tracking-wider">Images</span>
              <span className="font-black text-zinc-300">2MB</span>
            </div>
            <div className="flex justify-between text-[10px] text-zinc-500">
              <span className="font-medium uppercase tracking-wider">Videos</span>
              <span className="font-black text-zinc-300">32MB</span>
            </div>
            <div className="flex justify-between text-[10px] text-zinc-500">
              <span className="font-medium uppercase tracking-wider">PDFs</span>
              <span className="font-black text-zinc-300">6MB</span>
            </div>
            <div className="flex justify-between text-[10px] text-zinc-500">
              <span className="font-medium uppercase tracking-wider">Audio</span>
              <span className="font-black text-zinc-300">8MB</span>
            </div>
            <div className="flex justify-between text-[10px] text-zinc-500">
              <span className="font-medium uppercase tracking-wider">Text</span>
              <span className="font-black text-zinc-300">100KB</span>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {status === "uploading" && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-900">
                <div
                  className="h-full bg-white transition-all duration-300"
                  style={{ width: `${progress ?? 0}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between items-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Uploading...
                </p>
                <p className="text-[10px] font-black text-white">
                  {Math.round(progress ?? 0)}%
                </p>
              </div>
            </div>
          )}
          {status === "success" && (
            <p className="text-xs font-bold text-center text-white animate-pulse">
              STASHED SUCCESSFULLY
            </p>
          )}
          {error && (
            <p className="text-xs font-bold text-center text-red-500 uppercase tracking-tighter">
              {error}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
