import { Box, Image, MousePointerClick, Type } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type {
  BuilderElement,
  ContainerElement,
  ElementType,
  PageDocument,
} from "@/types/builder";

/** Palette metadata per element type — label, description, and lucide icon. */
export const ELEMENT_REGISTRY: Record<
  ElementType,
  { label: string; description: string; icon: LucideIcon }
> = {
  text: {
    label: "Text",
    description: "A paragraph of text",
    icon: Type,
  },
  image: {
    label: "Image",
    description: "An image from a URL",
    icon: Image,
  },
  button: {
    label: "Button",
    description: "A clickable link button",
    icon: MousePointerClick,
  },
  container: {
    label: "Container",
    description: "A box that holds other blocks",
    icon: Box,
  },
};

/** Order in which element types appear in the palette. */
export const PALETTE: ElementType[] = ["text", "image", "button", "container"];

function newId(): string {
  return crypto.randomUUID();
}

/** Creates an empty container element with sensible default styles. */
function createContainer(): ContainerElement {
  return {
    id: newId(),
    type: "container",
    props: {},
    styles: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      padding: "16px",
      minHeight: "80px",
      backgroundColor: "#f9fafb",
    },
    children: [],
  };
}

/** Creates a fresh element of the given type with default props and styles. */
export function createElement(type: ElementType): BuilderElement {
  switch (type) {
    case "text":
      return {
        id: newId(),
        type: "text",
        props: { content: "Text" },
        styles: {
          fontSize: "16px",
          lineHeight: "1.5",
          color: "#111827",
        },
      };
    case "image":
      return {
        id: newId(),
        type: "image",
        props: {
          src: "https://placehold.co/600x400",
          alt: "Image",
        },
        styles: {
          width: "100%",
          height: "auto",
          display: "block",
        },
      };
    case "button":
      return {
        id: newId(),
        type: "button",
        props: { label: "Button", href: "#" },
        styles: {
          display: "inline-block",
          padding: "10px 16px",
          backgroundColor: "#111827",
          color: "#ffffff",
          borderRadius: "6px",
          fontSize: "14px",
          fontWeight: "500",
          textDecoration: "none",
        },
      };
    case "container":
      return createContainer();
  }
}

/** Creates a new, empty page document (a single root container). */
export function createEmptyDocument(): PageDocument {
  return {
    version: 1,
    root: {
      ...createContainer(),
      styles: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "24px",
        minHeight: "100%",
        backgroundColor: "#ffffff",
      },
    },
  };
}
