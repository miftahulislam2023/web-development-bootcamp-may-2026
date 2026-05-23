"use client";

import { Search, User } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { Input } from "@/components/ui/input";

export default function Topbar() {
  const { user } = useAuthStore();

  return (
    <div className="flex h-16 w-full items-center justify-between gap-4 bg-background px-4 sm:px-6">
      <div className="hidden min-w-0 flex-1 max-w-md sm:block">
        {/* Search can be added here if needed */}
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden items-center gap-3 border-l border-border pl-4 sm:flex">
          <div className="hidden text-right md:block">
            <p className="text-sm font-medium">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <User size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}
