import { Clock, LayoutTemplate, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { inputClass } from "@/components/ui/Field";
import { createProject } from "@/features/projects/actions";
import { listProjects } from "@/features/projects/queries";

import { DeleteProjectButton } from "./DeleteProjectButton";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const projects = await listProjects();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-fg">
            Your projects
          </h1>
          <p className="mt-1 text-sm text-fg-muted">
            Create a site and start building.
          </p>
        </div>

        <form action={createProject} className="flex items-center gap-2">
          <div className="w-44 sm:w-56">
            <input
              type="text"
              name="name"
              aria-label="Project name"
              placeholder="Project name"
              className={inputClass}
            />
          </div>
          <Button type="submit" leftIcon={<Plus className="size-4" />}>
            New project
          </Button>
        </form>
      </div>

      {projects.length === 0 ? (
        <Card className="mt-10 flex flex-col items-center px-6 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-accent-soft text-primary">
            <LayoutTemplate className="size-7" />
          </span>
          <h2 className="mt-4 text-lg font-semibold text-fg">
            No projects yet
          </h2>
          <p className="mt-1 max-w-sm text-sm text-fg-muted">
            Create your first project and start dragging blocks onto the
            canvas.
          </p>
          <form action={createProject} className="mt-6">
            <Button
              type="submit"
              variant="gradient"
              leftIcon={<Plus className="size-4" />}
            >
              Create your first project
            </Button>
          </form>
        </Card>
      ) : (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.id}>
              <Card
                interactive
                className="relative flex h-full flex-col overflow-hidden"
              >
                <div className="relative h-24 bg-gradient-brand">
                  <LayoutTemplate
                    aria-hidden
                    className="absolute -bottom-3 right-3 size-20 text-white/15"
                  />
                </div>
                <div className="flex items-start justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-fg">
                      {project.name}
                    </h3>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-fg-subtle">
                      <Clock className="size-3" />
                      Updated {project.updatedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <DeleteProjectButton
                    projectId={project.id}
                    projectName={project.name}
                    className="z-10"
                  />
                </div>
                <Link
                  href={`/builder/${project.id}`}
                  aria-label={`Open ${project.name}`}
                  className="absolute inset-0 rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
