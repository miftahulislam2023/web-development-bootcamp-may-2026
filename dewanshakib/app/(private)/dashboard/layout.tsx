import React, { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex justify-between w-full items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <ThemeToggle/>
          </div>
        </header>
        <div className="px-5">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
