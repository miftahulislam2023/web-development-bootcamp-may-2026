"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAppDispatch } from "@/hooks/redux";
import { setUser, clearUser } from "@/store/slices/authSlice";
import { connectSocket } from "@/lib/socket";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        const raw = res.data.data;
const user = raw.user ?? raw;
        if (user.role === "USER") {
          router.replace("/dashboard");
          return;
        }
        dispatch(setUser(user));
        connectSocket();
      } catch {
        dispatch(clearUser());
        router.replace("/login");
      } finally {
        setChecking(false);
      }
    };
    checkAuth();
  }, [dispatch, router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0F1419] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#06B6D4] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0F1419] flex overflow-hidden">
      <div className="hidden md:flex md:flex-col shrink-0">
        <AdminSidebar />
      </div>

      <div className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 md:hidden ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[#334155] bg-[#1E2530] md:hidden shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="flex flex-col gap-1 p-1">
            <span className="block w-5 h-0.5 bg-[#F1F5F9]" />
            <span className="block w-5 h-0.5 bg-[#F1F5F9]" />
            <span className="block w-5 h-0.5 bg-[#F1F5F9]" />
          </button>
          <span className="font-bold bg-linear-to-r from-[#8B5CF6] via-[#06B6D4] to-[#10B981] bg-clip-text text-transparent">
            Admin Panel
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}