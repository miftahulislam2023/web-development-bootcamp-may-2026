import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-dm-sans",
});

export const metadata = {
  title: "BuildIt | Visual Website Builder",
  description: "A premium visual website builder built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
