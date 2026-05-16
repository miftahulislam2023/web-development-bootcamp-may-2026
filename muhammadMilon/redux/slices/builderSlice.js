import { createSlice } from "@reduxjs/toolkit";
import { createSection, emptyCanvasDocument } from "@/features/builder/componentRegistry";
import { createId } from "@/utils/id";

const HISTORY_LIMIT = 50;

function cloneState(state) {
  return {
    projectId: state.projectId,
    projectName: state.projectName,
    viewport: state.viewport,
    document: JSON.parse(JSON.stringify(state.document)),
  };
}

function pushHistory(state) {
  const snap = cloneState(state);
  state.past.push(snap);
  if (state.past.length > HISTORY_LIMIT) state.past.shift();
  state.future = [];
}

const initialState = {
  projectId: null,
  projectName: "",
  siteType: "saas", // Default type
  viewport: "desktop",
  document: emptyCanvasDocument(),
  past: [],
  future: [],
  selectedSectionId: null,
  isDirty: false,
  previewMode: null,
};

const builderSlice = createSlice({
  name: "builder",
  initialState,
  reducers: {
    hydrateFromServer(state, action) {
      const { projectId, projectName, viewport, canvasData, siteType } = action.payload;
      state.projectId = projectId;
      state.projectName = projectName || "";
      state.siteType = siteType || "saas";
      state.viewport = viewport || "desktop";
      state.document =
        canvasData && typeof canvasData === "object" && canvasData.sections
          ? canvasData
          : emptyCanvasDocument();
      state.past = [];
      state.future = [];
      state.selectedSectionId = null;
      state.isDirty = false;
    },
    setViewport(state, action) {
      state.viewport = action.payload;
    },
    setSiteType(state, action) {
      state.siteType = action.payload;
    },
    selectSection(state, action) {
      state.selectedSectionId = action.payload;
    },
    addSection(state, action) {
      pushHistory(state);
      const type = action.payload?.type || "hero";
      const section = action.payload?.section || createSection(type);
      state.document.sections.push(section);
      state.selectedSectionId = section.id;
      state.isDirty = true;
    },
    insertSectionAt(state, action) {
      pushHistory(state);
      const { index, type } = action.payload;
      const section = createSection(type);
      const safeIndex = Math.max(0, Math.min(index, state.document.sections.length));
      state.document.sections.splice(safeIndex, 0, section);
      state.selectedSectionId = section.id;
      state.isDirty = true;
    },
    reorderSections(state, action) {
      pushHistory(state);
      const { activeId, overId } = action.payload;
      const sections = state.document.sections;
      const oldIndex = sections.findIndex((s) => s.id === activeId);
      const newIndex = sections.findIndex((s) => s.id === overId);
      if (oldIndex < 0 || newIndex < 0) return;
      const [removed] = sections.splice(oldIndex, 1);
      sections.splice(newIndex, 0, removed);
      state.isDirty = true;
    },
    moveSection(state, action) {
      pushHistory(state);
      const { fromIndex, toIndex } = action.payload;
      const sections = state.document.sections;
      if (
        fromIndex < 0 ||
        fromIndex >= sections.length ||
        toIndex < 0 ||
        toIndex >= sections.length
      ) {
        return;
      }
      const [removed] = sections.splice(fromIndex, 1);
      sections.splice(toIndex, 0, removed);
      state.isDirty = true;
    },
    updateSectionProps(state, action) {
      pushHistory(state);
      const { id, props } = action.payload;
      const section = state.document.sections.find((s) => s.id === id);
      if (!section) return;
      section.props = { ...section.props, ...props };
      state.isDirty = true;
    },
    /** Inline edit — no undo stack entry per keystroke */
    updateSectionPropsLive(state, action) {
      const { id, props } = action.payload;
      const section = state.document.sections.find((s) => s.id === id);
      if (!section) return;
      section.props = { ...section.props, ...props };
      state.isDirty = true;
    },
    updateSectionStyle(state, action) {
      pushHistory(state);
      const { id, style } = action.payload;
      const section = state.document.sections.find((s) => s.id === id);
      if (!section) return;
      section.style = { ...section.style, ...style };
      state.isDirty = true;
    },
    updateSectionStyleLive(state, action) {
      const { id, style } = action.payload;
      const section = state.document.sections.find((s) => s.id === id);
      if (!section) return;
      section.style = { ...section.style, ...style };
      state.isDirty = true;
    },
    updateResponsiveStyle(state, action) {
      pushHistory(state);
      const { id, viewport, style } = action.payload;
      const section = state.document.sections.find((s) => s.id === id);
      if (!section) return;
      if (!section.style) section.style = {};
      if (!section.style.responsive) section.style.responsive = {};
      section.style.responsive[viewport] = {
        ...(section.style.responsive[viewport] || {}),
        ...style,
      };
      state.isDirty = true;
    },
    setSectionDimensions(state, action) {
      pushHistory(state);
      const { id, minHeight, widthPercent } = action.payload;
      const section = state.document.sections.find((s) => s.id === id);
      if (!section) return;
      if (!section.style) section.style = {};
      if (minHeight != null) section.style.minHeight = minHeight;
      if (widthPercent != null) section.style.widthPercent = widthPercent;
      state.isDirty = true;
    },
    addChildSection(state, action) {
      pushHistory(state);
      const { parentId, type, columnIndex = 0 } = action.payload;
      const parent = state.document.sections.find((s) => s.id === parentId);
      if (!parent || parent.type !== "layout-columns") return;
      if (!parent.children) parent.children = [[], []];
      const child = createSection(type || "card-feature");
      const col = Math.min(columnIndex, parent.children.length - 1);
      parent.children[col].push(child);
      state.selectedSectionId = child.id;
      state.isDirty = true;
    },
    duplicateSection(state, action) {
      pushHistory(state);
      const id = action.payload;
      const idx = state.document.sections.findIndex((s) => s.id === id);
      if (idx < 0) return;
      const copy = JSON.parse(JSON.stringify(state.document.sections[idx]));
      copy.id = createId();
      state.document.sections.splice(idx + 1, 0, copy);
      state.selectedSectionId = copy.id;
      state.isDirty = true;
    },
    removeSection(state, action) {
      pushHistory(state);
      const id = action.payload;
      state.document.sections = state.document.sections.filter((s) => s.id !== id);
      if (state.selectedSectionId === id) state.selectedSectionId = null;
      state.isDirty = true;
    },
    replaceDocument(state, action) {
      pushHistory(state);
      state.document = action.payload;
      state.isDirty = true;
    },
    markSaved(state) {
      state.isDirty = false;
    },
    undo(state) {
      if (!state.past.length) return;
      const previous = state.past.pop();
      const current = cloneState(state);
      state.future.unshift(current);
      state.projectId = previous.projectId;
      state.projectName = previous.projectName;
      state.viewport = previous.viewport;
      state.document = previous.document;
      state.isDirty = true;
    },
    redo(state) {
      if (!state.future.length) return;
      const next = state.future.shift();
      const current = cloneState(state);
      state.past.push(current);
      state.projectId = next.projectId;
      state.projectName = next.projectName;
      state.viewport = next.viewport;
      state.document = next.document;
      state.isDirty = true;
    },
    setPreviewMode(state, action) {
      state.previewMode = action.payload;
    },
    resetBuilder() {
      return { ...initialState };
    },
  },
});

export const {
  hydrateFromServer,
  setViewport,
  setSiteType,
  selectSection,
  addSection,
  insertSectionAt,
  reorderSections,
  moveSection,
  updateSectionProps,
  updateSectionPropsLive,
  updateSectionStyle,
  updateSectionStyleLive,
  updateResponsiveStyle,
  setSectionDimensions,
  addChildSection,
  duplicateSection,
  removeSection,
  replaceDocument,
  markSaved,
  undo,
  redo,
  setPreviewMode,
  resetBuilder,
} = builderSlice.actions;

export default builderSlice.reducer;
