import { ArrowRight, Code2, Eye, MousePointerClick } from "lucide-react";
import Link from "next/link";

import { BrandMark } from "@/components/BrandMark";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { auth } from "@/lib/auth";

const FEATURES = [
  {
    icon: MousePointerClick,
    title: "Drag & drop",
    body: "Drop text, images, buttons, and containers onto the canvas and reorder them freely — no code.",
  },
  {
    icon: Eye,
    title: "Live preview",
    body: "Open a clean, shareable preview of any page at its own URL — just the result, no editor chrome.",
  },
  {
    icon: Code2,
    title: "HTML export",
    body: "Download any page as a standalone HTML file with inline styles that opens in any browser.",
  },
];

/** Abstract CSS mockup of the builder — the hero's product visual. */
function BuilderMockup() {
  return (
    <Card aria-hidden className="overflow-hidden shadow-pop">
      {/* Window bar */}
      <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-3">
        <span className="size-3 rounded-full bg-rose-400" />
        <span className="size-3 rounded-full bg-amber-400" />
        <span className="size-3 rounded-full bg-emerald-400" />
        <span className="ml-3 h-5 w-full max-w-xs rounded-md border border-border bg-white" />
      </div>
      {/* 3-pane editor */}
      <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-[110px_1fr_130px]">
        {/* Palette */}
        <div className="hidden flex-col gap-2 bg-white p-3 sm:flex">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-8 rounded-md border border-border bg-surface"
            />
          ))}
        </div>
        {/* Canvas */}
        <div className="flex flex-col gap-3 bg-surface p-5">
          <div className="h-6 w-2/3 rounded-md border border-border bg-white" />
          <div className="h-24 rounded-md bg-gradient-brand opacity-90" />
          <div className="h-3.5 w-full rounded border border-border bg-white" />
          <div className="h-3.5 w-5/6 rounded border border-border bg-white" />
          <div className="h-9 w-32 rounded-md bg-primary" />
        </div>
        {/* Properties */}
        <div className="hidden flex-col gap-2 bg-white p-3 sm:flex">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-6 rounded border border-border bg-surface"
            />
          ))}
        </div>
      </div>
    </Card>
  );
}

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-1 flex-col bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-border bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3.5">
          <BrandMark />
          <nav className="flex items-center gap-2">
            {session ? (
              <Link
                href="/dashboard"
                className={buttonClass("gradient", "sm")}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className={buttonClass("ghost", "sm")}>
                  Log in
                </Link>
                <Link
                  href="/register"
                  className={buttonClass("gradient", "sm")}
                >
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-80 max-w-3xl rounded-full bg-primary/20 blur-3xl"
          />
          <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-6 pt-20 pb-16 text-center sm:pt-28">
            <Badge variant="accent">Drag-and-drop website builder</Badge>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-fg sm:text-5xl lg:text-6xl">
              Build web pages{" "}
              <span className="text-gradient-brand">without writing code</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
              Drag blocks onto a canvas, fine-tune their properties, and publish
              a live preview or export standalone HTML — all in your browser.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className={buttonClass("gradient", "lg")}
              >
                Get started — it&apos;s free
                <ArrowRight className="size-4" />
              </Link>
              <Link href="/login" className={buttonClass("secondary", "lg")}>
                Log in
              </Link>
            </div>
            <div className="mt-16 w-full max-w-5xl">
              <BuilderMockup />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border bg-surface">
          <div className="mx-auto w-full max-w-6xl px-6 py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-fg">
                Everything you need to ship a page
              </h2>
              <p className="mt-3 text-fg-muted">
                From the first block to a live URL — no setup, no code.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {FEATURES.map((feature) => (
                <Card key={feature.title} className="p-6">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-primary">
                    <feature.icon className="size-6" />
                  </span>
                  <h3 className="mt-4 font-semibold tracking-tight text-fg">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                    {feature.body}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA band */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-brand px-8 py-14 text-center shadow-glow">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Ready to build your page?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-emerald-50">
              Create a free account and drag your first block in seconds.
            </p>
            <Link
              href="/register"
              className={buttonClass("secondary", "lg", "mt-7")}
            >
              Get started — it&apos;s free
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 sm:flex-row">
          <BrandMark />
          <p className="text-sm text-fg-subtle">
            Built with Next.js, Prisma & dnd-kit.
          </p>
        </div>
      </footer>
    </div>
  );
}
