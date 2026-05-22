// Pure HTML serializer for a page document.
//
// `serializeToHtml` turns a PageDocument into a standalone `<!doctype html>`
// string with everything inlined — no CSS files, no JS, no runtime. It mirrors
// `ElementRenderer` in `preview` mode element-for-element, so an exported file
// renders identically to `/preview/[id]`. It is kept separate from the React
// renderer because `react-dom/server` is unavailable in Next.js 16 app code,
// and because the export must be a plain, dependency-free function.

import type { BuilderElement, ElementStyles, PageDocument } from "@/types/builder";

/** Escapes text that lands between tags. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Escapes a value placed inside a double-quoted attribute. */
function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

/** Converts the camelCase `ElementStyles` map to an inline `style` value. */
function stylesToCss(styles: ElementStyles): string {
  return Object.entries(styles)
    .map(([key, value]) => {
      const prop = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
      return `${prop}: ${escapeAttr(value)}`;
    })
    .join("; ");
}

/** Builds a ` style="…"` attribute, or an empty string when there are none. */
function styleAttr(styles: ElementStyles): string {
  const css = stylesToCss(styles);
  return css ? ` style="${css}"` : "";
}

/** Recursively serializes one element, indented by `depth` levels. */
function serializeElement(element: BuilderElement, depth: number): string {
  const pad = "  ".repeat(depth);
  const style = styleAttr(element.styles);

  switch (element.type) {
    case "text":
      return `${pad}<p${style}>${escapeHtml(element.props.content)}</p>`;

    case "image":
      return `${pad}<img src="${escapeAttr(element.props.src)}" alt="${escapeAttr(
        element.props.alt,
      )}"${style} />`;

    case "button":
      return `${pad}<a href="${escapeAttr(element.props.href)}"${style}>${escapeHtml(
        element.props.label,
      )}</a>`;

    case "container": {
      if (element.children.length === 0) {
        return `${pad}<div${style}></div>`;
      }
      const children = element.children
        .map((child) => serializeElement(child, depth + 1))
        .join("\n");
      return `${pad}<div${style}>\n${children}\n${pad}</div>`;
    }
  }
}

/**
 * Serializes a page document into a complete, standalone HTML document.
 * The result opens directly in any browser with no server or assets.
 */
export function serializeToHtml(doc: PageDocument, title = "Exported Page"): string {
  const body = serializeElement(doc.root, 2);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin: 0">
${body}
  </body>
</html>
`;
}
