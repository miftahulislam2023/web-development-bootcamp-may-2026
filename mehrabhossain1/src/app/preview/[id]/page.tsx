import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPublicProject } from "@/features/projects/queries";
import { ElementRenderer } from "@/features/renderer/ElementRenderer";
import { createEmptyDocument } from "@/lib/builder/defaults";
import { pageDocumentSchema } from "@/lib/builder/schema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = await getPublicProject(id);
  return { title: project?.name ?? "Preview" };
}

/**
 * Public, shareable render of a saved page — no editor chrome and no builder
 * JS. A plain Server Component: it fetches the saved tree and hands it to the
 * same recursive `ElementRenderer` the canvas uses, in `preview` mode.
 */
export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await getPublicProject(id);
  if (!project) {
    notFound();
  }

  // Stored tree is a JSON column; validate it back into a typed document.
  const parsed = pageDocumentSchema.safeParse(project.tree);
  const doc = parsed.success ? parsed.data : createEmptyDocument();

  return <ElementRenderer element={doc.root} mode="preview" />;
}
