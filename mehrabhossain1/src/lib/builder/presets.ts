import {
  BarChart3,
  CircleHelp,
  CreditCard,
  LayoutGrid,
  LayoutTemplate,
  Megaphone,
  PanelBottom,
  PanelTop,
  Quote,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type {
  BuilderElement,
  ButtonElement,
  ContainerElement,
  ElementStyles,
  TextElement,
} from "@/types/builder";

const id = () => crypto.randomUUID();

// --- element builders --------------------------------------------------------

function text(content: string, styles: ElementStyles): TextElement {
  return { id: id(), type: "text", props: { content }, styles };
}

function button(
  label: string,
  href: string,
  styles: ElementStyles,
): ButtonElement {
  return { id: id(), type: "button", props: { label, href }, styles };
}

function box(
  styles: ElementStyles,
  children: BuilderElement[],
): ContainerElement {
  return { id: id(), type: "container", props: {}, styles, children };
}

// --- presets -----------------------------------------------------------------

export interface SectionPreset {
  key: string;
  label: string;
  description: string;
  icon: LucideIcon;
  /** Builds a fresh section subtree (new ids on every call). */
  create: () => ContainerElement;
}

function createHero(): ContainerElement {
  return box(
    {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "20px",
      padding: "64px 32px",
      backgroundColor: "#ffffff",
    },
    [
      text("Drag-and-drop builder", {
        fontSize: "13px",
        fontWeight: "600",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "#047857",
      }),
      text("Build something people love", {
        fontSize: "44px",
        fontWeight: "700",
        lineHeight: "1.1",
        color: "#0f172a",
        textAlign: "center",
        maxWidth: "560px",
      }),
      text(
        "Launch a polished landing page in minutes — no code, just drag, drop, and publish.",
        {
          fontSize: "18px",
          lineHeight: "1.6",
          color: "#475569",
          textAlign: "center",
          maxWidth: "480px",
        },
      ),
      box(
        {
          display: "flex",
          flexDirection: "row",
          gap: "12px",
          padding: "8px",
          backgroundColor: "transparent",
        },
        [
          button("Get started", "#", {
            display: "inline-block",
            padding: "12px 22px",
            backgroundColor: "#047857",
            color: "#ffffff",
            borderRadius: "10px",
            fontSize: "15px",
            fontWeight: "600",
            textDecoration: "none",
          }),
          button("Learn more", "#", {
            display: "inline-block",
            padding: "12px 22px",
            backgroundColor: "#ffffff",
            color: "#0f172a",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            fontSize: "15px",
            fontWeight: "600",
            textDecoration: "none",
          }),
        ],
      ),
    ],
  );
}

/** A transparent-background ghost nav link. */
function navLink(label: string): ButtonElement {
  return button(label, "#", {
    display: "inline-block",
    padding: "8px 12px",
    backgroundColor: "transparent",
    color: "#475569",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    textDecoration: "none",
  });
}

function createHeader(): ContainerElement {
  return box(
    {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "16px",
      padding: "16px 32px",
      backgroundColor: "#ffffff",
      borderBottom: "1px solid #e2e8f0",
    },
    [
      text("YourBrand", {
        fontSize: "18px",
        fontWeight: "700",
        color: "#0f172a",
      }),
      box(
        {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "6px",
          padding: "0px",
          backgroundColor: "transparent",
        },
        [
          navLink("Features"),
          navLink("Pricing"),
          navLink("About"),
          button("Get started", "#", {
            display: "inline-block",
            padding: "9px 16px",
            backgroundColor: "#047857",
            color: "#ffffff",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            textDecoration: "none",
          }),
        ],
      ),
    ],
  );
}

/** A footer link column — a heading followed by muted link texts. */
function footerColumn(heading: string, links: string[]): ContainerElement {
  return box(
    {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      padding: "0px",
      backgroundColor: "transparent",
    },
    [
      text(heading, {
        fontSize: "13px",
        fontWeight: "600",
        color: "#ffffff",
      }),
      ...links.map((link) =>
        text(link, {
          fontSize: "13px",
          color: "#94a3b8",
          lineHeight: "1.4",
        }),
      ),
    ],
  );
}

function createFooter(): ContainerElement {
  return box(
    {
      display: "flex",
      flexDirection: "column",
      gap: "28px",
      padding: "48px 32px",
      backgroundColor: "#0f172a",
    },
    [
      box(
        {
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "48px",
          padding: "0px",
          backgroundColor: "transparent",
        },
        [
          box(
            {
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              padding: "0px",
              backgroundColor: "transparent",
            },
            [
              text("YourBrand", {
                fontSize: "16px",
                fontWeight: "700",
                color: "#ffffff",
              }),
              text("Build polished pages without writing code.", {
                fontSize: "13px",
                color: "#94a3b8",
                lineHeight: "1.6",
                maxWidth: "220px",
              }),
            ],
          ),
          footerColumn("Product", ["Features", "Pricing", "Templates"]),
          footerColumn("Company", ["About", "Blog", "Contact"]),
        ],
      ),
      text("© 2026 YourBrand. All rights reserved.", {
        fontSize: "12px",
        color: "#64748b",
        borderTop: "1px solid #1e293b",
        paddingTop: "24px",
      }),
    ],
  );
}

/** A feature card — emoji icon, title, and body. */
function featureCard(
  icon: string,
  title: string,
  body: string,
): ContainerElement {
  return box(
    {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      flex: "1 1 180px",
      padding: "24px",
      backgroundColor: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
    },
    [
      text(icon, { fontSize: "28px", lineHeight: "1" }),
      text(title, {
        fontSize: "16px",
        fontWeight: "600",
        color: "#0f172a",
      }),
      text(body, {
        fontSize: "14px",
        lineHeight: "1.6",
        color: "#475569",
      }),
    ],
  );
}

function createFeatures(): ContainerElement {
  return box(
    {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "16px",
      padding: "64px 32px",
      backgroundColor: "#ffffff",
    },
    [
      text("Everything you need", {
        fontSize: "32px",
        fontWeight: "700",
        color: "#0f172a",
        textAlign: "center",
      }),
      text("Powerful features to help you build and ship faster.", {
        fontSize: "16px",
        lineHeight: "1.6",
        color: "#475569",
        textAlign: "center",
        maxWidth: "440px",
      }),
      box(
        {
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "16px",
          padding: "16px 0px 0px",
          backgroundColor: "transparent",
        },
        [
          featureCard(
            "⚡",
            "Fast by default",
            "Ship polished pages in minutes with sensible defaults.",
          ),
          featureCard(
            "🎯",
            "Pixel control",
            "Fine-tune every block's content, colors, and spacing.",
          ),
          featureCard(
            "✨",
            "No code needed",
            "Drag, drop, and publish — no setup, no build step.",
          ),
        ],
      ),
    ],
  );
}

/** A single stat — a large number and a label. */
function statItem(value: string, label: string): ContainerElement {
  return box(
    {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "4px",
      padding: "0px",
      backgroundColor: "transparent",
    },
    [
      text(value, {
        fontSize: "36px",
        fontWeight: "700",
        color: "#047857",
      }),
      text(label, { fontSize: "14px", color: "#475569" }),
    ],
  );
}

function createStats(): ContainerElement {
  return box(
    {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-around",
      gap: "32px",
      padding: "48px 32px",
      backgroundColor: "#f8fafc",
    },
    [
      statItem("10k+", "Pages built"),
      statItem("99.9%", "Uptime"),
      statItem("4.9/5", "User rating"),
      statItem("24/7", "Support"),
    ],
  );
}

/** A pricing plan card — name, price, feature lines, and a CTA. */
function pricingCard(
  name: string,
  price: string,
  features: string[],
  featured: boolean,
): ContainerElement {
  return box(
    {
      display: "flex",
      flexDirection: "column",
      gap: "14px",
      flex: "1 1 200px",
      padding: "28px",
      backgroundColor: "#ffffff",
      border: featured ? "2px solid #047857" : "1px solid #e2e8f0",
      borderRadius: "14px",
    },
    [
      text(name, {
        fontSize: "15px",
        fontWeight: "600",
        color: "#0f172a",
      }),
      text(price, {
        fontSize: "38px",
        fontWeight: "700",
        lineHeight: "1",
        color: "#0f172a",
      }),
      text("per month", { fontSize: "13px", color: "#64748b" }),
      ...features.map((feature) =>
        text(`✓  ${feature}`, {
          fontSize: "14px",
          lineHeight: "1.5",
          color: "#475569",
        }),
      ),
      button("Choose plan", "#", {
        display: "block",
        padding: "10px 18px",
        textAlign: "center",
        backgroundColor: featured ? "#047857" : "#ffffff",
        color: featured ? "#ffffff" : "#0f172a",
        border: featured ? "1px solid #047857" : "1px solid #e2e8f0",
        borderRadius: "10px",
        fontSize: "14px",
        fontWeight: "600",
        textDecoration: "none",
      }),
    ],
  );
}

function createPricing(): ContainerElement {
  return box(
    {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "16px",
      padding: "64px 32px",
      backgroundColor: "#ffffff",
    },
    [
      text("Simple, transparent pricing", {
        fontSize: "32px",
        fontWeight: "700",
        color: "#0f172a",
        textAlign: "center",
      }),
      text("Start free. Upgrade when you’re ready.", {
        fontSize: "16px",
        lineHeight: "1.6",
        color: "#475569",
        textAlign: "center",
        maxWidth: "420px",
      }),
      box(
        {
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "16px",
          padding: "16px 0px 0px",
          backgroundColor: "transparent",
        },
        [
          pricingCard(
            "Starter",
            "$0",
            ["1 project", "Core blocks", "Community support"],
            false,
          ),
          pricingCard(
            "Pro",
            "$19",
            ["Unlimited projects", "All sections", "Priority support"],
            true,
          ),
          pricingCard(
            "Team",
            "$49",
            ["Everything in Pro", "5 seats", "SSO & audit log"],
            false,
          ),
        ],
      ),
    ],
  );
}

/** A testimonial card — a quote and its author. */
function testimonialCard(quote: string, author: string): ContainerElement {
  return box(
    {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      flex: "1 1 200px",
      padding: "24px",
      backgroundColor: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
    },
    [
      text(quote, {
        fontSize: "15px",
        lineHeight: "1.6",
        color: "#0f172a",
      }),
      text(author, {
        fontSize: "13px",
        fontWeight: "600",
        color: "#475569",
      }),
    ],
  );
}

function createTestimonials(): ContainerElement {
  return box(
    {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "16px",
      padding: "64px 32px",
      backgroundColor: "#ffffff",
    },
    [
      text("Loved by builders", {
        fontSize: "32px",
        fontWeight: "700",
        color: "#0f172a",
        textAlign: "center",
      }),
      box(
        {
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "16px",
          padding: "16px 0px 0px",
          backgroundColor: "transparent",
        },
        [
          testimonialCard(
            "“This builder saved us weeks. We shipped our landing page in an afternoon.”",
            "— Jordan Lee, Acme",
          ),
          testimonialCard(
            "“The drag-and-drop is genuinely fast. My team picked it up instantly.”",
            "— Priya Shah, Northwind",
          ),
          testimonialCard(
            "“Clean output, no bloat. Exactly what I wanted from a page builder.”",
            "— Marco Reyes, Foundry",
          ),
        ],
      ),
    ],
  );
}

/** A FAQ entry — a question and its answer, with a divider. */
function faqItem(question: string, answer: string): ContainerElement {
  return box(
    {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      padding: "18px 0px",
      backgroundColor: "transparent",
      borderBottom: "1px solid #e2e8f0",
    },
    [
      text(question, {
        fontSize: "16px",
        fontWeight: "600",
        color: "#0f172a",
      }),
      text(answer, {
        fontSize: "14px",
        lineHeight: "1.6",
        color: "#475569",
      }),
    ],
  );
}

function createFaq(): ContainerElement {
  return box(
    {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "16px",
      padding: "64px 32px",
      backgroundColor: "#ffffff",
    },
    [
      text("Frequently asked questions", {
        fontSize: "32px",
        fontWeight: "700",
        color: "#0f172a",
        textAlign: "center",
      }),
      box(
        {
          display: "flex",
          flexDirection: "column",
          gap: "0px",
          width: "100%",
          maxWidth: "560px",
          padding: "8px 0px 0px",
          backgroundColor: "transparent",
        },
        [
          faqItem(
            "Do I need to know how to code?",
            "Not at all — drag blocks onto the canvas and edit them in the side panel.",
          ),
          faqItem(
            "Can I export my page?",
            "Yes. Every page exports to a standalone HTML file you can host anywhere.",
          ),
          faqItem(
            "Is there a free plan?",
            "Yes — the Starter plan is free forever and includes one project.",
          ),
        ],
      ),
    ],
  );
}

function createCta(): ContainerElement {
  return box(
    {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "16px",
      padding: "56px 32px",
      background: "linear-gradient(135deg, #047857 0%, #0f766e 100%)",
    },
    [
      text("Ready to build your page?", {
        fontSize: "30px",
        fontWeight: "700",
        color: "#ffffff",
        textAlign: "center",
        maxWidth: "480px",
      }),
      text("Create a free account and ship your first page in minutes.", {
        fontSize: "16px",
        lineHeight: "1.6",
        color: "#d1fae5",
        textAlign: "center",
        maxWidth: "420px",
      }),
      button("Get started — free", "#", {
        display: "inline-block",
        padding: "12px 24px",
        backgroundColor: "#ffffff",
        color: "#047857",
        borderRadius: "10px",
        fontSize: "15px",
        fontWeight: "600",
        textDecoration: "none",
      }),
    ],
  );
}

/** A complete landing page — every section stacked in page order. */
function createLandingTemplate(): ContainerElement {
  return box(
    {
      display: "flex",
      flexDirection: "column",
      gap: "0px",
      padding: "0px",
      backgroundColor: "#ffffff",
    },
    [
      createHeader(),
      createHero(),
      createFeatures(),
      createStats(),
      createPricing(),
      createTestimonials(),
      createFaq(),
      createCta(),
      createFooter(),
    ],
  );
}

/** Registry of section presets shown in the palette. */
export const SECTION_PRESETS: SectionPreset[] = [
  {
    key: "landing",
    label: "Full landing page",
    description: "Every section, ready to edit",
    icon: LayoutTemplate,
    create: createLandingTemplate,
  },
  {
    key: "header",
    label: "Header",
    description: "Logo, navigation links, and a CTA",
    icon: PanelTop,
    create: createHeader,
  },
  {
    key: "hero",
    label: "Hero",
    description: "Headline, subtext, and call-to-action",
    icon: Sparkles,
    create: createHero,
  },
  {
    key: "features",
    label: "Features",
    description: "A heading and a row of feature cards",
    icon: LayoutGrid,
    create: createFeatures,
  },
  {
    key: "stats",
    label: "Stats",
    description: "A band of headline metrics",
    icon: BarChart3,
    create: createStats,
  },
  {
    key: "pricing",
    label: "Pricing",
    description: "Three-tier pricing plans",
    icon: CreditCard,
    create: createPricing,
  },
  {
    key: "testimonials",
    label: "Testimonials",
    description: "Customer quote cards",
    icon: Quote,
    create: createTestimonials,
  },
  {
    key: "faq",
    label: "FAQ",
    description: "Question-and-answer list",
    icon: CircleHelp,
    create: createFaq,
  },
  {
    key: "cta",
    label: "CTA banner",
    description: "A bold call-to-action band",
    icon: Megaphone,
    create: createCta,
  },
  {
    key: "footer",
    label: "Footer",
    description: "Link columns and fine print",
    icon: PanelBottom,
    create: createFooter,
  },
];

/** Builds a fresh section subtree for the given preset key. */
export function createPreset(key: string): ContainerElement | undefined {
  return SECTION_PRESETS.find((preset) => preset.key === key)?.create();
}
