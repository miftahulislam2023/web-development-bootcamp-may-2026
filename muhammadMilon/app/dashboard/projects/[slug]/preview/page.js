import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProjectForUser } from "@/actions/projects";
import { SectionRenderer } from "@/features/builder/SectionRenderer";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProjectPreviewPage({ params }) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const project = await getProjectForUser(slug);
  if (!project) {
    notFound();
  }
  if (project.slug !== slug) {
    redirect(`/dashboard/projects/${project.slug}/preview`);
  }

  const page = project.pages?.[0];
  const doc = page?.canvasData || project.canvasData;
  const sections = Array.isArray(doc?.sections) ? doc.sections : [];
  const subdomain = project.published?.subdomain || null;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="border-b border-[var(--border)] bg-[var(--card)] px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-[var(--muted-foreground)]">Draft preview</p>
          <p className="font-display font-bold">{project.name}</p>
        </div>
        <Link
          href={`/dashboard/projects/${project.slug}/builder`}
          className="text-sm font-medium text-violet-500 hover:underline"
        >
          ← Back to builder
        </Link>
      </div>
      {sections.length === 0 ? (
        <p className="p-8 text-center text-sm text-[var(--muted-foreground)]">No sections yet. Add content in the builder.</p>
      ) : (
        sections.map((section) => (
          <SectionRenderer
            key={section.id}
            section={section}
            isEditor={false}
            subdomain={subdomain}
          />
        ))
      )}
    </div>
  );
}
