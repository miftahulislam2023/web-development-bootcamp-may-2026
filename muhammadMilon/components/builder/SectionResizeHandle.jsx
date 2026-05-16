"use client";

import { useCallback, useRef } from "react";
import { useAppDispatch } from "@/hooks/useRedux";
import { setSectionDimensions } from "@/redux/slices/builderSlice";

export function SectionResizeHandle({ sectionId, minHeight = 0 }) {
  const dispatch = useAppDispatch();
  const startY = useRef(0);
  const startH = useRef(minHeight);

  const onPointerDown = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      startY.current = e.clientY;
      startH.current = minHeight;

      function onMove(ev) {
        const delta = ev.clientY - startY.current;
        const next = Math.max(80, startH.current + delta);
        dispatch(setSectionDimensions({ id: sectionId, minHeight: next }));
      }

      function onUp() {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      }

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [dispatch, sectionId, minHeight],
  );

  return (
    <button
      type="button"
      aria-label="Resize section height"
      onPointerDown={onPointerDown}
      className="absolute bottom-0 left-1/2 z-30 h-2 w-16 -translate-x-1/2 cursor-ns-resize rounded-full bg-violet-500/60 opacity-0 transition-opacity group-hover:opacity-100"
    />
  );
}
