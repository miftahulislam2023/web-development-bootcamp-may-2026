"use client";

import { useSession } from "next-auth/react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "../ui/ThemeToggle";
import UserDropdown from "../ui/UserDropdown";

interface TopbarProps {
  onMenuClick?: () => void;
  className?: string;
}

export default function Topbar({ onMenuClick, className }: TopbarProps) {
  const { data: session } = useSession();

  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";
  const userRole =
    session?.user?.role === "admin" ? "Administrator" : "Free Plan";

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header
      className={cn(
        "h-20 bg-background/80 backdrop-blur-md border-b border-border px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40",
        className,
      )}
    >
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <Button
          variant="icon"
          onClick={onMenuClick}
          className="lg:hidden h-10 w-10 shrink-0"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div className="flex flex-col min-w-0">
          <h2 className="text-base sm:text-xl font-black tracking-tight text-foreground leading-none truncate">
            <span className="hidden sm:inline">Welcome back,</span>{" "}
            {userName.split(" ")[0]}! 👋
          </h2>
          <p className="text-[9px] sm:text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-1 sm:mt-1.5 truncate">
            {formattedDate}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />

          <div className="h-8 w-px bg-border mx-2 hidden sm:block" />

          <UserDropdown
            user={{
              name: userName,
              email: userEmail,
              role: userRole,
              image: session?.user?.image || undefined,
            }}
          />
        </div>
      </div>
    </header>
  );
}
