import type { Metadata } from "next";
import Script from "next/script";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Personal Expense Tracker",
  description: "Track expenses and manage your finances efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <Script id="clean-injected-attrs" strategy="beforeInteractive">
        {`(function(){try{var html=document.documentElement,body=document.body;function clean(el){if(!el||!el.attributes)return;Array.from(el.attributes).forEach(function(a){var n=a.name;if(/^(__processed_|data-arp|bis_register)/.test(n)){el.removeAttribute(n);}});}clean(html);clean(body);}catch(e){}})();`}
      </Script>

      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <Toaster richColors position="bottom-right" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}