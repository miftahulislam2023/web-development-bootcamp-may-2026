const templates = [
  {
    name: "SaaS Pro",
    category: "SaaS",
    gradient: "from-indigo-600 to-violet-700",
    desc: "Modern SaaS landing with hero, pricing, testimonials",
    badge: "Popular",
    badgeColor: "bg-indigo-500",
  },
  {
    name: "Agency Bold",
    category: "Agency",
    gradient: "from-slate-700 to-slate-900",
    desc: "Creative agency with portfolio and team sections",
    badge: "New",
    badgeColor: "bg-emerald-500",
  },
  {
    name: "Portfolio Clean",
    category: "Portfolio",
    gradient: "from-rose-500 to-pink-700",
    desc: "Minimalist personal portfolio for designers",
    badge: "",
    badgeColor: "",
  },
  {
    name: "E-Commerce Store",
    category: "Commerce",
    gradient: "from-amber-500 to-orange-600",
    desc: "Product showcase with cart and checkout flow",
    badge: "Popular",
    badgeColor: "bg-amber-500",
  },
  {
    name: "Startup Launch",
    category: "Startup",
    gradient: "from-cyan-500 to-blue-600",
    desc: "Waitlist and coming soon page with viral loop",
    badge: "New",
    badgeColor: "bg-cyan-500",
  },
  {
    name: "Blog & Magazine",
    category: "Blog",
    gradient: "from-emerald-500 to-teal-600",
    desc: "Content-focused with categories and featured posts",
    badge: "",
    badgeColor: "",
  },
];

export function TemplatesSection() {
  return (
    <section id="templates" className="relative overflow-hidden px-6 py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">Templates</p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Start from a{" "}
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                stunning template
              </span>
            </h2>
            <p className="mt-4 text-lg text-[var(--muted-foreground)]">
              Professionally designed templates for every use case. Customize any template with your brand in minutes.
            </p>
          </div>
          <a
            href="/templates"
            className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium transition-all hover:border-indigo-500/30 hover:bg-indigo-500/5"
          >
            View all templates
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>

        {/* Template grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <div
              key={template.name}
              className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/10"
            >
              {/* Preview area */}
              <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${template.gradient}`}>
                {/* Simulated website mockup */}
                <div className="absolute inset-3 rounded-lg border border-white/10 bg-white/5 p-3">
                  {/* Mock nav */}
                  <div className="mb-2 flex items-center justify-between">
                    <div className="h-2 w-12 rounded-full bg-white/40" />
                    <div className="flex gap-1.5">
                      {[1,2,3].map(i => <div key={i} className="h-1.5 w-8 rounded-full bg-white/20" />)}
                    </div>
                  </div>
                  {/* Mock hero */}
                  <div className="mb-3 text-center">
                    <div className="mx-auto mb-1 h-3 w-24 rounded-full bg-white/60" />
                    <div className="mx-auto mb-1 h-2 w-32 rounded-full bg-white/30" />
                    <div className="mx-auto h-1.5 w-20 rounded-full bg-white/20" />
                  </div>
                  {/* Mock features */}
                  <div className="grid grid-cols-3 gap-1">
                    {[1,2,3].map(i => (
                      <div key={i} className="rounded bg-white/10 p-1.5">
                        <div className="mb-1 h-2 w-2 rounded-sm bg-white/40" />
                        <div className="h-1.5 w-full rounded bg-white/20" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Badge */}
                {template.badge && (
                  <span className={`absolute left-3 top-3 rounded-full ${template.badgeColor} px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider`}>
                    {template.badge}
                  </span>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <a
                    href="/register"
                    className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-gray-900 shadow-lg transition-transform hover:scale-105"
                  >
                    Use this template →
                  </a>
                </div>
              </div>

              {/* Info */}
              <div className="flex items-center justify-between p-5">
                <div>
                  <p className="font-display font-semibold">{template.name}</p>
                  <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{template.desc}</p>
                </div>
                <span className="rounded-full border border-[var(--border)] bg-[var(--muted)] px-2.5 py-1 text-xs font-medium text-[var(--muted-foreground)]">
                  {template.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
