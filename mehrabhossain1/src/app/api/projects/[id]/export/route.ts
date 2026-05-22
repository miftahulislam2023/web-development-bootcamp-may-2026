import { getProject } from "@/features/projects/queries";
import { createEmptyDocument } from "@/lib/builder/defaults";
import { serializeToHtml } from "@/lib/builder/htmlExport";
import { pageDocumentSchema } from "@/lib/builder/schema";

/** Turns a project name into a safe `.html` filename stem. */
function toFilename(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "page";
}

/**
 * GET /api/projects/[id]/export
 * Returns the project's saved page as a standalone HTML file download.
 * Owner-scoped: `getProject` only resolves projects the current user owns.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const project = await getProject(id);
  if (!project) {
    return new Response("Not found", { status: 404 });
  }

  // Stored tree is a JSON column; validate it back into a typed document.
  const parsed = pageDocumentSchema.safeParse(project.tree);
  const doc = parsed.success ? parsed.data : createEmptyDocument();

  const html = serializeToHtml(doc, project.name);

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="${toFilename(project.name)}.html"`,
    },
  });
}
