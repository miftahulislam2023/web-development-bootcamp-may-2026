"use client";

import { useRef, useState, useLayoutEffect } from "react";
import { useAppDispatch } from "@/hooks/useRedux";
import { updateSectionPropsLive } from "@/redux/slices/builderSlice";
import { cn } from "@/utils/cn";

/**
 * Inline editable text for the builder. Avoids `dangerouslySetInnerHTML` (script
 * warnings + hydration risk) and avoids setState during render.
 */
export function Editable({
  sectionId,
  propName,
  value,
  isEditor,
  className,
  as: Component = "span",
  multiline = false,
}) {
  const dispatch = useAppDispatch();
  const [isFocused, setIsFocused] = useState(false);
  const contentRef = useRef(null);
  const displayValue = value ?? "";

  useLayoutEffect(() => {
    if (!isEditor || isFocused) return;
    const el = contentRef.current;
    if (!el) return;
    if (el.textContent !== displayValue) {
      el.textContent = displayValue;
    }
  }, [isEditor, isFocused, displayValue]);

  if (!isEditor) {
    return <Component className={className}>{displayValue}</Component>;
  }

  const handleBlur = () => {
    setIsFocused(false);
    const newValue = contentRef.current?.innerText ?? "";
    if (newValue !== displayValue) {
      dispatch(
        updateSectionPropsLive({
          id: sectionId,
          props: { [propName]: newValue },
        }),
      );
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      contentRef.current?.blur();
    }
    if (e.key === "Escape") {
      if (contentRef.current) contentRef.current.textContent = displayValue;
      contentRef.current?.blur();
    }
  };

  return (
    <Component
      ref={contentRef}
      contentEditable
      suppressContentEditableWarning
      suppressHydrationWarning
      className={cn(
        "outline-none transition-all focus:ring-2 focus:ring-violet-500/50 rounded px-0.5",
        isFocused ? "bg-violet-500/10 cursor-text" : "hover:bg-violet-500/5 cursor-pointer",
        className,
      )}
      onFocus={() => setIsFocused(true)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    />
  );
}
