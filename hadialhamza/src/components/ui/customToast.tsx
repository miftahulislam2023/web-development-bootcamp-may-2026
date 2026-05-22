"use client";

import React from "react";
import { toast } from "sonner";
import {
  XCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "./Button";

type ToastType = "success" | "error" | "warning" | "info" | "loading";

interface ToastStyle {
  bg: string;
  icon: React.ReactNode;
  titleColor: string;
  descColor: string;
  closeColor: string;
}

const styles: Record<ToastType, ToastStyle> = {
  success: {
    bg: "bg-success/10 dark:bg-card border-success/30",
    icon: (
      <CheckCircle2
        className="h-5.5 w-5.5 shrink-0 text-success"
        strokeWidth={2}
      />
    ),
    titleColor: "text-foreground",
    descColor: "text-muted-foreground",
    closeColor: "text-muted-foreground hover:bg-success/10 hover:text-success",
  },
  error: {
    bg: "bg-destructive/10 dark:bg-card border-destructive/30 backdrop-blur-md",
    icon: (
      <XCircle
        className="h-5.5 w-5.5 shrink-0 text-destructive"
        strokeWidth={2}
      />
    ),
    titleColor: "text-foreground",
    descColor: "text-muted-foreground",
    closeColor:
      "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
  },
  warning: {
    bg: "bg-warning/10 dark:bg-card border-warning/30 backdrop-blur-md",
    icon: (
      <AlertTriangle
        className="h-5.5 w-5.5 shrink-0 text-warning"
        strokeWidth={2}
      />
    ),
    titleColor: "text-foreground",
    descColor: "text-muted-foreground",
    closeColor: "text-muted-foreground hover:bg-warning/10 hover:text-warning",
  },
  info: {
    bg: "bg-info/10 dark:bg-card border-info/30 backdrop-blur-md",
    icon: <Info className="h-5.5 w-5.5 shrink-0 text-info" strokeWidth={2} />,
    titleColor: "text-foreground",
    descColor: "text-muted-foreground",
    closeColor: "text-muted-foreground hover:bg-info/10 hover:text-info",
  },
  loading: {
    bg: "bg-background dark:bg-card border-border backdrop-blur-md",
    icon: (
      <Loader2
        className="h-5.5 w-5.5 shrink-0 text-primary animate-spin"
        strokeWidth={2}
      />
    ),
    titleColor: "text-foreground",
    descColor: "text-muted-foreground",
    closeColor: "text-muted-foreground hover:bg-muted",
  },
};

function showToast(type: ToastType, title: string, description?: string) {
  const s = styles[type];

  return toast.custom(
    (toastId) => (
      <div
        className={`flex w-full items-center justify-between gap-4 rounded-2xl border px-4 py-3 shadow-sm ${s.bg}`}
      >
        <div className="flex items-center gap-3">
          {s.icon}
          <div className="flex flex-col gap-0.5">
            <h3 className={`text-[15px] font-medium ${s.titleColor}`}>
              {title}
            </h3>
            {description && (
              <p className={`text-[13px] ${s.descColor}`}>{description}</p>
            )}
          </div>
        </div>

        {/* Close button */}
        {type !== "loading" && (
          <button
            onClick={() => toast.dismiss(toastId)}
            className={`shrink-0 rounded-md p-1 transition-colors ${s.closeColor}`}
            aria-label="Close"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        )}
      </div>
    ),
    {
      duration: type === "loading" ? Infinity : 4000,
    },
  );
}

export const customToast = {
  success: (title: string, desc?: string) => showToast("success", title, desc),
  error: (title: string, desc?: string) => showToast("error", title, desc),
  warning: (title: string, desc?: string) => showToast("warning", title, desc),
  info: (title: string, desc?: string) => showToast("info", title, desc),
  loading: (title: string, desc?: string) => showToast("loading", title, desc),

  // Confirmation toast
  confirm: (title: string, desc: string, onConfirm: () => void) => {
    const s = styles.warning;

    return toast.custom(
      (toastId) => (
        <div
          className={`flex w-full items-center justify-between gap-4 rounded-2xl border px-4 py-3 shadow-md ${s.bg}`}
        >
          <div className="flex items-center gap-3">
            {s.icon}
            <div className="flex flex-col gap-0.5">
              <h3 className={`text-[15px] font-medium ${s.titleColor}`}>
                {title}
              </h3>
              {desc && <p className={`text-[13px] ${s.descColor}`}>{desc}</p>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={() => {
                onConfirm();
                toast.dismiss(toastId);
              }}
              className="px-3 py-1.5 text-[10px] uppercase"
            >
              Confirm
            </Button>
            <Button
              onClick={() => toast.dismiss(toastId)}
              variant={"outline"}
              className="px-3 py-1.5 text-[10px] uppercase"
            >
              Cancel
            </Button>
          </div>
        </div>
      ),
      { duration: 10000, position: "top-center" },
    );
  },

  dismiss: (id: string | number) => toast.dismiss(id),
};
