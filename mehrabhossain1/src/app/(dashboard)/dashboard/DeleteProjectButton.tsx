"use client";

import { Trash2 } from "lucide-react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { deleteProject } from "@/features/projects/actions";
import { cn } from "@/lib/cn";

export function DeleteProjectButton({
  projectId,
  projectName,
  className,
}: {
  projectId: string;
  projectName: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <ConfirmDialog
        triggerLabel={`Delete ${projectName}`}
        triggerClassName="flex size-8 items-center justify-center rounded-md text-fg-subtle transition hover:bg-rose-50 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/40"
        triggerChildren={<Trash2 className="size-4" />}
        title="Delete project?"
        description={`This permanently deletes “${projectName}”. This cannot be undone.`}
        confirmLabel="Delete"
        action={deleteProject.bind(null, projectId)}
      />
    </div>
  );
}
