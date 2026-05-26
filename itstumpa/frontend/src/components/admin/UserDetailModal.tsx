"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface UserDetail {
  id: string;
  name: string;
  email: string;
  role: string;
  isOnline: boolean;
  isSuspended: boolean;
  createdAt: string;
  lastSeen?: string;
}

interface UserDetailModalProps {
  userId: string;
  onClose: () => void;
}

export default function UserDetailModal({
  userId,
  onClose,
}: UserDetailModalProps) {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);

      try {
        const res = await api.get(`/users/${userId}`);
        const result = res.data.data;
        setUser(result?.user ?? result ?? null);
      } catch (error) {
        console.error("Failed to load user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-sm bg-[#1E2530] border border-[#334155] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#334155]">
          <h2 className="text-[#F1F5F9] font-semibold text-sm">
            User Details
          </h2>

          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#F1F5F9] transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 rounded-full border-2 border-[#06B6D4] border-t-transparent animate-spin" />
          </div>
        ) : user ? (
          <div className="px-5 py-5 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-linear-to-br from-[#8B5CF6] to-[#06B6D4] flex items-center justify-center text-white font-bold text-xl">
                  {user.name?.charAt(0).toUpperCase() ?? "U"}
                </div>

                {user.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#10B981] rounded-full border-2 border-[#1E2530]" />
                )}
              </div>

              <div>
                <p className="text-[#F1F5F9] font-semibold">{user.name}</p>
                <p className="text-[#94A3B8] text-sm">{user.email}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 bg-[#0F1419] rounded-xl p-4">
              {[
                { label: "Role", value: user.role },
                {
                  label: "Status",
                  value: user.isSuspended
                    ? "Suspended"
                    : user.isOnline
                    ? "Online"
                    : "Offline",
                },
                {
                  label: "Joined",
                  value: user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "—",
                },
                {
                  label: "Last Seen",
                  value: user.lastSeen
                    ? new Date(user.lastSeen).toLocaleString()
                    : "—",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between"
                >
                  <span className="text-[#94A3B8] text-xs">
                    {item.label}
                  </span>
                  <span className="text-[#F1F5F9] text-xs font-medium">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-sm font-medium text-[#94A3B8] border border-[#334155] hover:border-[#06B6D4]/50 hover:text-[#F1F5F9] transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <p className="text-[#94A3B8] text-sm text-center py-12">
            Failed to load user.
          </p>
        )}
      </div>
    </div>
  );
}