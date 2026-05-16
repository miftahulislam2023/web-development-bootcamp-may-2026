"use client";

import { useRef } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  Heading2,
} from "lucide-react";
import { useAppDispatch } from "@/hooks/useRedux";
import { updateSectionPropsLive } from "@/redux/slices/builderSlice";
import { cn } from "@/utils/cn";

function exec(cmd, value = null) {
  document.execCommand(cmd, false, value);
}

export function RichTextEditor({ sectionId, html, isEditor, className }) {
  const dispatch = useAppDispatch();
  const ref = useRef(null);

  function sync() {
    const val = ref.current?.innerHTML ?? "";
    dispatch(updateSectionPropsLive({ id: sectionId, props: { html: val } }));
  }

  function addLink() {
    const url = window.prompt("Link URL:", "https://");
    if (url) exec("createLink", url);
    sync();
  }

  if (!isEditor) {
    return (
      <div className={cn("prose prose-invert max-w-none", className)} dangerouslySetInnerHTML={{ __html: html || "<p>Rich text content</p>" }} />
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-1 rounded-lg border border-[var(--border)] bg-[var(--muted)] p-1">
        {[
          { icon: Bold, cmd: "bold" },
          { icon: Italic, cmd: "italic" },
          { icon: Heading2, cmd: () => exec("formatBlock", "h2") },
          { icon: List, cmd: () => exec("insertUnorderedList") },
          { icon: ListOrdered, cmd: () => exec("insertOrderedList") },
          { icon: AlignLeft, cmd: () => exec("justifyLeft") },
          { icon: AlignCenter, cmd: () => exec("justifyCenter") },
          { icon: AlignRight, cmd: () => exec("justifyRight") },
        ].map((btn, i) => (
          <button
            key={i}
            type="button"
            className="p-1.5 rounded hover:bg-[var(--card)]"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              if (typeof btn.cmd === "function") btn.cmd();
              else exec(btn.cmd);
              sync();
            }}
          >
            <btn.icon className="size-3.5" />
          </button>
        ))}
        <button type="button" className="p-1.5 rounded hover:bg-[var(--card)]" onMouseDown={(e) => e.preventDefault()} onClick={addLink}>
          <Link className="size-3.5" />
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className="min-h-[120px] rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/40"
        dangerouslySetInnerHTML={{ __html: html || "<p>Start writing…</p>" }}
        onInput={sync}
        onBlur={sync}
      />
    </div>
  );
}

