"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import UserDetailModal from "@/components/admin/UserDetailModal";


interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isSuspended: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
const res = await api.get("/admin/users");
const result = res.data.data;
setUsers(Array.isArray(result) ? result : result.users ?? result.data ?? []);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSuspend = async (userId: string, isSuspended: boolean) => {
    setActionLoading(userId);
    try {
      if (isSuspended) {
        await api.post(`/admin/users/${userId}/unsuspend`);
      } else {
        await api.post(`/admin/users/${userId}/suspend`);
      }
      setUsers((prev) =>
        prev.map((u) => u.id === userId ? { ...u, isSuspended: !isSuspended } : u)
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[#F1F5F9]">Users</h1>
        <p className="text-[#94A3B8] text-sm mt-1">Manage platform users</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 rounded-full border-2 border-[#06B6D4] border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="bg-[#1E2530] border border-[#334155] rounded-2xl overflow-hidden">
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#334155]">
                  {["User", "Email", "Role", "Status", "Joined", "Action"].map((h) => (
                    <th key={h} className="text-left px-5 py-4 text-[#94A3B8] font-medium text-xs uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
<tr key={u.id} onClick={() => setSelectedUserId(u.id)} className="border-b border-[#334155]/50 hover:bg-[#0F1419]/30 transition-colors cursor-pointer">                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#8B5CF6] to-[#06B6D4] flex items-center justify-center text-white font-bold text-xs shrink-0">
                          {u.name[0].toUpperCase()}
                        </div>
                        <span className="text-[#F1F5F9] font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#94A3B8]">{u.email}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                        u.role === "SUPER_ADMIN"
                          ? "bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20"
                          : u.role === "ADMIN"
                          ? "bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20"
                          : "bg-[#334155] text-[#94A3B8] border-[#334155]"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                        u.isSuspended
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                      }`}>
                        {u.isSuspended ? "Suspended" : "Active"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#94A3B8]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      {u.role !== "SUPER_ADMIN" && (
                        <button
  onClick={(e) => {
    e.stopPropagation();
    handleSuspend(u.id, u.isSuspended);
  }}
  disabled={actionLoading === u.id}
  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 ${
    u.isSuspended
      ? "bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20"
      : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
  }`}
>
  {actionLoading === u.id
    ? "..."
    : u.isSuspended
    ? "Unsuspend"
    : "Suspend"}
</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden flex flex-col divide-y divide-[#334155]/50">
            {users.map((u) => (
              <div key={u.id} className="px-4 py-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
  <div onClick={() => setSelectedUserId(u.id)} className="flex items-center gap-3 cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#8B5CF6] to-[#06B6D4] flex items-center justify-center text-white font-bold text-sm">
                      {u.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[#F1F5F9] font-medium text-sm">{u.name}</p>
                      <p className="text-[#94A3B8] text-xs">{u.email}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                    u.isSuspended
                      ? "bg-red-500/10 text-red-400 border-red-500/20"
                      : "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                  }`}>
                    {u.isSuspended ? "Suspended" : "Active"}
                  </span>
                </div>
                {u.role !== "SUPER_ADMIN" && (
                 <button
  onClick={(e) => {
    e.stopPropagation();
    handleSuspend(u.id, u.isSuspended);
  }}
  disabled={actionLoading === u.id}
  className={`w-full text-xs py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
    u.isSuspended
      ? "bg-[#10B981]/10 text-[#10B981]"
      : "bg-red-500/10 text-red-400"
  }`}
>
  {actionLoading === u.id
    ? "..."
    : u.isSuspended
    ? "Unsuspend"
    : "Suspend"}
</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {selectedUserId && (
  <UserDetailModal
    userId={selectedUserId}
    onClose={() => setSelectedUserId(null)}
  />
)}
    </div>
  );
}