"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, Pencil, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteProject } from "@/actions/projects";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { CreateProjectDialog } from "@/components/dashboard/CreateProjectDialog";
import { cn } from "@/utils/cn";

export function ProjectsExplorer({ projects }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return projects;
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.slug.toLowerCase().includes(needle),
    );
  }, [projects, q]);

  const recent = useMemo(() => [...projects].slice(0, 4), [projects]);

  async function onDelete(id) {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    const res = await deleteProject(id);
    if (!res.ok) {
      toast.error(res.error || "Delete failed");
      return;
    }
    toast.success("Project deleted");
    setOpenMenu(null);
    router.refresh();
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Create, search, and open your sites.
          </p>
        </div>
        <CreateProjectDialog />
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-[var(--muted-foreground)]">
          Recent
        </h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {recent.map((p) => (
            <Link key={p.id} href={`/dashboard/projects/${p.slug}/builder`}>
              <Card className="h-full p-4 transition hover:border-[var(--accent)]/40">
                <div className="font-medium">{p.name}</div>
                <div className="mt-1 text-xs text-[var(--muted-foreground)]">
                  Updated {formatDistanceToNow(new Date(p.updatedAt), { addSuffix: true })}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold text-[var(--muted-foreground)]">
            All projects
          </h2>
          <Input
            placeholder="Search by name or slug…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--muted)]/40 text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Slug</th>
                <th className="hidden px-4 py-3 font-medium lg:table-cell">Updated</th>
                <th className="px-4 py-3 font-medium">Publish</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-[var(--border)] bg-[var(--card)]">
                  <td className="px-4 py-3 font-medium">
                    <Link
                      href={`/dashboard/projects/${p.slug}/builder`}
                      className="hover:text-[var(--accent)]"
                    >
                      {p.name}
                    </Link>
                  </td>
                  <td className="hidden px-4 py-3 text-[var(--muted-foreground)] md:table-cell">
                    {p.slug}
                  </td>
                  <td className="hidden px-4 py-3 text-[var(--muted-foreground)] lg:table-cell">
                    {formatDistanceToNow(new Date(p.updatedAt), { addSuffix: true })}
                  </td>
                  <td className="px-4 py-3">
                    {p.published ? (
                      <a
                        href={`/p/${p.published.subdomain}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-[var(--accent)] hover:underline"
                      >
                        Live <ExternalLink className="size-3" />
                      </a>
                    ) : (
                      <span className="text-xs text-[var(--muted-foreground)]">Draft</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="relative inline-block text-left">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="px-2"
                        aria-label="Actions"
                        onClick={() => setOpenMenu(openMenu === p.id ? null : p.id)}
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                      {openMenu === p.id ? (
                        <div
                          className={cn(
                            "absolute right-0 z-20 mt-1 w-44 rounded-xl border border-[var(--border)] bg-[var(--card)] p-1 shadow-lg",
                          )}
                        >
                          <Link
                            href={`/dashboard/projects/${p.slug}/builder`}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-[var(--muted)]"
                          >
                            <Pencil className="size-3.5" /> Edit
                          </Link>
                          <button
                            type="button"
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-red-500 hover:bg-[var(--muted)]"
                            onClick={() => onDelete(p.id)}
                          >
                            <Trash2 className="size-3.5" /> Delete
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-[var(--muted-foreground)]">
                    No projects match your search.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
