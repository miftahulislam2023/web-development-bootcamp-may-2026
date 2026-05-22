"use client";

import { useRef, type ReactNode } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/Button";

function ConfirmButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="danger" loading={pending}>
      {label}
    </Button>
  );
}

interface ConfirmDialogProps {
  /** aria-label for the trigger button. */
  triggerLabel: string;
  triggerClassName?: string;
  /** Visible content of the trigger button (e.g. an icon). */
  triggerChildren: ReactNode;
  title: string;
  description: string;
  confirmLabel: string;
  /** Server action run when the user confirms. */
  action: (formData: FormData) => void | Promise<void>;
}

/**
 * An accessible confirmation modal built on the native `<dialog>` element —
 * focus trapping, Esc-to-close, and top-layer rendering come for free.
 */
export function ConfirmDialog({
  triggerLabel,
  triggerClassName,
  triggerChildren,
  title,
  description,
  confirmLabel,
  action,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        aria-label={triggerLabel}
        onClick={() => dialogRef.current?.showModal()}
        className={triggerClassName}
      >
        {triggerChildren}
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby="confirm-dialog-title"
        onClick={(event) => {
          // A click whose target is the dialog itself is a backdrop click.
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
        className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-modal border border-border bg-white p-0 text-fg shadow-pop backdrop:bg-black/40"
      >
        <form action={action} className="flex flex-col gap-5 p-6">
          <div>
            <h2
              id="confirm-dialog-title"
              className="text-lg font-semibold tracking-tight text-fg"
            >
              {title}
            </h2>
            <p className="mt-1.5 text-sm text-fg-muted">{description}</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => dialogRef.current?.close()}
            >
              Cancel
            </Button>
            <ConfirmButton label={confirmLabel} />
          </div>
        </form>
      </dialog>
    </>
  );
}
