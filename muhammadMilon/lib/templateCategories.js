/**
 * Canonical template category slugs (stored in Template.category and lib/templates).
 * Display labels for UI chips — keep in sync with filtering.
 */

export const TEMPLATE_CATEGORY_OPTIONS = [
  { slug: "saas", label: "SaaS" },
  { slug: "portfolio", label: "Portfolio" },
  { slug: "ecommerce", label: "E-commerce" },
  { slug: "landing-page", label: "Landing Page" },
  { slug: "dashboard", label: "Dashboard" },
  { slug: "agency", label: "Agency" },
  { slug: "blog", label: "Blog" },
  { slug: "startup", label: "Startup" },
  { slug: "admin-panel", label: "Admin Panel" },
  { slug: "marketing-site", label: "Marketing Site" },
  { slug: "lms", label: "LMS" },
];

/** Builder siteType values supported by the palette filter */
export function categorySlugToSiteType(slug) {
  const s = normalizeCategorySlug(slug);
  if (s === "ecommerce") return "ecommerce";
  if (s === "portfolio") return "portfolio";
  if (s === "agency") return "agency";
  if (s === "blog") return "blog";
  if (s === "lms") return "lms";
  return "saas";
}

export function normalizeCategorySlug(raw) {
  if (raw == null || raw === "") return "saas";
  const s = String(raw).toLowerCase().trim().replace(/_/g, "-");
  const map = {
    commerce: "ecommerce",
    shop: "ecommerce",
    store: "ecommerce",
    "e-commerce": "ecommerce",
    "landing page": "landing-page",
    "admin panel": "admin-panel",
    "marketing site": "marketing-site",
    general: "saas",
  };
  if (map[s]) return map[s];
  return s.replace(/\s+/g, "-");
}

export function templateCategoryLabel(slug) {
  const n = normalizeCategorySlug(slug);
  const found = TEMPLATE_CATEGORY_OPTIONS.find((o) => o.slug === n);
  return found ? found.label : slug || "SaaS";
}
