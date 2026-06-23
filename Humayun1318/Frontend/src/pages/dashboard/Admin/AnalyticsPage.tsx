import {
  Users,
  UserCheck,
  ShieldCheck,
  Ban,
  UserX,
  Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useGetAdminAnalyticsQuery } from "@/redux/features/admin/admin.api";
import { StatCard } from "@/components/modules/dashboard/admin/StatCard";

// ─── Component ────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const { data, isLoading } = useGetAdminAnalyticsQuery(undefined);

  const analytics = data?.data;

  return (
    <div className="w-full max-w-7xl mx-auto px-5 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            System overview and user statistics.
          </p>
        </div>

        {/* System Status badge */}
        {!isLoading && analytics && (
          <Badge
            variant="outline"
            className={
              analytics.systemStatus === "healthy"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 gap-1.5 px-3 py-1"
                : analytics.systemStatus === "warning"
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-600 gap-1.5 px-3 py-1"
                  : "border-rose-500/40 bg-rose-500/10 text-rose-600 gap-1.5 px-3 py-1"
            }
          >
            <span
              className={`h-2 w-2 rounded-full inline-block ${
                analytics.systemStatus === "healthy"
                  ? "bg-emerald-500"
                  : analytics.systemStatus === "warning"
                    ? "bg-amber-500"
                    : "bg-rose-500"
              }`}
            />
            System{" "}
            {analytics.systemStatus.charAt(0).toUpperCase() +
              analytics.systemStatus.slice(1)}
          </Badge>
        )}
      </div>

      {/* Stat cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-5 space-y-3"
            >
              {/* Header section */}
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-6 w-24 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
              </div>

              {/* Divider */}
              <div className="h-px bg-border" />

              {/* Footer section */}
              <div className="flex items-center justify-between">
                <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                <div className="h-3 w-16 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : analytics ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Total Users"
            value={analytics.totalUsers}
            subtitle="All registered accounts"
            icon={Users}
            variant="default"
          />
          <StatCard
            title="Active Users"
            value={analytics.activeUsers}
            subtitle={`${
              analytics.totalUsers > 0
                ? Math.round(
                    (analytics.activeUsers / analytics.totalUsers) * 100,
                  )
                : 0
            }% of total`}
            icon={UserCheck}
            variant="success"
          />
          <StatCard
            title="Admins"
            value={analytics.totalAdmins}
            subtitle="Administrative accounts"
            icon={ShieldCheck}
            variant="default"
          />
          <StatCard
            title="Suspended"
            value={analytics.suspendedUsers}
            subtitle="Temporarily restricted"
            icon={UserX}
            variant="warning"
          />
          <StatCard
            title="Banned"
            value={analytics.bannedUsers}
            subtitle="Permanently blocked"
            icon={Ban}
            variant="danger"
          />
          <StatCard
            title="System Status"
            value={
              analytics.systemStatus.charAt(0).toUpperCase() +
              analytics.systemStatus.slice(1)
            }
            subtitle="Overall platform health"
            icon={Activity}
            variant={
              analytics.systemStatus === "healthy"
                ? "success"
                : analytics.systemStatus === "warning"
                  ? "warning"
                  : "danger"
            }
          />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No analytics data available.
        </p>
      )}
    </div>
  );
}
