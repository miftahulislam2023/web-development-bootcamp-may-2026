import { createId } from "@/utils/id";
import { COMPONENT_LIBRARY, COMPONENT_DEFAULTS } from "./componentLibrary";

export const COMPONENT_PALETTE = COMPONENT_LIBRARY;

const defaultStyle = {
  paddingY: 64,
  paddingX: 24,
  marginTop: 0,
  marginBottom: 0,
  maxWidth: 1200,
  minHeight: 0,
  widthPercent: 100,
  background: "transparent",
  textColor: "inherit",
  fontFamily: "inherit",
  borderRadius: 0,
  responsive: {},
};

/**
 * Creates a new section instance with default props and styles.
 */
export function createSection(type) {
  const id = createId();
  const config = COMPONENT_DEFAULTS[type] || {};
  
  const base = {
    id,
    type,
    style: { ...defaultStyle },
    props: { ...config },
  };

  // Type-specific overrides
  if (type.startsWith("hero")) {
    base.style.paddingY = 96;
  }
  
  if (type === "navbar-basic") {
    base.style.paddingY = 16;
  }

  if (type === "layout-columns") {
    base.children = [[], []];
    base.props = { columns: 2, gap: 24, ...config };
  }

  return base;
}

/**
 * Filter components based on project type.
 */
export function getRecommendedComponents(siteType) {
  if (!siteType) return COMPONENT_PALETTE.filter((c) => c.tags.includes("all"));

  const raw = siteType.toLowerCase();
  const aliases = { course: "lms", courses: "lms", shop: "ecommerce", store: "ecommerce" };
  const type = aliases[raw] || raw;
  return COMPONENT_PALETTE.filter((c) => c.tags.includes(type) || c.tags.includes("all"));
}

export function emptyCanvasDocument() {
  return {
    version: 1,
    sections: [],
  };
}
