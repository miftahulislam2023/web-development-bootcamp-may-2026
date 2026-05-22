import type { Metadata } from "next";
import { Alegreya, DM_Sans, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import AuthProvider from "@/components/providers/AuthProvider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const alegreya = Alegreya({
  variable: "--font-alegreya",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const siteConfig = {
  name: "Spend Sentry",
  description:
    "Spend Sentry is a modern AI-ready personal finance and expense tracking platform built to help users monitor spending, analyze financial habits, manage budgets, and gain actionable insights through a clean analytics-focused dashboard experience.",

  url: "https://spend-sentry1.vercel.app",

  ogImage:
    "https://res.cloudinary.com/drxq8gxwh/image/upload/v1778950966/spendsentry_1_kt4g3y.png",

  dashboardPreview:
    "https://res.cloudinary.com/drxq8gxwh/image/upload/v1778950688/spend-sentry1-dashboard_vilf9y.png",

  logo: 
    "https://res.cloudinary.com/drxq8gxwh/image/upload/v1778950687/spend-sentry-logo_1_twm8aa.png",

  creator: "Hamza",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: "Spend Sentry | Smart Personal Expense Tracker",
    template: "%s | Spend Sentry",
  },

  description: siteConfig.description,

  keywords: [
    "Expense Tracker",
    "Personal Finance App",
    "Budget Management",
    "Financial Dashboard",
    "Expense Analytics",
    "Money Management",
    "Next.js Finance App",
    "MERN Expense Tracker",
    "Finance Analytics Platform",
    "AI Ready Expense Tracker",
    "Budget Planner",
    "Transaction Monitoring",
    "Spending Insights",
    "Expense Management System",
    "Modern Finance Dashboard",
  ],

  authors: [
    {
      name: siteConfig.creator,
    },
  ],

  creator: siteConfig.creator,
  publisher: siteConfig.creator,

  applicationName: "Spend Sentry",

  category: "Finance",

  alternates: {
    canonical: siteConfig.url,
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,

    title: "Spend Sentry | Smart Personal Expense Tracker",

    description:
      "Track expenses, manage budgets, analyze spending behavior, and monitor financial activity through a modern analytics-focused dashboard built with Next.js.",

    siteName: "Spend Sentry",

    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Spend Sentry Homepage Preview",
      },
      {
        url: siteConfig.dashboardPreview,
        width: 1200,
        height: 630,
        alt: "Spend Sentry Dashboard Analytics Preview",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Spend Sentry | Smart Personal Expense Tracker",

    description:
      "Modern personal finance and expense tracking platform with analytics dashboard, budget monitoring, and financial insights.",

    images: [siteConfig.ogImage],

    creator: "@hadialhamza",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [
      {
        url: siteConfig.logo,
        type: "image/png",
      },
    ],

    shortcut: [siteConfig.logo],

    apple: [siteConfig.logo],
  },

  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${dmSans.variable} ${alegreya.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh flex flex-col">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-right" richColors closeButton />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
