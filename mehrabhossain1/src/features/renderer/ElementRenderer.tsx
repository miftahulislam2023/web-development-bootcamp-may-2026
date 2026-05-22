import type { CSSProperties, ReactNode } from "react";

import type {
  BuilderElement,
  ButtonElement,
  ContainerElement,
  ImageElement,
  TextElement,
} from "@/types/builder";

export type RenderMode = "edit" | "preview";

interface RenderProps<T extends BuilderElement> {
  element: T;
  mode: RenderMode;
}

/** element.styles is a dynamic string map; cast for React's `style` prop. */
function css(element: BuilderElement): CSSProperties {
  return element.styles as CSSProperties;
}

const EMPTY_HINT_STYLE: CSSProperties = {
  display: "block",
  padding: "12px",
  textAlign: "center",
  color: "#9ca3af",
  fontSize: "13px",
  fontStyle: "italic",
};

/** Registry: element type → render function. */
const ELEMENT_RENDERERS: {
  text: (props: RenderProps<TextElement>) => ReactNode;
  image: (props: RenderProps<ImageElement>) => ReactNode;
  button: (props: RenderProps<ButtonElement>) => ReactNode;
  container: (props: RenderProps<ContainerElement>) => ReactNode;
} = {
  text: ({ element }) => <p style={css(element)}>{element.props.content}</p>,

  image: ({ element }) => (
    // The renderer emits plain HTML for the live preview and standalone HTML
    // export, with arbitrary user-supplied image URLs — next/image cannot be
    // used here.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={element.props.src} alt={element.props.alt} style={css(element)} />
  ),

  button: ({ element }) => (
    <a href={element.props.href} style={css(element)}>
      {element.props.label}
    </a>
  ),

  container: ({ element, mode }) => (
    <div style={css(element)}>
      {element.children.length > 0 ? (
        element.children.map((child) => (
          <ElementRenderer key={child.id} element={child} mode={mode} />
        ))
      ) : mode === "edit" ? (
        <span style={EMPTY_HINT_STYLE}>Empty container</span>
      ) : null}
    </div>
  ),
};

/**
 * Recursively renders a BuilderElement tree with inline styles.
 *
 * The same renderer drives the editor canvas, the live preview, and (later)
 * the HTML export — guaranteeing identical output across all three. `mode`
 * only affects editor affordances (an empty-container hint in `edit` mode);
 * rendered content is identical in both modes.
 */
export function ElementRenderer({
  element,
  mode,
}: RenderProps<BuilderElement>): ReactNode {
  switch (element.type) {
    case "text":
      return ELEMENT_RENDERERS.text({ element, mode });
    case "image":
      return ELEMENT_RENDERERS.image({ element, mode });
    case "button":
      return ELEMENT_RENDERERS.button({ element, mode });
    case "container":
      return ELEMENT_RENDERERS.container({ element, mode });
  }
}
