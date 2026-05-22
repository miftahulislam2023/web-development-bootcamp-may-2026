import { createId } from "@/utils/id";
import { COMPONENT_DEFAULTS } from "@/features/builder/componentLibrary";

function createSection(type, props = {}) {
  return {
    id: createId(),
    type,
    style: {
      paddingY: type.startsWith("hero") ? 96 : 64,
      paddingX: 24,
      maxWidth: 1200,
      background: "transparent",
      textColor: "inherit",
    },
    props: { ...(COMPONENT_DEFAULTS[type] || {}), ...props },
  };
}

export const TEMPLATES = [
  {
    id: "tpl-saas",
    name: "SaaS Landing Page",
    category: "SaaS",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    description: "High-converting SaaS landing page with hero, bento grid, and pricing.",
    canvasData: {
      version: 1,
      sections: [
        createSection("navbar-basic", { brand: "Nexora SaaS", sticky: true }),
        createSection("hero-saas", { title: "Automate your workflow.", subtitle: "The all-in-one platform for modern teams." }),
        createSection("bento-grid", { heading: "Engineered for speed" }),
        createSection("stats-simple", { heading: "Trusted by thousands" }),
        createSection("pricing-cards", { heading: "Simple Pricing" }),
        createSection("cta-banner", { title: "Start your trial today" }),
        createSection("footer-basic"),
      ]
    }
  },
  {
    id: "tpl-portfolio",
    name: "Visual Portfolio",
    category: "Portfolio",
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    description: "Clean portfolio for designers and developers.",
    canvasData: {
      version: 1,
      sections: [
        createSection("navbar-centered", { brand: "Alex.Design" }),
        createSection("hero-portfolio", { title: "Visual Storyteller", subtitle: "Senior Product Designer" }),
        createSection("portfolio-grid", { heading: "Selected Works" }),
        createSection("cta-minimal", { title: "Let's work together" }),
        createSection("footer-basic"),
      ]
    }
  },
  {
    id: "tpl-ecommerce",
    name: "Modern Storefront",
    category: "Ecommerce",
    thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    description: "Elegant shop layout with product grid and featured item.",
    canvasData: {
      version: 1,
      sections: [
        createSection("navbar-basic", { brand: "Nexora Store" }),
        createSection("hero-saas", { title: "New Season Collection", subtitle: "Sustainable fashion for the modern era." }),
        createSection("product-grid", { heading: "New Arrivals" }),
        createSection("product-info", { name: "Signature Hoodie", price: "$89" }),
        createSection("footer-basic"),
      ]
    }
  }
];
