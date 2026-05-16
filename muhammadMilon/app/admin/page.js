import {
  adminOverviewStats,
  adminPurchaseSeries,
  adminUserGrowthSeries,
  adminPurchaseDistribution,
  adminTemplateUsageStats,
  adminRecentUsers,
  adminRecentPurchases,
} from "@/actions/admin";
import { AdminOverviewCharts } from "@/components/admin/AdminOverviewCharts";
import { format } from "date-fns";

export const metadata = { title: "Admin overview" };

export default async function AdminHomePage() {
  const [
    stats,
    revenueSeries,
    userGrowth,
    purchaseDistribution,
    templateUsage,
    recentUsers,
    recentPurchases,
  ] = await Promise.all([
    adminOverviewStats(),
    adminPurchaseSeries(),
    adminUserGrowthSeries(),
    adminPurchaseDistribution(),
    adminTemplateUsageStats(),
    adminRecentUsers(),
    adminRecentPurchases(),
  ]);

  const cards = [
    { label: "Total users", value: stats.userCount },
    { label: "Premium users", value: stats.premiumUsers },
    { label: "Total purchases", value: stats.purchasesSucceeded },
    { label: "Revenue", value: `$${(stats.revenueCents / 100).toFixed(2)}` },
    { label: "Templates", value: stats.templateCount },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Real-time platform analytics and performance metrics.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition-all hover:shadow-md"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
              {c.label}
            </p>
            <p className="mt-2 font-display text-2xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      <AdminOverviewCharts
        revenueSeries={revenueSeries}
        userGrowth={userGrowth}
        purchaseDistribution={purchaseDistribution}
        templateUsage={templateUsage}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Users */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
          <div className="border-b border-[var(--border)] bg-[var(--muted)]/30 px-6 py-4">
            <h3 className="font-display text-sm font-semibold">Recent Users</h3>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {recentUsers.length ? (
              recentUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-[var(--muted)]/20 transition-colors">
                  <div>
                    <p className="text-sm font-medium">{u.name || "Unknown"}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{u.email}</p>
                  </div>
                  <p className="text-[10px] text-[var(--muted-foreground)] tabular-nums">
                    {format(u.createdAt, "MMM d, HH:mm")}
                  </p>
                </div>
              ))
            ) : (
              <p className="p-8 text-center text-sm text-[var(--muted-foreground)]">No recent users.</p>
            )}
          </div>
        </div>

        {/* Recent Purchases */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
          <div className="border-b border-[var(--border)] bg-[var(--muted)]/30 px-6 py-4">
            <h3 className="font-display text-sm font-semibold">Recent Purchases</h3>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {recentPurchases.length ? (
              recentPurchases.map((p) => (
                <div key={p.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-[var(--muted)]/20 transition-colors">
                  <div>
                    <p className="text-sm font-medium">{p.template?.name || "Template"}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{p.user?.name || p.user?.email || "Unknown"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-500">${(p.amountCents / 100).toFixed(2)}</p>
                    <p className="text-[10px] text-[var(--muted-foreground)] tabular-nums">
                      {format(p.createdAt, "MMM d, HH:mm")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-8 text-center text-sm text-[var(--muted-foreground)]">No recent purchases.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
