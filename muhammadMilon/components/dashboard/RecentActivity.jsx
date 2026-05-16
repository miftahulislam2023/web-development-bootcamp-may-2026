import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

const LABELS = {
  save_revision: "Saved a version",
  restore_revision: "Restored a version",
  duplicate_template: "Duplicated a template",
  import_template: "Imported a template",
  publish: "Published a site",
  unpublish: "Unpublished a site",
};

export function RecentActivity({ items }) {
  if (!items?.length) {
    return (
      <p className="text-sm text-[var(--muted-foreground)]">No recent activity yet. Create or edit a project to see updates here.</p>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-start justify-between gap-3 rounded-xl border border-[var(--border)] px-4 py-3"
        >
          <div>
            <p className="text-sm font-medium">{LABELS[item.action] || item.action}</p>
            {item.detail ? (
              <p className="text-xs text-[var(--muted-foreground)]">{item.detail}</p>
            ) : null}
            {item.project ? (
              <Link
                href={`/dashboard/projects/${item.project.slug}/builder`}
                className="text-xs text-violet-500 hover:underline"
              >
                {item.project.name}
              </Link>
            ) : null}
          </div>
          <time className="shrink-0 text-[10px] text-[var(--muted-foreground)]">
            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
          </time>
        </li>
      ))}
    </ul>
  );
}
