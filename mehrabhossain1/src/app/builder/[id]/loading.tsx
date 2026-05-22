import { Loader2 } from "lucide-react";

/** Shown while the builder page loads the saved project from the database. */
export default function BuilderLoading() {
  return (
    <div className="flex h-[100dvh] flex-col items-center justify-center bg-surface">
      <Loader2 className="size-6 animate-spin text-primary" />
      <p className="mt-3 text-sm text-fg-muted">Loading builder…</p>
    </div>
  );
}
