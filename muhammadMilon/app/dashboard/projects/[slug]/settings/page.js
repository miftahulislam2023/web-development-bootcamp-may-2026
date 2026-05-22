import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProjectForUser } from "@/actions/projects";
import { ProjectSettingsForm } from "@/components/dashboard/ProjectSettingsForm";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user?.id) return { title: "Project settings" };
  const project = await getProjectForUser(slug);
  if (!project || project.slug !== slug) return { title: "Project settings" };
  return { title: `${project.name} · Settings` };
}

export default async function ProjectSettingsPage({ params }) {
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
    redirect(`/dashboard/projects/${project.slug}/settings`);
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <Link
          href={`/dashboard/projects/${project.slug}/builder`}
          className="text-sm text-[var(--accent)] hover:underline"
        >
          ← Back to builder
        </Link>
        <h1 className="mt-2 font-display text-2xl font-bold">Project settings</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Publishing and custom domains (configure DNS at your provider).
        </p>
      </div>
      <ProjectSettingsForm
        project={{
          id: project.id,
          name: project.name,
          slug: project.slug,
          published: project.published
            ? {
                subdomain: project.published.subdomain,
                customDomain: project.published.customDomain,
                domainVerified: project.published.domainVerified,
                domainVerifyToken: project.published.domainVerifyToken,
              }
            : null,
        }}
      />
    </div>
  );
}
