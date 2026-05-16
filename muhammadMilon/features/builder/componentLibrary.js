import { createId } from "@/utils/id";

/**
 * COMPONENT CATEGORIES & METADATA
 * Each component defines its metadata, tags, and prop schema.
 */
export const COMPONENT_LIBRARY = [
  // NAVBARS (5+)
  { type: "navbar-basic", label: "Navbar Basic", category: "Layout", tags: ["all"], schema: [
    { prop: "brand", label: "Brand Name", type: "text", group: "content" },
    { prop: "logoUrl", label: "Logo image", type: "image", group: "content" },
    { prop: "logoAlt", label: "Logo alt text", type: "text", group: "content" },
    { prop: "menuItems", label: "Menu (one per line: Label|/url, dropdown:Name, >Child|/url)", type: "textarea", group: "content" },
    { prop: "cta", label: "CTA Button Text", type: "text", group: "content" },
    { prop: "sticky", label: "Sticky navbar", type: "toggle", group: "settings" },
  ]},
  { type: "navbar-centered", label: "Navbar Centered", category: "Layout", tags: ["all"], schema: [
    { prop: "brand", label: "Brand", type: "text", group: "content" },
    { prop: "logoUrl", label: "Logo image", type: "image", group: "content" },
    { prop: "menuItems", label: "Menu lines", type: "textarea", group: "content" },
    { prop: "sticky", label: "Sticky navbar", type: "toggle", group: "settings" },
  ]},
  { type: "navbar-dark", label: "Navbar Dark", category: "Layout", tags: ["all"] },
  { type: "navbar-glass", label: "Navbar Glass", category: "Layout", tags: ["all"] },
  { type: "navbar-ecommerce", label: "Navbar Store", category: "Ecommerce", tags: ["ecommerce"] },

  // HERO SECTIONS (10+)
  { type: "hero-saas", label: "Hero SaaS", category: "Marketing", tags: ["saas"], schema: [
    { prop: "title", label: "Headline", type: "text", group: "content" },
    { prop: "subtitle", label: "Description", type: "textarea", group: "content" },
    { prop: "primaryCta", label: "Primary Button", type: "text", group: "content" },
    { prop: "secondaryCta", label: "Secondary Button", type: "text", group: "content" },
    { prop: "image", label: "Hero Image URL", type: "image", group: "content" },
    { prop: "align", label: "Text Alignment", type: "select", options: ["left", "center", "right"], group: "settings" },
  ]},
  { type: "hero-portfolio", label: "Hero Portfolio", category: "Marketing", tags: ["portfolio"], schema: [
    { prop: "title", label: "Greeting", type: "text", group: "content" },
    { prop: "subtitle", label: "Role/Tagline", type: "text", group: "content" },
    { prop: "image", label: "Portrait URL", type: "image", group: "content" },
  ]},
  { type: "hero-ecommerce", label: "Hero Store", category: "Ecommerce", tags: ["ecommerce"] },
  { type: "hero-agency", label: "Hero Agency", category: "Marketing", tags: ["agency"] },
  { type: "hero-video", label: "Hero Video", category: "Marketing", tags: ["all"] },
  { type: "hero-split", label: "Hero Split", category: "Marketing", tags: ["all"] },
  { type: "hero-gradient", label: "Hero Gradient", category: "Marketing", tags: ["all"] },
  { type: "hero-minimal", label: "Hero Minimal", category: "Marketing", tags: ["all"], schema: [
    { prop: "title", label: "Headline", type: "text", group: "content" },
    { prop: "subtitle", label: "Subtext", type: "textarea", group: "content" },
  ]},
  { type: "hero-product", label: "Hero Product", category: "Ecommerce", tags: ["ecommerce"] },
  { type: "hero-course", label: "Hero Course", category: "Marketing", tags: ["lms", "all"] },

  // FEATURES (5+)
  { type: "features-grid", label: "Features Grid", category: "Marketing", tags: ["all", "blog", "saas"], schema: [
    { prop: "heading", label: "Heading", type: "text", group: "content" },
  ]},
  { type: "features-list", label: "Features List", category: "Marketing", tags: ["all"] },
  { type: "features-cards", label: "Features Cards", category: "Marketing", tags: ["all"] },
  { type: "features-tabs", label: "Features Tabs", category: "Marketing", tags: ["saas"] },
  { type: "features-icons", label: "Features Icons", category: "Marketing", tags: ["all"] },

  // ABOUT (3+)
  { type: "about-simple", label: "About Simple", category: "Marketing", tags: ["all"] },
  { type: "about-split", label: "About Split", category: "Marketing", tags: ["all"] },
  { type: "about-stats", label: "About & Stats", category: "Marketing", tags: ["all"] },

  // PRICING (5+)
  { type: "pricing-cards", label: "Pricing Cards", category: "Marketing", tags: ["saas"], schema: [
    { prop: "heading", label: "Heading", type: "text", group: "content" },
  ]},
  { type: "pricing-table", label: "Pricing Table", category: "Marketing", tags: ["saas"] },
  { type: "pricing-single", label: "Pricing Single", category: "Marketing", tags: ["all"] },
  { type: "pricing-comparison", label: "Pricing Compare", category: "Marketing", tags: ["saas"] },
  { type: "pricing-minimal", label: "Pricing Minimal", category: "Marketing", tags: ["all"] },

  // TESTIMONIALS (5+)
  { type: "testimonials-grid", label: "Testimonials Grid", category: "Marketing", tags: ["all"] },
  { type: "testimonials-slider", label: "Testimonials Slider", category: "Marketing", tags: ["all"] },
  { type: "testimonials-single", label: "Testimonial Single", category: "Marketing", tags: ["all"] },
  { type: "testimonials-bubbles", label: "Testimonial Bubbles", category: "Marketing", tags: ["all"] },
  { type: "testimonials-cards", label: "Testimonial Cards", category: "Marketing", tags: ["all"] },

  // PORTFOLIO / GALLERY (5+)
  { type: "portfolio-grid", label: "Portfolio Grid", category: "Portfolio", tags: ["portfolio", "agency"] },
  { type: "gallery-masonry", label: "Gallery Masonry", category: "Portfolio", tags: ["portfolio"] },
  { type: "gallery-lightbox", label: "Gallery Lightbox", category: "Portfolio", tags: ["portfolio"] },
  { type: "project-showcase", label: "Project Showcase", category: "Portfolio", tags: ["portfolio"] },
  { type: "client-work", label: "Client Work", category: "Portfolio", tags: ["agency"] },

  // ECOMMERCE (5+)
  { type: "product-grid", label: "Product Grid", category: "Ecommerce", tags: ["ecommerce"] },
  { type: "product-info", label: "Product Detail", category: "Ecommerce", tags: ["ecommerce"], schema: [
    { prop: "name", label: "Product Name", type: "text", group: "content" },
    { prop: "price", label: "Price", type: "text", group: "content" },
    { prop: "description", label: "Description", type: "textarea", group: "content" },
    { prop: "image", label: "Image URL", type: "image", group: "content" },
  ]},
  { type: "cart-summary", label: "Cart Summary", category: "Ecommerce", tags: ["ecommerce"] },
  { type: "category-list", label: "Category List", category: "Ecommerce", tags: ["ecommerce"] },
  { type: "promo-banner", label: "Promo Banner", category: "Ecommerce", tags: ["ecommerce"] },

  // BLOG (3+)
  { type: "blog-grid", label: "Blog Grid", category: "Marketing", tags: ["blog"] },
  { type: "blog-post-minimal", label: "Blog Post Row", category: "Marketing", tags: ["blog"] },
  { type: "blog-newsletter", label: "Blog & Newsletter", category: "Marketing", tags: ["blog"] },

  // CTA SECTIONS (3+)
  { type: "cta-banner", label: "CTA Banner", category: "Marketing", tags: ["all", "blog", "saas"], schema: [
    { prop: "title", label: "Heading", type: "text", group: "content" },
    { prop: "subtitle", label: "Subtext", type: "text", group: "content" },
    { prop: "label", label: "Button Text", type: "text", group: "content" },
  ]},
  { type: "cta-minimal", label: "CTA Minimal", category: "Marketing", tags: ["all"] },
  { type: "cta-dark", label: "CTA Dark", category: "Marketing", tags: ["all"] },

  // TEAM (3+)
  { type: "team-grid", label: "Team Grid", category: "Marketing", tags: ["agency", "saas"] },
  { type: "team-list", label: "Team List", category: "Marketing", tags: ["all"] },
  { type: "team-cards", label: "Team Cards", category: "Marketing", tags: ["all"] },

  // STATS (3+)
  { type: "stats-simple", label: "Stats Simple", category: "Marketing", tags: ["all"] },
  { type: "stats-cards", label: "Stats Cards", category: "Marketing", tags: ["saas"] },
  { type: "stats-split", label: "Stats & Text", category: "Marketing", tags: ["all"] },

  // FOOTERS (5+)
  { type: "footer-basic", label: "Footer Basic", category: "Layout", tags: ["all"], schema: [
    { prop: "brand", label: "Brand", type: "text", group: "content" },
    { prop: "tagline", label: "Tagline", type: "text", group: "content" },
    { prop: "columns", label: "Columns (--- between groups)", type: "textarea", group: "content" },
    { prop: "socialLinks", label: "Social (twitter:url,github:url)", type: "text", group: "content" },
    { prop: "copyright", label: "Copyright", type: "text", group: "content" },
    { prop: "email", label: "Contact email", type: "text", group: "content" },
    { prop: "phone", label: "Phone", type: "text", group: "content" },
    { prop: "address", label: "Address", type: "text", group: "content" },
  ]},
  { type: "footer-multi", label: "Footer Columns", category: "Layout", tags: ["all"] },
  { type: "footer-newsletter", label: "Footer & Newsletter", category: "Layout", tags: ["all"] },
  { type: "footer-centered", label: "Footer Centered", category: "Layout", tags: ["all"] },
  { type: "footer-social", label: "Footer Social", category: "Layout", tags: ["all"] },

  // FORMS & CONTACT (3+)
  { type: "contact-form", label: "Contact Form", category: "Basic", tags: ["all"], schema: [
    { prop: "heading", label: "Heading", type: "text", group: "content" },
    { prop: "fields", label: "Fields (JSON array)", type: "textarea", group: "content" },
    { prop: "submitLabel", label: "Submit button", type: "text", group: "content" },
    { prop: "successMessage", label: "Success message", type: "text", group: "content" },
  ]},
  { type: "rich-text", label: "Rich Text", category: "Basic", tags: ["all", "blog"], schema: [
    { prop: "html", label: "Content", type: "richtext", group: "content" },
  ]},
  { type: "contact-info", label: "Contact Info Map", category: "Basic", tags: ["all"] },
  { type: "contact-minimal", label: "Contact Minimal", category: "Basic", tags: ["all"] },

  // FAQ (3+)
  { type: "faq-basic", label: "FAQ Simple", category: "Basic", tags: ["all"], schema: [
    { prop: "heading", label: "Heading", type: "text", group: "content" },
  ]},
  { type: "faq-accordion", label: "FAQ Accordion", category: "Basic", tags: ["all"] },
  { type: "faq-cards", label: "FAQ Cards", category: "Basic", tags: ["all"] },

  // UI BLOCKS
  { type: "auth-login", label: "Login Box", category: "Layout", tags: ["all"] },
  { type: "auth-register", label: "Register Box", category: "Layout", tags: ["all"] },
  { type: "dashboard-stats", label: "Dashboard Grid", category: "Layout", tags: ["saas"] },

  // LAYOUT
  { type: "bento-grid", label: "Bento Layout", category: "Layout", tags: ["saas"] },
  { type: "columns-2", label: "2 Column Split", category: "Layout", tags: ["all"] },
  { type: "layout-columns", label: "Nested Columns", category: "Layout", tags: ["all"], schema: [
    { prop: "gap", label: "Column gap (px)", type: "text", group: "settings" },
  ]},
  { type: "card-feature", label: "Feature Card", category: "Marketing", tags: ["all"], schema: [
    { prop: "title", label: "Title", type: "text", group: "content" },
    { prop: "body", label: "Body", type: "textarea", group: "content" },
    { prop: "buttonLabel", label: "Button", type: "text", group: "content" },
  ]},
  { type: "button-cta", label: "CTA Button", category: "Marketing", tags: ["all"], schema: [
    { prop: "label", label: "Button text", type: "text", group: "content" },
    { prop: "align", label: "Alignment", type: "alignment", group: "design" },
  ]},
  { type: "form-input", label: "Form Field", category: "Basic", tags: ["all"], schema: [
    { prop: "label", label: "Label", type: "text", group: "content" },
    { prop: "placeholder", label: "Placeholder", type: "text", group: "content" },
    { prop: "inputType", label: "Type", type: "select", options: ["text", "email", "tel", "number"], group: "settings" },
    { prop: "helper", label: "Helper text", type: "text", group: "content" },
  ]},
  { type: "spacer-sm", label: "Spacer Small", category: "Layout", tags: ["all"] },
  { type: "spacer-lg", label: "Spacer Large", category: "Layout", tags: ["all"] },
];

