"use client";

import { useSession } from "next-auth/react";
import { AnimatePresence } from "motion/react";
import GlobalLoader from "@/components/ui/GlobalLoader";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface MarketingShellProps {
  children: React.ReactNode;
}

export default function MarketingShell({ children }: MarketingShellProps) {
  const { status } = useSession();

  return (
    <AnimatePresence mode="wait">
      {status === "loading" ? (
        <GlobalLoader key="loader" />
      ) : (
        <>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </>
      )}
    </AnimatePresence>
  );
}
