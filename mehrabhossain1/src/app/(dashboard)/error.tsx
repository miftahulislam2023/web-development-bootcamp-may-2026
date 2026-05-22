"use client";

import { RotateCw, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/Button";

/** Error boundary for everything under the (dashboard) route group. */
export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-5 px-6 py-20 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-rose-50 text-danger">
        <TriangleAlert className="size-8" />
      </span>
      <div>
        <h1 className="text-xl font-bold tracking-tight text-fg">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-fg-muted">
          We couldn’t load this page. Please try again.
        </p>
      </div>
      <Button onClick={reset} leftIcon={<RotateCw className="size-4" />}>
        Try again
      </Button>
    </div>
  );
}
