"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({ error, reset }) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[nexora] route error:", error);
    }
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <h1 className="font-display text-2xl font-semibold text-[var(--foreground)]">Something went wrong</h1>
      <p className="max-w-md text-sm text-[var(--muted-foreground)]">
        This page hit an unexpected error. You can try again or return to the dashboard.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button type="button" onClick={() => reset()}>
          Try again
        </Button>
        <Button type="button" variant="outline" href="/dashboard">
          Dashboard
        </Button>
      </div>
    </div>
  );
}
