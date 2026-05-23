import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AppProvider } from "@/context/AppContext";
import { SocketProvider } from "@/context/SocketContext";

export const metadata: Metadata = {
  title: "Alapon",
  description: "Live Chat Platform",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        <AppProvider> 
        <SocketProvider>{children}</SocketProvider>
        </AppProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
