"use client";

import { cn } from "@/utils/cn";
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  ChevronDown, 
  Image as ImageIcon,
  Type,
  Maximize
} from "lucide-react";

/**
 * Shared Input styles for the inspector
 */
const fieldBase = "w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-violet-500 transition-all";

export function TextField({ label, value, onChange }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold uppercase text-[var(--muted-foreground)] px-0.5">{label}</label>
      <input 
        type="text" 
        value={value || ""} 
        onChange={(e) => onChange(e.target.value)} 
        className={fieldBase}
      />
    </div>
  );
}

export function TextAreaField({ label, value, onChange }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold uppercase text-[var(--muted-foreground)] px-0.5">{label}</label>
      <textarea 
        value={value || ""} 
        onChange={(e) => onChange(e.target.value)} 
        className={cn(fieldBase, "min-h-[60px] py-2")}
      />
    </div>
  );
}

export function SelectField({ label, value, options, onChange }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold uppercase text-[var(--muted-foreground)] px-0.5">{label}</label>
      <div className="relative">
        <select 
          value={value || ""} 
          onChange={(e) => onChange(e.target.value)} 
          className={cn(fieldBase, "appearance-none pr-8")}
        >
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3 opacity-40 pointer-events-none" />
      </div>
    </div>
  );
}

export function ToggleField({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-1 px-0.5">
      <label className="text-[10px] font-bold uppercase text-[var(--muted-foreground)]">{label}</label>
      <button 
        onClick={() => onChange(!value)}
        className={cn(
          "relative h-5 w-9 rounded-full transition-colors outline-none",
          value ? "bg-violet-600" : "bg-[var(--muted)]"
        )}
      >
        <div className={cn(
          "absolute top-1 size-3 rounded-full bg-white transition-all",
          value ? "left-5" : "left-1"
        )} />
      </button>
    </div>
  );
}

export function AlignmentField({ label, value, onChange }) {
  const options = [
    { icon: AlignLeft, value: "left" },
    { icon: AlignCenter, value: "center" },
    { icon: AlignRight, value: "right" }
  ];
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold uppercase text-[var(--muted-foreground)] px-0.5">{label}</label>
      <div className="flex gap-1">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex-1 flex items-center justify-center h-8 rounded-md border border-[var(--border)] transition-all",
              value === opt.value ? "bg-violet-600/10 border-violet-600/50 text-violet-400" : "hover:bg-[var(--muted)] text-[var(--muted-foreground)]"
            )}
          >
            <opt.icon className="size-4" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function ImageField({ label, value, onChange }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold uppercase text-[var(--muted-foreground)] px-0.5">{label}</label>
      <div className="flex flex-col gap-2">
        {value && (
          <div className="aspect-video w-full rounded-lg overflow-hidden border border-[var(--border)] relative group">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <button 
                onClick={() => onChange("")}
                className="bg-red-500 text-white p-1 rounded-md text-[10px] font-bold"
               >
                 Remove
               </button>
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Image URL..." 
            value={value || ""} 
            onChange={(e) => onChange(e.target.value)} 
            className={cn(fieldBase, "flex-1")}
          />
          <button className="h-8 px-2 rounded-md bg-[var(--muted)] border border-[var(--border)] hover:bg-[var(--border)] transition-colors">
            <ImageIcon className="size-4 text-[var(--muted-foreground)]" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ColorField({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-1 px-0.5">
      <label className="text-[10px] font-bold uppercase text-[var(--muted-foreground)]">{label}</label>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono opacity-50 uppercase">{value || "Auto"}</span>
        <div className="relative size-6 rounded-md border border-[var(--border)] overflow-hidden cursor-pointer">
          <input 
            type="color" 
            value={value || "#000000"} 
            onChange={(e) => onChange(e.target.value)} 
            className="absolute -inset-1 size-10 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
