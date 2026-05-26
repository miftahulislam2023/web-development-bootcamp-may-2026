"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAppDispatch } from "@/hooks/redux";
import { setUser, clearUser } from "@/store/slices/authSlice";
import { connectSocket } from "@/lib/socket";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        const raw = res.data.data;
const user = raw.user ?? raw;
        if (user.role !== "USER") {
          router.replace("/admin");
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

  return <>{children}</>;
}