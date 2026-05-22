import { create } from "zustand";

import { createEmptyDocument } from "@/lib/builder/defaults";
import * as tree from "@/lib/builder/tree";
import type { BuilderElement, ElementStyles, PageDocument } from "@/types/builder";

interface EditorState {
  doc: PageDocument;
  selectedId: string | null;
  isDirty: boolean;

  /** Loads a document (e.g. when opening a project) — resets selection and dirty flag. */
  setDoc: (doc: PageDocument) => void;
  select: (id: string | null) => void;
  addElement: (
    parentId: string,
    element: BuilderElement,
    index?: number,
  ) => void;
  removeElement: (id: string) => void;
  moveElement: (id: string, newParentId: string, index: number) => void;
  updateProps: (id: string, props: Record<string, unknown>) => void;
  updateStyles: (id: string, styles: ElementStyles) => void;
  /** Clears the dirty flag after a successful save. */
  markSaved: () => void;
}

export const useEditorStore = create<EditorState>()((set) => ({
  doc: createEmptyDocument(),
  selectedId: null,
  isDirty: false,

  setDoc: (doc) => set({ doc, selectedId: null, isDirty: false }),

  select: (id) => set({ selectedId: id }),

  addElement: (parentId, element, index) =>
    set((state) => {
      const doc = tree.addElement(state.doc, parentId, element, index);
      const added = tree.findElement(doc, element.id) !== null;
      return {
        doc,
        selectedId: added ? element.id : state.selectedId,
        isDirty: true,
      };
    }),

  removeElement: (id) =>
    set((state) => {
      const doc = tree.removeElement(state.doc, id);
      // Drop the selection if the selected element no longer exists (e.g. a
      // container that held it was removed).
      const keepSelection =
        state.selectedId !== null &&
        tree.findElement(doc, state.selectedId) !== null;
      return {
        doc,
        selectedId: keepSelection ? state.selectedId : null,
        isDirty: true,
      };
    }),

  moveElement: (id, newParentId, index) =>
    set((state) => ({
      doc: tree.moveElement(state.doc, id, newParentId, index),
      isDirty: true,
    })),

  updateProps: (id, props) =>
    set((state) => ({
      doc: tree.updateProps(state.doc, id, props),
      isDirty: true,
    })),

  updateStyles: (id, styles) =>
    set((state) => ({
      doc: tree.updateStyles(state.doc, id, styles),
      isDirty: true,
    })),

  markSaved: () => set({ isDirty: false }),
}));
