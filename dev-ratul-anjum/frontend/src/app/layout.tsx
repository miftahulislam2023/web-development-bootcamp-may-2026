import "./globals.css";
import { Ubuntu } from "next/font/google";
import Providers from "@/providers";
import GlobalToast from "@/components/GlobalToast";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata = {
  title: "Dialog",
  description: "Chat, explore rooms, and connect with others seamlessly.",
  keywords: ["Dialog", "chat app", "messaging platform", "404", "error page"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={ubuntu.className}>
        <Providers>
          {children}
          <GlobalToast />
        </Providers>
      </body>
    </html>
  );
}
