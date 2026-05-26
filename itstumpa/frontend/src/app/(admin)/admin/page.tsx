"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface Stats {
  totalUsers: number;
  totalConversations: number;
  totalMessages: number;
  activeUsers: number;
}

const statCards = (stats: Stats) => [
  {
    label: "Total Users",
    value: stats.totalUsers ?? 0,
    icon: "👥",
    color: "from-[#8B5CF6]/20 to-[#8B5CF6]/5",
    border: "border-[#8B5CF6]/20",
  },
  {
    label: "Conversations",
    value: stats.totalConversations ?? 0,
    icon: "💬",
    color: "from-[#06B6D4]/20 to-[#06B6D4]/5",
    border: "border-[#06B6D4]/20",
  },
  {
    label: "Total Messages",
    value: stats.totalMessages ?? 0,
    icon: "📨",
    color: "from-[#10B981]/20 to-[#10B981]/5",
    border: "border-[#10B981]/20",
  },
  {
    label: "Active Users",
    value: stats.activeUsers ?? 0,
    icon: "🟢",
    color: "from-[#F59E0B]/20 to-[#F59E0B]/5",
    border: "border-[#F59E0B]/20",
  },
];

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data.data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-[#F1F5F9]">
          Dashboard
        </h1>
        <p className="text-[#94A3B8] text-sm mt-1">Platform overview</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-[#1E2530] rounded-2xl border border-[#334155] animate-pulse"
            />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards(stats).map((card) => (
            <div
              key={card.label}
              className={`bg-linear-to-br ${card.color} border ${card.border} rounded-2xl p-5 sm:p-6`}
            >
              <div className="text-2xl mb-3">{card.icon}</div>
              <p className="text-2xl sm:text-3xl font-bold text-[#F1F5F9]">
                {card.value.toLocaleString()}
              </p>
              <p className="text-[#94A3B8] text-sm mt-1">{card.label}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[#94A3B8] text-sm">Failed to load stats.</p>
      )}
    </div>
  );
}
