const techStack = [
  {
    category: "Frontend",
    color: "from-blue-500/10 to-blue-600/5",
    accent: "text-blue-400",
    border: "border-blue-500/20",
    items: [
      { name: "Next.js 15", role: "Full-stack framework", icon: "▲", desc: "App Router, Server Components, API Routes" },
      { name: "React 19", role: "UI Library", icon: "⚛", desc: "Component-based UI rendering" },
      { name: "Tailwind CSS", role: "Styling", icon: "🎨", desc: "Utility-first CSS framework" },
      { name: "DnD Kit", role: "Drag & Drop", icon: "🧲", desc: "Accessible drag-and-drop toolkit" },
    ],
  },
  {
    category: "Backend & Data",
    color: "from-emerald-500/10 to-emerald-600/5",
    accent: "text-emerald-400",
    border: "border-emerald-500/20",
    items: [
      { name: "PostgreSQL", role: "Database", icon: "🐘", desc: "Reliable relational database" },
      { name: "Prisma ORM", role: "ORM Layer", icon: "🔷", desc: "Type-safe database queries" },
      { name: "NextAuth.js", role: "Authentication", icon: "🔐", desc: "OAuth + JWT session management" },
      { name: "Redux Toolkit", role: "State Management", icon: "🗃️", desc: "Predictable global state" },
    ],
  },
  {
    category: "AI & Infrastructure",
    color: "from-violet-500/10 to-violet-600/5",
    accent: "text-violet-400",
    border: "border-violet-500/20",
    items: [
      { name: "Gemini API", role: "AI Engine", icon: "✨", desc: "Layout generation & content AI" },
      { name: "Cloudinary", role: "Media Storage", icon: "☁️", desc: "Image & asset management" },
      { name: "Vercel", role: "Deployment", icon: "🚀", desc: "Edge-first deployment platform" },
      { name: "JWT", role: "Authorization", icon: "🛡️", desc: "Secure token-based auth" },
    ],
  },
];

export function TechStackSection() {
  return (
    <section id="tech-stack" className="relative overflow-hidden px-6 py-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
        <div className="absolute inset-0 bg-[var(--muted)]/20" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">Technology Stack</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Built on{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              modern technology
            </span>
          </h2>
          <p className="mt-4 text-lg text-[var(--muted-foreground)]">
            Every technology choice is intentional — optimized for performance, developer experience, and scalability.
          </p>
        </div>

        {/* Tech categories */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {techStack.map((group) => (
            <div
              key={group.category}
              className={`overflow-hidden rounded-2xl border bg-gradient-to-br ${group.color} ${group.border} backdrop-blur-sm`}
            >
              <div className={`border-b ${group.border} px-6 py-4`}>
                <h3 className={`font-display text-lg font-bold ${group.accent}`}>{group.category}</h3>
              </div>
              <div className="divide-y divide-[var(--border)]/50">
                {group.items.map((tech) => (
                  <div
                    key={tech.name}
                    className="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-[var(--muted)]/30"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] text-lg shadow-sm">
                      {tech.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold">{tech.name}</p>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${group.accent} bg-[var(--card)]`}>
                          {tech.role}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{tech.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Architecture diagram simplified */}
        <div className="mt-16 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8">
          <h3 className="mb-8 text-center font-display text-xl font-bold">System Architecture</h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { label: "Browser Client", color: "bg-blue-500/10 border-blue-500/30 text-blue-400" },
              { label: "→", color: "text-[var(--muted-foreground)]" },
              { label: "Next.js App Router", color: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400" },
              { label: "→", color: "text-[var(--muted-foreground)]" },
              { label: "Server Actions / API", color: "bg-violet-500/10 border-violet-500/30 text-violet-400" },
              { label: "→", color: "text-[var(--muted-foreground)]" },
              { label: "Prisma ORM", color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" },
              { label: "→", color: "text-[var(--muted-foreground)]" },
              { label: "PostgreSQL", color: "bg-teal-500/10 border-teal-500/30 text-teal-400" },
            ].map((item, i) =>
              item.label === "→" ? (
                <span key={i} className={`font-bold ${item.color}`}>→</span>
              ) : (
                <span
                  key={i}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium ${item.color}`}
                >
                  {item.label}
                </span>
              )
            )}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {[
              { label: "Gemini API", color: "bg-purple-500/10 border-purple-500/30 text-purple-400" },
              { label: "+", color: "text-[var(--muted-foreground)]" },
              { label: "NextAuth.js", color: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" },
              { label: "+", color: "text-[var(--muted-foreground)]" },
              { label: "Cloudinary CDN", color: "bg-orange-500/10 border-orange-500/30 text-orange-400" },
              { label: "+", color: "text-[var(--muted-foreground)]" },
              { label: "Vercel Edge", color: "bg-gray-500/10 border-gray-500/30 text-gray-400" },
            ].map((item, i) =>
              item.label === "+" ? (
                <span key={i} className={`font-bold ${item.color}`}>+</span>
              ) : (
                <span
                  key={i}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium ${item.color}`}
                >
                  {item.label}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
