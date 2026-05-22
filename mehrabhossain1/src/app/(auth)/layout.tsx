import { Check } from "lucide-react";
import Link from "next/link";

import { BrandMark } from "@/components/BrandMark";

const POINTS = [
  "Drag-and-drop canvas",
  "Live, shareable preview",
  "One-click HTML export",
];

/** Split shell for the auth pages — branded gradient panel + form area. */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1">
      {/* Brand panel — desktop only */}
      <aside className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-gradient-brand p-10 text-white lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-white/10 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-16 size-72 rounded-full bg-white/10 blur-2xl"
        />

        <Link href="/" className="relative w-fit">
          <BrandMark tone="inverse" />
        </Link>

        <div className="relative">
          <h2 className="max-w-sm text-3xl font-bold leading-tight tracking-tight">
            Build web pages without writing code.
          </h2>
          <ul className="mt-6 flex flex-col gap-3">
            {POINTS.map((point) => (
              <li
                key={point}
                className="flex items-center gap-2.5 text-emerald-50"
              >
                <span className="flex size-5 items-center justify-center rounded-full bg-white/20">
                  <Check className="size-3.5" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-emerald-50">
          Built with Next.js, Prisma & dnd-kit.
        </p>
      </aside>

      {/* Form area */}
      <main className="flex flex-1 flex-col items-center justify-center bg-surface px-4 py-12">
        <div className="flex w-full max-w-sm flex-col items-center gap-8">
          <Link href="/" className="lg:hidden">
            <BrandMark />
          </Link>
          {children}
        </div>
      </main>
    </div>
  );
}
