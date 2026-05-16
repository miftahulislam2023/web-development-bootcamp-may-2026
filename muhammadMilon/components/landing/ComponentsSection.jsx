"use client";

import { useState } from "react";

const categories = ["All", "Navigation", "Hero", "Content", "Commerce", "Media", "Forms"];

const components = [
  { name: "Navbar", category: "Navigation", color: "from-indigo-500/20 to-indigo-600/5", tag: "Popular",
    preview: (
      <div className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-indigo-500" />
          <div className="h-2 w-14 rounded bg-[var(--muted)]" />
        </div>
        <div className="hidden gap-2 sm:flex">
          {[1,2,3].map(i => <div key={i} className="h-2 w-8 rounded bg-[var(--muted)]" />)}
        </div>
        <div className="h-5 w-16 rounded-full bg-indigo-500/30" />
      </div>
    )
  },
  { name: "Hero Section", category: "Hero", color: "from-violet-500/20 to-violet-600/5", tag: "Popular",
    preview: (
      <div className="rounded-lg border border-[var(--border)] bg-gradient-to-br from-indigo-500/10 to-violet-500/10 p-3 text-center">
        <div className="mx-auto mb-1.5 h-2 w-20 rounded bg-indigo-400/50" />
        <div className="mx-auto mb-1 h-4 w-32 rounded bg-[var(--foreground)]/20" />
        <div className="mx-auto mb-2 h-2 w-28 rounded bg-[var(--muted)]" />
        <div className="flex justify-center gap-1.5">
          <div className="h-6 w-16 rounded-full bg-indigo-500" />
          <div className="h-6 w-16 rounded-full border border-[var(--border)]" />
        </div>
      </div>
    )
  },
  { name: "Feature Grid", category: "Content", color: "from-cyan-500/20 to-cyan-600/5", tag: "New",
    preview: (
      <div className="grid grid-cols-3 gap-1.5">
        {[1,2,3].map(i => (
          <div key={i} className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-2">
            <div className="mb-1 h-5 w-5 rounded bg-cyan-500/40" />
            <div className="h-2 w-full rounded bg-[var(--muted)]" />
            <div className="mt-1 h-1.5 w-3/4 rounded bg-[var(--muted)]" />
          </div>
        ))}
      </div>
    )
  },
  { name: "Pricing Table", category: "Commerce", color: "from-emerald-500/20 to-emerald-600/5", tag: "Popular",
    preview: (
      <div className="flex gap-1.5">
        {["Free", "Pro", "Team"].map((plan, i) => (
          <div key={plan} className={`flex-1 rounded-lg border p-2 text-center ${i === 1 ? "border-emerald-500 bg-emerald-500/10" : "border-[var(--border)] bg-[var(--card)]"}`}>
            <div className="mb-1 text-[10px] font-medium">{plan}</div>
            <div className={`mb-1 text-xs font-bold ${i === 1 ? "text-emerald-400" : ""}`}>{["$0", "$19", "$49"][i]}</div>
            <div className="h-4 w-full rounded-full bg-[var(--muted)]" />
          </div>
        ))}
      </div>
    )
  },
  { name: "Testimonials", category: "Content", color: "from-pink-500/20 to-pink-600/5", tag: "",
    preview: (
      <div className="space-y-1.5">
        {[1,2].map(i => (
          <div key={i} className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-2">
            <div className="mb-1 flex gap-0.5">
              {[1,2,3,4,5].map(s => <div key={s} className="h-2 w-2 rounded-sm bg-yellow-400" />)}
            </div>
            <div className="h-1.5 w-full rounded bg-[var(--muted)]" />
            <div className="mt-1 h-1.5 w-2/3 rounded bg-[var(--muted)]" />
          </div>
        ))}
      </div>
    )
  },
  { name: "Gallery", category: "Media", color: "from-orange-500/20 to-orange-600/5", tag: "",
    preview: (
      <div className="grid grid-cols-3 gap-1">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`rounded bg-gradient-to-br ${["from-indigo-500/30 to-indigo-600/10","from-violet-500/30 to-violet-600/10","from-cyan-500/30 to-cyan-600/10","from-emerald-500/30 to-emerald-600/10","from-pink-500/30 to-pink-600/10","from-orange-500/30 to-orange-600/10"][i]} ${i === 0 ? "col-span-2 row-span-2 h-14" : "h-6"}`} />
        ))}
      </div>
    )
  },
  { name: "Contact Form", category: "Forms", color: "from-rose-500/20 to-rose-600/5", tag: "New",
    preview: (
      <div className="space-y-1.5">
        {["Name", "Email"].map(f => (
          <div key={f} className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1.5">
            <div className="text-[9px] text-[var(--muted-foreground)]">{f}</div>
            <div className="h-1.5 w-24 rounded bg-[var(--muted)]" />
          </div>
        ))}
        <div className="h-7 w-full rounded-lg bg-indigo-500" />
      </div>
    )
  },
  { name: "Footer", category: "Navigation", color: "from-slate-500/20 to-slate-600/5", tag: "",
    preview: (
      <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/50 p-3">
        <div className="mb-2 grid grid-cols-3 gap-2">
          {[1,2,3].map(i => (
            <div key={i} className="space-y-1">
              <div className="h-2 w-12 rounded bg-[var(--foreground)]/20" />
              {[1,2,3].map(j => <div key={j} className="h-1.5 w-8 rounded bg-[var(--muted)]" />)}
            </div>
          ))}
        </div>
        <div className="mt-2 border-t border-[var(--border)] pt-2">
          <div className="h-1.5 w-32 rounded bg-[var(--muted)]" />
        </div>
      </div>
    )
  },
  { name: "CTA Banner", category: "Hero", color: "from-amber-500/20 to-amber-600/5", tag: "Popular",
    preview: (
      <div className="rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 p-3 text-center">
        <div className="mx-auto mb-1 h-2 w-24 rounded bg-white/30" />
        <div className="mx-auto mb-2 h-1.5 w-32 rounded bg-white/20" />
        <div className="mx-auto h-5 w-20 rounded-full bg-white" />
      </div>
    )
  },
];

export function ComponentsSection() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? components : components.filter(c => c.category === active);

  return (
    <section id="components" className="relative px-6 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">Component Library</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            30+ ready-to-use{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              building blocks
            </span>
          </h2>
          <p className="mt-4 text-lg text-[var(--muted-foreground)]">
            A comprehensive library of beautifully designed, fully responsive components.
            Drag onto your canvas and customize in seconds.
          </p>
        </div>

        {/* Category filters */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                active === cat
                  ? "bg-[var(--accent)] text-white shadow-lg shadow-indigo-500/20"
                  : "border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:border-indigo-500/30 hover:text-[var(--foreground)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Component grid */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((comp) => (
            <div
              key={comp.name}
              className={`group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br ${comp.color} bg-[var(--card)] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10`}
            >
              {comp.tag && (
                <span className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  comp.tag === "New" ? "bg-emerald-500/20 text-emerald-400" : "bg-indigo-500/20 text-indigo-400"
                }`}>
                  {comp.tag}
                </span>
              )}
              <div className="mb-4">{comp.preview}</div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{comp.name}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{comp.category}</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background)] opacity-0 transition-all duration-200 group-hover:opacity-100">
                  <svg className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[var(--muted-foreground)]">
            + many more components added every week
          </p>
        </div>
      </div>
    </section>
  );
}
