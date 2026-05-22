"use client";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function FooterWrapper({ children }: { children: ReactNode }) {
  const path = usePathname();
  // console.log("Path ============>\n", path);

  if (path.startsWith("/dashboard")) {
    return <div className=" hidden"></div>;
  }

  return <>{children}</>;
}
