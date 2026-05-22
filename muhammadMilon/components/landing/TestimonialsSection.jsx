const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Founder, LaunchPad Co.",
    avatar: "SM",
    avatarColor: "from-indigo-500 to-violet-500",
    rating: 5,
    text: "Nexora Studio completely changed how we build marketing pages. What used to take our dev team 2 weeks now takes me an afternoon. The pre-built component library is genuinely a game-changer.",
    highlight: "2 weeks → 1 afternoon",
  },
  {
    name: "James Okonkwo",
    role: "Lead Designer, Pixel Agency",
    avatar: "JO",
    avatarColor: "from-cyan-500 to-blue-500",
    rating: 5,
    text: "I was skeptical about no-code tools, but Nexora is different. The output is clean, the components are actually beautiful, and the customization options are incredibly flexible.",
    highlight: "Output is actually beautiful",
  },
  {
    name: "Priya Sharma",
    role: "Growth Manager, TechFlow",
    avatar: "PS",
    avatarColor: "from-pink-500 to-rose-500",
    rating: 5,
    text: "We shipped 12 landing page variants in a single sprint for A/B testing. The responsive editing and instant publish made the whole process incredibly smooth.",
    highlight: "12 pages in one sprint",
  },
  {
    name: "Lucas Fernandez",
    role: "Freelance Web Developer",
    avatar: "LF",
    avatarColor: "from-emerald-500 to-teal-500",
    rating: 5,
    text: "My clients love the results and they can make small edits themselves without breaking anything. Nexora has become my go-to for every client project.",
    highlight: "Clients love it",
  },
  {
    name: "Emma Zhang",
    role: "Product Manager, Velocity",
    avatar: "EZ",
    avatarColor: "from-amber-500 to-orange-500",
    rating: 5,
    text: "The template library alone is worth it. I pick a professional starting point and customize it instantly. Our conversion rates have improved 34% since switching.",
    highlight: "+34% conversion rate",
  },
  {
    name: "Alex Thompson",
    role: "CEO, Startup Forge",
    avatar: "AT",
    avatarColor: "from-violet-500 to-purple-500",
    rating: 5,
    text: "As a non-technical founder, Nexora Studio gave me the power to build and iterate on our website without waiting on developers. It's been a game-changer for our speed.",
    highlight: "No devs needed",
  },
];

function StarRating({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative overflow-hidden px-6 py-24">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-pink-500/5 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">Testimonials</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Loved by builders{" "}
            <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
              worldwide
            </span>
          </h2>
          <p className="mt-4 text-lg text-[var(--muted-foreground)]">
            Join thousands of designers, developers, and entrepreneurs who ship faster with Nexora Studio.
          </p>
        </div>

        {/* Rating summary */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="text-center">
            <p className="font-display text-5xl font-bold">4.9</p>
            <StarRating />
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">Average rating</p>
          </div>
          <div className="hidden h-12 w-px bg-[var(--border)] sm:block" />
          <div className="text-center">
            <p className="font-display text-5xl font-bold">12k+</p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">Happy users</p>
          </div>
          <div className="hidden h-12 w-px bg-[var(--border)] sm:block" />
          <div className="text-center">
            <p className="font-display text-5xl font-bold">98%</p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">Would recommend</p>
          </div>
          <div className="hidden h-12 w-px bg-[var(--border)] sm:block" />
          <div className="text-center">
            <p className="font-display text-5xl font-bold">50k+</p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">Websites published</p>
          </div>
        </div>

        {/* Testimonial grid */}
        <div className="mt-12 columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="group break-inside-avoid overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/20 hover:shadow-xl hover:shadow-black/10"
            >
              {/* Quote mark */}
              <div className="mb-4 text-4xl leading-none text-[var(--accent)]/30 font-display">&ldquo;</div>

              <p className="mb-4 text-sm leading-relaxed text-[var(--foreground)]">
                {t.text}
              </p>

              {/* Highlight chip */}
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                {t.highlight}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${t.avatarColor} text-xs font-bold text-white shadow-lg`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{t.role}</p>
                  </div>
                </div>
                <StarRating count={t.rating} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
