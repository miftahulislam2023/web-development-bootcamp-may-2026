import type { Metadata } from "next";
import ReduxProvider from "@/components/layout/ReduxProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "LiveChat",
  description: "Real-time chat platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0F1419] text-[#F1F5F9] antialiased">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}