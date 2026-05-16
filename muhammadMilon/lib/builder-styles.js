/** Resolve section style for the active builder viewport. */
export function resolveSectionStyle(style = {}, viewport = "desktop") {
  const base = { ...style };
  const responsive = style.responsive?.[viewport];
  if (responsive && typeof responsive === "object") {
    Object.assign(base, responsive);
  }
  delete base.responsive;
  return base;
}

export const FONT_OPTIONS = [
  { value: "inherit", label: "Default" },
  { value: "var(--font-display), system-ui", label: "Display" },
  { value: "Georgia, serif", label: "Serif" },
  { value: "ui-monospace, monospace", label: "Mono" },
];
