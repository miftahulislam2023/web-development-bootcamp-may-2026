// src/components/layout/Topbar.tsx
"use client";

import { Search, Bell, User } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { Input } from "@/components/ui/input";

export default function Topbar() {
  const { user } = useAuthStore();

  return (
    <div className="flex items-center justify-between h-16 border-b border-border bg-background px-6">
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search
            className="absolute left-3 top-3 text-muted-foreground"
            size={18}
          />
          <Input placeholder="Search transactions..." className="pl-10" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-muted rounded-lg transition">
          <Bell size={20} className="text-muted-foreground" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right">
            <p className="text-sm font-medium">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <User size={20} className="text-primary-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}
