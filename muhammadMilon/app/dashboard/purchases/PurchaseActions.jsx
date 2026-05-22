"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createProjectFromTemplate } from "@/actions/projects";
import { toast } from "sonner";

export function PurchaseActions({ templateId }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleUseTemplate = async () => {
    setIsPending(true);
    toast.loading("Creating your project from template...", { id: "create-purchased" });

    try {
      const res = await createProjectFromTemplate(templateId);
      if (res.ok) {
        toast.success("Project created! Taking you to the builder...", { id: "create-purchased" });
        router.push(`/dashboard/projects/${res.project.slug}/builder`);
      } else {
        toast.error(res.error || "Failed to create project", { id: "create-purchased" });
      }
    } catch (e) {
      toast.error("An unexpected error occurred", { id: "create-purchased" });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex gap-3">
      <Button 
        className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold h-11 rounded-xl shadow-lg shadow-indigo-500/20"
        onClick={handleUseTemplate}
        disabled={isPending}
      >
        {isPending ? "Setting up..." : "Use Template"}
      </Button>
      <Button 
        variant="outline"
        className="h-11 w-11 p-0 rounded-xl flex items-center justify-center border-[var(--border)] hover:bg-[var(--muted)]"
        href="/templates"
      >
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </Button>
    </div>
  );
}
