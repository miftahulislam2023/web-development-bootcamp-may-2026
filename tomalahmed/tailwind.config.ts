import type { Config } from "tailwindcss";

/** Tailwind v4: theme lives in `app/globals.css` via `@theme` and `@import "@heroui/styles"`. */
export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
} satisfies Config;
