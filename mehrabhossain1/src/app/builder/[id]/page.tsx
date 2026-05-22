import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BuilderShell } from "@/features/builder/components/BuilderShell";
import { getProject } from "@/features/projects/queries";
import { createEmptyDocument } from "@/lib/builder/defaults";
import { pageDocumentSchema } from "@/lib/builder/schema";

export const metadata: Metadata = {
  title: "Builder",
};

export default async function BuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await getProject(id);
  if (!project) {
    notFound();
  }

  // Stored tree is a JSON column; validate it back into a typed document.
  const parsed = pageDocumentSchema.safeParse(project.tree);
  const initialDoc = parsed.success ? parsed.data : createEmptyDocument();

  return (
    <BuilderShell
      projectId={project.id}
      projectName={project.name}
      initialDoc={initialDoc}
    />
  );
}
