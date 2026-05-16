import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { SectionRenderer } from "@/features/builder/SectionRenderer";

function resolveSections(doc) {
  if (Array.isArray(doc?.sections) && doc.sections.length) return doc.sections;
  if (doc?.version === 2 && Array.isArray(doc.pages)) {
    const home = doc.pages.find((p) => p.slug === doc.homeSlug) || doc.pages[0];
    const canvas = home?.canvasData;
    if (Array.isArray(canvas?.sections)) return canvas.sections;
  }
  return [];
}

export async function generateMetadata({ params }) {
  const { subdomain } = await params;
  const site = await prisma.publishedWebsite.findUnique({
    where: { subdomain, isActive: true },
    include: { project: true },
  });
  if (!site) return { title: "Site not found" };

  const seo = site.seoMeta || {};
  const title = seo.metaTitle || site.project?.name || "Published site";
  const description = seo.metaDescription || site.project?.description || "";
  const images = seo.ogImage ? [{ url: seo.ogImage }] : [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
      type: "website",
    },
    twitter: {
      card: seo.ogImage ? "summary_large_image" : "summary",
      title,
      description,
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
  };
}

export default async function PublishedSitePage({ params }) {
  const { subdomain } = await params;
  const site = await prisma.publishedWebsite.findUnique({
    where: { subdomain, isActive: true },
  });

  if (!site) {
    notFound();
  }

  const doc = site.snapshotData;
  const sections = resolveSections(doc);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} isEditor={false} subdomain={subdomain} />
      ))}
    </div>
  );
}
