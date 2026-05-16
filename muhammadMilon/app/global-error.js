"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[nexora] global error:", error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-950 px-6 py-16 text-neutral-100 antialiased">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
          <h1 className="text-2xl font-semibold">Application error</h1>
          <p className="text-sm text-neutral-400">
            A critical error occurred. Reload the page or try again in a moment.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-neutral-200"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
