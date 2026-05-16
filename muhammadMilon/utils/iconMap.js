/**
 * Central Lucide icon registry for the builder and app.
 * Brand icons (Facebook, Twitter, …) were removed from lucide-react; map them to
 * neutral equivalents so imports stay valid across lucide versions.
 */
import {
  Building2,
  Camera,
  CircleQuestionMark,
  Code,
  Send,
  Share2,
} from "lucide-react";

/** @type {Record<string, import("react").ComponentType<{ className?: string }>>} */
const LUCIDE_ICON_MAP = {
  // legacy / builder “social” slots → stable lucide icons
  facebook: Share2,
  twitter: Send,
  instagram: Camera,
  linkedin: Building2,
  github: Code,
  // common aliases
  x: Send,
  "x-twitter": Send,
  git: Code,
  code: Code,
  share: Share2,
  network: Share2,
};

const FALLBACK_ICON = CircleQuestionMark;

/**
 * @param {string} [name]
 * @returns {import("react").ComponentType<{ className?: string }>}
 */
export function getLucideIcon(name) {
  if (!name || typeof name !== "string") return FALLBACK_ICON;
  const key = name.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return LUCIDE_ICON_MAP[key] ?? FALLBACK_ICON;
}

/** Default social strip for portfolio-style hero (logical ids, not lucide export names). */
export const BUILDER_SOCIAL_ICON_IDS = [
  "facebook",
  "twitter",
  "instagram",
  "linkedin",
  "github",
];
