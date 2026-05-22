import { DM_Sans, Sora } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata = {
  title: {
    default: "Nexora Studio",
    template: "%s · Nexora Studio",
  },
  description:
    "AI-powered drag-and-drop website builder. Design, generate, and publish modern sites.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${sora.variable} min-h-screen antialiased bg-[var(--background)] text-[var(--foreground)]`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
