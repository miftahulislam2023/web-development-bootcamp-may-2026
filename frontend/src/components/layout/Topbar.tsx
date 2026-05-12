"use client";

import { Bell, Search, User } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { Input } from "@/components/ui/input";

export default function Topbar() {
  const { user } = useAuthStore();

  return (
    <div className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
      <div className="relative w-full max-w-md">
        <Search
          className="absolute left-3 top-3 text-muted-foreground"
          size={18}
        />
        <Input placeholder="Search transactions..." className="pl-10" />
      </div>
      <div className="flex items-center gap-4">
        <button className="rounded-lg p-2 hover:bg-muted">
          <Bell size={18} className="text-muted-foreground" />
        </button>
        <div className="flex items-center gap-3 border-l border-border pl-4">
          <div className="text-right">
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
