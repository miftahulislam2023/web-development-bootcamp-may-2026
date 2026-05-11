"use client";

import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <Script id="clean-injected-attrs" strategy="beforeInteractive">
        {`(function(){try{var html=document.documentElement,body=document.body;function clean(el){if(!el||!el.attributes)return;Array.from(el.attributes).forEach(function(a){var n=a.name;if(/^(__processed_|data-arp|bis_register)/.test(n)){el.removeAttribute(n);}});}clean(html);clean(body);}catch(e){}})();`}
      </Script>
      <body className="min-h-full flex flex-col">
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
