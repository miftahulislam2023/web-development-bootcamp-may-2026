import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata = {
  title: "Fylestash - Secure File Hosting",
  description:
    "Secure, fast, and shareable file hosting service. Keep your files safe with end-to-end encryption and easy sharing.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-background text-foreground">
        <Suspense fallback={<div className="text-zinc-500">Loading...</div>}>
          <AuthProvider>
            {children}
            {process.env.NODE_ENV === "production" && <Analytics />}
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
