"use client";

import { CircleAlert, CircleCheck, X } from "lucide-react";
import { useEffect } from "react";
import { create } from "zustand";

import { cn } from "@/lib/cn";

type ToastVariant = "success" | "error";

interface Toast {
  id: string;
  variant: ToastVariant;
  message: string;
}

interface ToastStore {
  toasts: Toast[];
  add: (variant: ToastVariant, message: string) => void;
  dismiss: (id: string) => void;
}

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (variant, message) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { id: crypto.randomUUID(), variant, message },
      ],
    })),
  dismiss: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));

/** Fire-and-forget toast notifications, callable from anywhere. */
export const toast = {
  success: (message: string) =>
    useToastStore.getState().add("success", message),
  error: (message: string) => useToastStore.getState().add("error", message),
};

function ToastItem({ data }: { data: Toast }) {
  const dismiss = useToastStore((s) => s.dismiss);

  // Auto-dismiss after a few seconds.
  useEffect(() => {
    const timer = setTimeout(() => dismiss(data.id), 4000);
    return () => clearTimeout(timer);
  }, [data.id, dismiss]);

  const isError = data.variant === "error";

  return (
    <div
      className={cn(
        "animate-toast-in pointer-events-auto flex items-center gap-2.5 rounded-xl border bg-white px-3.5 py-3 shadow-pop",
        isError ? "border-danger/20" : "border-primary/20",
      )}
    >
      {isError ? (
        <CircleAlert className="size-5 shrink-0 text-danger" />
      ) : (
        <CircleCheck className="size-5 shrink-0 text-primary" />
      )}
      <p className="text-sm font-medium text-fg">{data.message}</p>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => dismiss(data.id)}
        className="ml-2 text-fg-subtle transition hover:text-fg"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

/** Renders the active toast stack — mount once near the app root. */
export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((data) => (
        <ToastItem key={data.id} data={data} />
      ))}
    </div>
  );
}
