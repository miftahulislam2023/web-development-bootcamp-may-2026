import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import NavbarWrapper from "@/components/layout/navbar-wrapper";
import Navbar from "@/components/layout/navbar";
import { Toaster } from "@/components/ui/sonner";
import ThemeProvider from "@/components/layout/theme-provider";
import FooterWrapper from "@/components/layout/footer-wrapper";
import Footer from "@/components/pages/home/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Khorcha • Expense Tracker",
  description:
    "A expense tracker app where you can manage your daily income & expenses to make your lifestyle beautiful & sustaine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <NavbarWrapper>
              <Navbar />
            </NavbarWrapper>
            {children}
            <FooterWrapper>
              <Footer />
            </FooterWrapper>
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
