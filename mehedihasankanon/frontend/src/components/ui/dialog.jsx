"use client";

import { createContext, useContext } from "react";

const DialogContext = createContext(null);

export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;

  return (
    <DialogContext.Provider value={{ onOpenChange }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <button
          type="button"
          aria-label="Close dialog"
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => onOpenChange?.(false)}
        />
        <div className="relative z-10 w-full max-w-xl px-4">{children}</div>
      </div>
    </DialogContext.Provider>
  );
}

export function DialogContent({ children, className = "" }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`rounded-xl border border-zinc-800 bg-black/80 p-6 shadow-[0_0_30px_rgba(0,217,255,0.08)] ${className}`}
    >
      {children}
    </div>
  );
}

export function DialogHeader({ children }) {
  return <div className="mb-4 space-y-1">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-lg font-semibold text-white">{children}</h2>;
}

export function DialogDescription({ children }) {
  return <p className="text-sm text-zinc-400">{children}</p>;
}

export function DialogClose({ children, className = "" }) {
  const context = useContext(DialogContext);

  return (
    <button
      type="button"
      className={className}
      onClick={() => context?.onOpenChange?.(false)}
    >
      {children}
    </button>
  );
}
