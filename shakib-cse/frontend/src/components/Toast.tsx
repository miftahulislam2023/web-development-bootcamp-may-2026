"use client";

import React from "react";
import { useToast } from "@/lib/toast";

export default function Toasts() {
  const { toasts, remove } = useToast();

  return (
    <div className="fixed right-4 bottom-6 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`max-w-xs px-4 py-2 rounded shadow-md text-sm text-white ${
            t.type === "success"
              ? "bg-green-600"
              : t.type === "error"
                ? "bg-red-600"
                : "bg-gray-800"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="truncate">{t.message}</div>
            <button
              onClick={() => remove(t.id)}
              className="ml-2 opacity-80 hover:opacity-100"
              aria-label="dismiss"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
