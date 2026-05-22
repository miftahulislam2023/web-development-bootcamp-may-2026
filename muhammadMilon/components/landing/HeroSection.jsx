"use client";

import { Button } from "@/components/ui/Button";

const statItems = [
  { value: "50+", label: "Ready-made templates" },
  { value: "10x", label: "Faster development" },
  { value: "100%", label: "No-code required" },
  { value: "Live", label: "Real-time preview" },
];

export function HeroSection({ session }) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16 text-center">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-20 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[100px]" />
        <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-violet-500/20 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[80px]" />
      </div>

      {/* Badge */}
      <div className="animate-fade-up relative mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-400">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-400" />
        </span>
        Professional Builder • Premium Templates
      </div>

      {/* Headline */}
      <h1
        className="animate-fade-up relative mx-auto max-w-4xl font-display text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl"
        style={{ animationDelay: "0.1s" }}
      >
        Build Stunning Websites{" "}
        <span className="relative">
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Without Code
          </span>
          <svg
            className="absolute -bottom-2 left-0 w-full"
            viewBox="0 0 300 12"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0 8 Q75 0 150 6 Q225 12 300 4"
              stroke="url(#underline-grad)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <defs>
              <linearGradient id="underline-grad" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="50%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#67e8f9" />
              </linearGradient>
            </defs>
          </svg>
        </span>
      </h1>

      {/* Subheadline */}
      <p
        className="animate-fade-up mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-[var(--muted-foreground)]"
        style={{ animationDelay: "0.2s" }}
      >
        Nexora Studio is a professional drag-and-drop website builder with high-quality components.
        Design, customize, and publish stunning websites — all in your browser, in minutes.
      </p>

      {/* CTAs */}
      <div
        className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-4"
        style={{ animationDelay: "0.3s" }}
      >
        <Button
          size="lg"
          href={session?.user ? "/dashboard" : "/register"}
          className="group relative overflow-hidden bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow"
        >
          <span className="relative">Start Building Free</span>
          <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Button>
        <Button size="lg" variant="outline" href="#how-it-works">
          Watch Demo
          <svg className="ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </Button>
      </div>

      {/* Trust note */}
      <p className="animate-fade-up mt-6 text-xs text-[var(--muted-foreground)]" style={{ animationDelay: "0.35s" }}>
        No credit card required • Free forever plan • Deploy in one click
      </p>

      {/* Stats */}
      <div
        className="animate-fade-up mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4"
        style={{ animationDelay: "0.4s" }}
      >
        {statItems.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-1">
            <span className="font-display text-3xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              {s.value}
            </span>
            <span className="text-xs text-[var(--muted-foreground)]">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Builder preview mockup */}
      <div
        className="animate-fade-up relative mx-auto mt-20 w-full max-w-5xl"
        style={{ animationDelay: "0.5s" }}
      >
        <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl shadow-black/20 overflow-hidden">
          {/* Window chrome */}
          <div className="flex items-center gap-1.5 border-b border-[var(--border)] bg-[var(--muted)]/50 px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <div className="mx-auto flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-1 text-xs text-[var(--muted-foreground)]">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
              nexorastudio.app/builder
            </div>
          </div>

          {/* Mockup content */}
          <div className="flex h-80 sm:h-96">
            {/* Sidebar */}
            <div className="hidden w-56 border-r border-[var(--border)] sm:block">
              <div className="border-b border-[var(--border)] px-3 py-2.5 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                Components
              </div>
              {["Hero Section", "Navbar", "Feature Grid", "Testimonials", "Pricing Table", "CTA Banner", "Footer"].map((c, i) => (
                <div
                  key={c}
                  className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-xs transition-colors ${i === 2 ? "bg-indigo-500/10 text-indigo-400" : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"}`}
                >
                  <div className={`h-4 w-4 rounded ${i === 2 ? "bg-indigo-500" : "bg-[var(--muted)]"}`} />
                  {c}
                </div>
              ))}
            </div>

            {/* Canvas */}
            <div className="flex-1 builder-canvas p-4">
              <div className="space-y-3">
                {/* Dragged component preview */}
                <div className="rounded-xl border-2 border-indigo-500/50 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 p-4">
                  <div className="mb-2 h-4 w-32 rounded-md bg-indigo-400/40" />
                  <div className="h-6 w-48 rounded-md bg-indigo-400/60" />
                  <div className="mt-2 h-3 w-64 rounded-md bg-[var(--muted)]" />
                  <div className="mt-3 flex gap-2">
                    <div className="h-8 w-24 rounded-lg bg-indigo-500/70" />
                    <div className="h-8 w-24 rounded-lg border border-[var(--border)] bg-transparent" />
                  </div>
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 opacity-60">
                  <div className="mb-2 flex gap-2">
                    {[1,2,3].map(i => <div key={i} className="h-16 flex-1 rounded-lg bg-[var(--muted)]" />)}
                  </div>
                </div>
                <div className="rounded-xl border border-dashed border-[var(--border)] p-3 text-center text-xs text-[var(--muted-foreground)]">
                  Drop a component here
                </div>
              </div>
            </div>

            {/* Properties panel */}
            <div className="hidden w-52 border-l border-[var(--border)] lg:block">
              <div className="border-b border-[var(--border)] px-3 py-2.5 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                Properties
              </div>
              <div className="space-y-3 p-3">
                {[
                  { label: "Background", value: "#6366f1" },
                  { label: "Text Color", value: "#ffffff" },
                  { label: "Padding", value: "48px" },
                  { label: "Border Radius", value: "16px" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="mb-1 text-[10px] text-[var(--muted-foreground)]">{label}</div>
                    <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-xs">
                      {label === "Background" && (
                        <div className="h-3 w-3 rounded-sm bg-indigo-500" />
                      )}
                      <span className="text-[var(--foreground)]">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating badges */}
        <div className="absolute -left-4 top-1/3 hidden -translate-y-1/2 animate-bounce sm:block">
          <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 shadow-xl text-xs font-medium">
            <span className="text-lg">✨</span> Live preview sync…
          </div>
        </div>
        <div className="absolute -right-4 bottom-12 hidden animate-bounce sm:block" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 shadow-xl text-xs font-medium">
            <span className="text-green-400">●</span> Published successfully!
          </div>
        </div>
      </div>
    </section>
  );
}
