import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { AIChatInterface } from "../ai/AIChatInterface";
import { GlobalSearch } from "../ui/GlobalSearch";

interface AppLayoutProps {
  children: ReactNode;
  className?: string;
}

export function AppLayout({ children, className }: AppLayoutProps) {
  return (
    <div className={`max-w-6xl mx-auto px-3 sm:px-4 md:px-6 pt-4 sm:pt-6 md:pt-6 pb-32 ${className}`}>
      {children}
    </div>
  );
}
