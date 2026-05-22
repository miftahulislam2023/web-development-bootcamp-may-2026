// Page document model for the drag-and-drop builder.
// A page is a recursive tree of BuilderElements rooted at a container.

export type ElementType = "text" | "image" | "button" | "container";

/** Inline CSS, camelCase keys (applied directly as a React `style` object). */
export type ElementStyles = Record<string, string>;

export interface BaseElement {
  id: string;
  styles: ElementStyles;
}

export interface TextElement extends BaseElement {
  type: "text";
  props: { content: string };
}

export interface ImageElement extends BaseElement {
  type: "image";
  props: { src: string; alt: string };
}

export interface ButtonElement extends BaseElement {
  type: "button";
  props: { label: string; href: string };
}

export interface ContainerElement extends BaseElement {
  type: "container";
  props: Record<string, never>;
  children: BuilderElement[];
}

export type BuilderElement =
  | TextElement
  | ImageElement
  | ButtonElement
  | ContainerElement;

export interface PageDocument {
  version: 1;
  root: ContainerElement;
}
