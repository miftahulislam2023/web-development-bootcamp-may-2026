"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

const labelClass =
  "flex flex-col gap-1.5 text-xs font-medium text-fg-muted";
const inputClass =
  "w-full rounded-field border border-border bg-white px-2.5 py-1.5 text-sm text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30";

interface BaseProps {
  label: string;
  value: string;
  onCommit: (value: string) => void;
}

function TextLikeField({
  label,
  value,
  onCommit,
  type,
}: BaseProps & { type: "text" | "url" }) {
  const [local, setLocal] = useState(value);

  // Debounce: commit to the store 300ms after the last keystroke.
  useEffect(() => {
    if (local === value) return;
    const timer = setTimeout(() => onCommit(local), 300);
    return () => clearTimeout(timer);
  }, [local, value, onCommit]);

  return (
    <label className={labelClass}>
      {label}
      <input
        type={type}
        value={local}
        onChange={(event) => setLocal(event.target.value)}
        className={inputClass}
      />
    </label>
  );
}

export function TextField(props: BaseProps) {
  return <TextLikeField {...props} type="text" />;
}

export function UrlField(props: BaseProps) {
  return <TextLikeField {...props} type="url" />;
}

export function ColorField({ label, value, onCommit }: BaseProps) {
  const [local, setLocal] = useState(value);

  useEffect(() => {
    if (local === value) return;
    const timer = setTimeout(() => onCommit(local), 200);
    return () => clearTimeout(timer);
  }, [local, value, onCommit]);

  return (
    <label className={labelClass}>
      {label}
      <div className="flex items-center gap-2 rounded-field border border-border bg-white p-1.5">
        <input
          type="color"
          value={local || "#000000"}
          onChange={(event) => setLocal(event.target.value)}
          className="size-7 shrink-0 cursor-pointer rounded-md border-0 bg-transparent p-0"
        />
        <span className="font-mono text-xs text-fg-muted">
          {local || "—"}
        </span>
      </div>
    </label>
  );
}

export function SpacingField({ label, value, onCommit }: BaseProps) {
  const [local, setLocal] = useState(() => Number.parseInt(value, 10) || 0);

  useEffect(() => {
    const next = `${local}px`;
    if (next === value) return;
    const timer = setTimeout(() => onCommit(next), 300);
    return () => clearTimeout(timer);
  }, [local, value, onCommit]);

  return (
    <label className={labelClass}>
      {label}
      <div className="relative">
        <input
          type="number"
          min={0}
          value={local}
          onChange={(event) => setLocal(Number(event.target.value))}
          className={`${inputClass} pr-9`}
        />
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-fg-subtle">
          px
        </span>
      </div>
    </label>
  );
}

export function SelectField({
  label,
  value,
  options,
  onCommit,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onCommit: (value: string) => void;
}) {
  return (
    <label className={labelClass}>
      {label}
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onCommit(event.target.value)}
          className={`${inputClass} appearance-none pr-9`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-fg-subtle" />
      </div>
    </label>
  );
}
