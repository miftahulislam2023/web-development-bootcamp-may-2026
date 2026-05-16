import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { TEMPLATES } from "../lib/templates.js";

const prisma = new PrismaClient();

const definitions = [
  {
    key: "navbar",
    label: "Navbar",
    category: "layout",
    defaultProps: { brand: "Nexora", links: "Product,Pricing", cta: "Start" },
  },
  {
    key: "hero",
    label: "Hero",
    category: "layout",
    defaultProps: { title: "Headline", subtitle: "Subhead" },
  },
  {
    key: "footer",
    label: "Footer",
    category: "layout",
    defaultProps: { brand: "Nexora", tagline: "Build faster" },
  },
  {
    key: "button",
    label: "Button",
    category: "basic",
    defaultProps: { label: "Button", href: "#", variant: "primary" },
  },
  {
    key: "card",
    label: "Card",
    category: "basic",
    defaultProps: { title: "Card", body: "Body" },
  },
  {
    key: "testimonials",
    label: "Testimonials",
    category: "marketing",
    defaultProps: { heading: "Testimonials", items: [] },
  },
  {
    key: "pricing",
    label: "Pricing",
    category: "marketing",
    defaultProps: { heading: "Pricing", plans: [] },
  },
  {
    key: "contact-form",
    label: "Contact Form",
    category: "forms",
    defaultProps: { heading: "Contact", submitLabel: "Send" },
  },
  {
    key: "gallery",
    label: "Gallery",
    category: "media",
    defaultProps: { heading: "Gallery", columns: 3 },
  },
  {
    key: "faq",
    label: "FAQ",
    category: "marketing",
    defaultProps: { heading: "FAQ", items: [] },
  },
];

async function main() {
  for (const d of definitions) {
    await prisma.componentDefinition.upsert({
      where: { key: d.key },
      create: d,
      update: {
        label: d.label,
        category: d.category,
        defaultProps: d.defaultProps,
      },
    });
  }

  for (const t of TEMPLATES) {
    const slug = `market-${String(t.id).replace(/[^a-z0-9-]/gi, "-")}`;
    await prisma.template.upsert({
      where: { slug },
      create: {
        name: t.name,
        slug,
        description: t.description,
        category: (t.category || "saas").toLowerCase(),
        thumbnail: t.thumbnail || null,
        canvasData: t.canvasData,
        isPremium: false,
        priceCents: 0,
      },
      update: {
        name: t.name,
        description: t.description,
        category: (t.category || "saas").toLowerCase(),
        thumbnail: t.thumbnail || null,
        canvasData: t.canvasData,
        isPremium: false,
        priceCents: 0,
      },
    });
  }

  const premiumSlug = "saas-pro-kit";
  const baseCanvas = TEMPLATES[0]?.canvasData ?? { version: 1, sections: [] };
  await prisma.template.upsert({
    where: { slug: premiumSlug },
    create: {
      name: "SaaS Pro Kit",
      slug: premiumSlug,
      description: "Premium layout pack — purchase to unlock in marketplace.",
      category: "saas",
      thumbnail:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
      canvasData: baseCanvas,
      isPremium: true,
      priceCents: 2900,
    },
    update: {
      isPremium: true,
      priceCents: 2900,
      canvasData: baseCanvas,
    },
  });

  const extra = [
    {
      slug: "market-agency-landing",
      name: "Agency Landing",
      category: "agency",
      description: "Bold agency hero, services, and case study blocks.",
      isPremium: false,
      priceCents: 0,
      canvasData: { version: 1, sections: [] },
    },
    {
      slug: "market-blog-editorial",
      name: "Blog Editorial",
      category: "blog",
      description: "Article-first layout for publishers.",
      isPremium: false,
      priceCents: 0,
      canvasData: { version: 1, sections: [] },
    },
    {
      slug: "market-lms-course",
      name: "LMS Course Hub",
      category: "lms",
      description: "Course overview, curriculum list, and CTA.",
      isPremium: false,
      priceCents: 0,
      canvasData: { version: 1, sections: [] },
    },
  ];

  for (const row of extra) {
    await prisma.template.upsert({
      where: { slug: row.slug },
      create: row,
      update: {
        name: row.name,
        category: row.category,
        description: row.description,
        isPremium: row.isPremium,
        priceCents: row.priceCents,
      },
    });
  }

  const adminEmail = "admin@nexora-studio.com";
  const adminPass = process.env.ADMIN_SEED_PASSWORD || "nexora-studio-2026";
  const hash = await bcrypt.hash(adminPass, 12);
  await prisma.user.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      name: "Admin",
      password: hash,
      role: "admin",
    },
    update: {
      password: hash,
      role: "admin",
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