/**
 * Default configurations for each component type.
 */
export const COMPONENT_DEFAULTS = {
  "navbar-basic": {
    brand: "Nexora",
    menuItems: "Home|#\nFeatures|#\nPricing|#\nAbout|#",
    cta: "Sign Up",
    sticky: true,
  },
  "navbar-centered": {
    brand: "Studio",
    menuItems: "Work|#\nAbout|#\nContact|#",
    sticky: false,
  },
  "hero-saas": {
    title: "The future of visual building.",
    subtitle: "Create high-performance websites in minutes with our advanced drag-and-drop system.",
    primaryCta: "Start Building",
    secondaryCta: "View Demos",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    align: "left"
  },
  "hero-portfolio": {
    title: "Hi, I'm Alex",
    subtitle: "Product Designer & Visual Builder",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
  },
  "product-info": {
    name: "Nexora Pro Edition",
    price: "$299",
    description: "The ultimate tool for professional designers. Includes all premium components and priority support.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
  },
  "cta-banner": {
    title: "Ready to launch?",
    subtitle: "Join over 10,000 creators building with Nexora Studio.",
    label: "Get Started Free"
  },
  "bento-grid": {
    heading: "Everything you need",
    title1: "Rapid Development",
    title2: "Enterprise Grade",
    title3: "Global Edge"
  },
  "columns-2": {
    leftTitle: "Our Approach",
    rightTitle: "Your Success",
    ratio: "1/1"
  },
  "features-grid": { heading: "Core Features" },
  "pricing-cards": { heading: "Flexible Plans" },
  "team-grid": { heading: "Meet our team" },
  "stats-simple": { heading: "Our impact in numbers" },
  "faq-basic": { heading: "Common Questions" },
  "footer-basic": {
    brand: "Nexora",
    tagline: "Build beautiful sites visually.",
    copyright: "© 2026 Nexora Studio. All rights reserved.",
    socialLinks: "twitter:#,github:#,linkedin:#",
    email: "hello@example.com",
  },
  "contact-form": {
    heading: "Get in touch",
    submitLabel: "Send message",
    successMessage: "Thanks! We will reply soon.",
    fields: JSON.stringify([
      { id: "name", type: "text", label: "Name", required: true, placeholder: "Your name" },
      { id: "email", type: "email", label: "Email", required: true, placeholder: "you@email.com" },
      { id: "message", type: "textarea", label: "Message", required: true, placeholder: "How can we help?" },
    ], null, 2),
  },
  "rich-text": {
    html: "<h2>Your story</h2><p>Write compelling copy with <strong>bold</strong>, lists, and links.</p>",
  },
  "hero-minimal": {
    title: "Build something remarkable",
    subtitle: "A minimal hero for focused messaging.",
  },
  "layout-columns": { gap: 24 },
  "card-feature": {
    title: "Powerful feature",
    body: "Describe your product benefit in one clear sentence.",
    buttonLabel: "Learn more",
  },
  "button-cta": { label: "Get started", align: "center" },
  "form-input": {
    label: "Email address",
    placeholder: "you@company.com",
    inputType: "email",
    helper: "We never share your email.",
  },
};

/**
 * Filter components based on site type.
 */
export function getRecommendedComponents(siteType) {
  if (!siteType) return COMPONENT_LIBRARY.filter(c => c.tags.includes("all"));
  const type = siteType.toLowerCase();
  return COMPONENT_LIBRARY.filter(c => c.tags.includes(type) || c.tags.includes("all"));
}
