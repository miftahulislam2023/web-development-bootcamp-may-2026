"use client";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

export default function NavbarWrapper({ children }: { children: ReactNode }) {
  const path = usePathname();
  // console.log("Path ============>\n", path);

  if (path.startsWith("/dashboard")) {
    return <div className=" hidden"></div>;
  }

  return <>{children}</>;
}
