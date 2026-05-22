import { Compass } from "lucide-react";
import Link from "next/link";

import { BrandMark } from "@/components/BrandMark";
import { buttonClass } from "@/components/ui/Button";

/** Branded 404 — covers the `notFound()` calls in the builder and preview. */
export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-5 bg-surface px-4 py-20 text-center">
      <Link href="/">
        <BrandMark />
      </Link>
      <span className="flex size-16 items-center justify-center rounded-2xl bg-accent-soft text-primary">
        <Compass className="size-8" />
      </span>
      <div>
        <p className="text-sm font-semibold text-primary">404</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-fg">
          Page not found
        </h1>
        <p className="mt-2 max-w-sm text-sm text-fg-muted">
          The page you’re looking for doesn’t exist or may have been removed.
        </p>
      </div>
      <Link href="/dashboard" className={buttonClass("gradient", "md")}>
        Back to dashboard
      </Link>
    </main>
  );
}
