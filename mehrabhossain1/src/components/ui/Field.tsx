import { useId, type InputHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/cn";

/** Shared input styling — use directly for inputs that have no visible label. */
export const inputClass =
  "h-10 w-full rounded-field border border-border bg-white px-3 text-sm text-fg " +
  "shadow-sm transition placeholder:text-fg-subtle outline-none " +
  "focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:opacity-50";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: ReactNode;
  error?: ReactNode;
}

/** A labelled text input with optional hint and inline error message. */
export function Field({
  label,
  hint,
  error,
  id,
  className,
  ...props
}: FieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-fg">
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          inputClass,
          error
            ? "border-danger focus:border-danger focus:ring-danger/30"
            : null,
          className,
        )}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {hint && !error ? <p className="text-xs text-fg-muted">{hint}</p> : null}
      {error ? (
        <p id={errorId} className="text-xs font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
