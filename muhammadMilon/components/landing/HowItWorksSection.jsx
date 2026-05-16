const steps = [
  {
    number: "01",
    label: "Choose a Template",
    description: "Pick from 50+ professionally designed templates for any industry — SaaS, portfolio, agency, e-commerce, and more.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    color: "from-indigo-500 to-indigo-600",
    highlights: ["50+ templates", "Any industry", "Fully customizable"],
  },
  {
    number: "02",
    label: "Customize Layouts",
    description: "Tailor your website to your brand's unique identity. Adjust every detail with our intuitive properties panel and high-quality component library.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
    color: "from-violet-500 to-violet-600",
    highlights: ["Pixel-perfect", "Intuitive tools", "Brand styling"],
  },
  {
    number: "03",
    label: "Customize & Preview",
    description: "Drag components, adjust styles, and preview in real time across desktop, tablet, and mobile — all without touching code.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
      </svg>
    ),
    color: "from-cyan-500 to-cyan-600",
    highlights: ["Real-time preview", "All device sizes", "Live editing"],
  },
  {
    number: "04",
    label: "Publish Instantly",
    description: "One click to go live. Connect your custom domain, get a free SSL certificate, and your website is live for the world to see.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253M3 12c0 .778.099 1.533.284 2.253m0 0A11.953 11.953 0 0012 16.5c2.998 0 5.74 1.1 7.843 2.918" />
      </svg>
    ),
    color: "from-emerald-500 to-emerald-600",
    highlights: ["Custom domain", "Free SSL", "Instant publish"],
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative px-6 py-24 overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-violet-500/5 blur-[80px]" />
        <div className="absolute right-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-indigo-500/5 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">How It Works</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            From idea to live website{" "}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              in 4 steps
            </span>
          </h2>
          <p className="mt-4 text-lg text-[var(--muted-foreground)]">
            No complex setup. No learning curve. Just build, design, and ship.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-20">
          {/* Connector line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-[var(--border)] via-indigo-500/30 to-[var(--border)] lg:block" />

          <div className="space-y-16">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative flex flex-col items-center gap-8 lg:flex-row ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
              >
                {/* Content */}
                <div className="flex-1 text-center lg:text-left">
                  <div className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${step.color} px-3 py-1 text-xs font-bold text-white`}>
                    Step {step.number}
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-bold sm:text-3xl">{step.label}</h3>
                  <p className="mt-3 max-w-md text-[var(--muted-foreground)]">
                    {step.description}
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start">
                    {step.highlights.map((h) => (
                      <span
                        key={h}
                        className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-medium"
                      >
                        <svg className="h-3 w-3 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Center icon (desktop) */}
                <div className="relative z-10 hidden h-20 w-20 flex-shrink-0 lg:flex">
                  <div className={`flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br ${step.color} text-white shadow-lg`}>
                    {step.icon}
                  </div>
                </div>

                {/* Card (right or left) */}
                <div className="flex-1">
                  <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl">
                    <div className={`h-1 w-full bg-gradient-to-r ${step.color}`} />
                    <div className="p-6">
                      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${step.color} text-white lg:hidden`}>
                        {step.icon}
                      </div>
                      {/* Mockup for each step */}
                      {index === 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {["SaaS", "Agency", "Portfolio", "E-Commerce", "Blog", "Landing"].map((t, i) => (
                            <div
                              key={t}
                              className={`rounded-lg border p-3 text-center text-xs ${i === 1 ? "border-indigo-500 bg-indigo-500/10 text-indigo-400" : "border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)]"}`}
                            >
                              <div className="mb-1.5 h-8 rounded bg-[var(--background)]/50" />
                              {t}
                            </div>
                          ))}
                        </div>
                      )}
                      {index === 1 && (
                        <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
                          <div className="mb-2 flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                            <span className="text-violet-400">✦</span> Layout Customization
                          </div>
                          <div className="mb-3 rounded-lg bg-violet-500/10 p-3 text-xs text-violet-300">
                            &ldquo;Adjust hero background to violet gradient and increase padding for mobile&rdquo;
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <div className="flex h-6 w-6 animate-spin items-center justify-center rounded-full border-2 border-violet-500 border-t-transparent" />
                            <span className="text-[var(--muted-foreground)]">Applying changes...</span>
                          </div>
                        </div>
                      )}
                      {index === 2 && (
                        <div className="flex gap-2">
                          {["💻", "📱", "📟"].map((device, i) => (
                            <div
                              key={i}
                              className={`flex-1 rounded-lg border text-center text-2xl py-4 ${i === 0 ? "border-cyan-500 bg-cyan-500/10" : "border-[var(--border)] bg-[var(--muted)]"}`}
                            >
                              {device}
                              <div className="mt-1 text-[10px] text-[var(--muted-foreground)]">
                                {["Desktop", "Mobile", "Tablet"][i]}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {index === 3 && (
                        <div className="text-center">
                          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                            <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <p className="text-sm font-semibold text-emerald-400">Live at yoursite.nexora.app</p>
                          <p className="mt-1 text-xs text-[var(--muted-foreground)]">Free SSL • Custom Domain • CDN Enabled</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
