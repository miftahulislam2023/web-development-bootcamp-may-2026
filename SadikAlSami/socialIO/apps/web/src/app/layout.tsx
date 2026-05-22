import type { Metadata } from "next";
import { Nunito } from "next/font/google";

import "../index.css";
import Providers from "@/components/providers";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "social.io",
  description: "The next-generation messaging platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${nunito.variable} antialiased`}>
        <Providers>
          <div className="h-svh">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
