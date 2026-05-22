import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProjectForUser } from "@/actions/projects";
import { BuilderClient } from "@/components/builder/BuilderClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user?.id) return { title: "Builder" };
  const project = await getProjectForUser(slug);
  if (!project || project.slug !== slug) return { title: "Builder" };
  return { title: `${project.name} · Builder` };
}

export default async function BuilderPage({ params }) {
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
    redirect(`/dashboard/projects/${project.slug}/builder`);
  }

  const payload = {
    id: project.id,
    name: project.name,
    slug: project.slug,
    viewport: project.viewport,
    siteType: project.siteType || "saas",
    canvasData: project.canvasData,
    pages: project.pages || [],
    metaTitle: project.metaTitle,
    metaDescription: project.metaDescription,
    ogImage: project.ogImage,
    status: project.status,
    published: project.published,
  };

  return <BuilderClient project={payload} />;
}
