"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProject } from "@/actions/projects";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export function CreateProjectDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createProject({ name, description: description || undefined });
      if (!res.ok) {
        toast.error(res.error || "Could not create project");
        return;
      }
      toast.success("Project created");
      setOpen(false);
      setName("");
      setDescription("");
      router.push(`/dashboard/projects/${res.project.slug}/builder`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        New project
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl">
            <h3 className="font-display text-lg font-semibold">New project</h3>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              You can rename and publish anytime.
            </p>
            <form className="mt-4 space-y-3" onSubmit={submit}>
              <div className="space-y-1.5">
                <Label htmlFor="pname">Name</Label>
                <Input
                  id="pname"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="My landing page"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pdesc">Description (optional)</Label>
                <textarea
                  id="pdesc"
                  className="min-h-[80px] w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating…" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
