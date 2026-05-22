import { auth } from "@/lib/auth";
import { listProjectsForUser } from "@/actions/projects";
import { listMyPurchases } from "@/actions/marketplace";
import { listRecentActivity } from "@/actions/history";
import { ProjectsExplorer } from "@/components/dashboard/ProjectsExplorer";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ImportTemplateDialog } from "@/components/dashboard/ImportTemplateDialog";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const [projects, purchases, activity] = await Promise.all([
    listProjectsForUser(),
    listMyPurchases(),
    listRecentActivity(8),
  ]);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
            Projects
          </p>
          <p className="mt-2 font-display text-3xl font-bold">{projects.length}</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
            Published
          </p>
          <p className="mt-2 font-display text-3xl font-bold">
            {projects.filter((p) => p.published?.isActive).length}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
            Templates owned
          </p>
          <p className="mt-2 font-display text-3xl font-bold">{purchases.length}</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
            Account
          </p>
          <p className="mt-2 font-display text-lg font-bold capitalize truncate">
            {session.user.name || session.user.email}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <h2 className="text-sm font-semibold text-[var(--muted-foreground)] mb-3">Quick actions</h2>
        <div className="flex flex-wrap gap-2">
          <a
            href="/dashboard/templates"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium hover:border-[var(--accent)]"
          >
            Browse templates
          </a>
          <a
            href="/dashboard/profile"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium hover:border-[var(--accent)]"
          >
            Profile settings
          </a>
          <ImportTemplateDialog />
        </div>
      </div>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <h2 className="text-sm font-semibold text-[var(--muted-foreground)] mb-3">Recent activity</h2>
        <RecentActivity items={activity} />
      </section>

      <ProjectsExplorer projects={projects} />
    </div>
  );
}
