"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Do I need coding knowledge to use Nexora Studio?",
    a: "Absolutely not! Nexora Studio is designed from the ground up for non-technical users. If you can drag and drop, you can build a professional website. Our pre-built components handle the complex parts, and every element is fully editable through a visual interface.",
  },
  {
    q: "How does the template system work?",
    a: "Nexora Studio provides 50+ professionally designed templates. You can pick any template as a starting point and customize it completely using our drag-and-drop builder and properties panel. You have full control over every element, color, and layout.",
  },
  {
    q: "Can I use my own custom domain?",
    a: "Yes! On the Pro and Team plans, you can connect any custom domain you own. We handle SSL certificate setup automatically, so your site is secure from day one. Free plan users get a free yoursite.nexora.app subdomain.",
  },
  {
    q: "Is the website output clean and production-ready?",
    a: "Absolutely. Nexora generates semantic HTML with optimized CSS. On the Pro plan, you can export clean HTML/CSS code to self-host anywhere. Our output is mobile-first, SEO-friendly, and optimized for performance.",
  },
  {
    q: "What database does Nexora Studio use?",
    a: "The platform is built on PostgreSQL managed via Prisma ORM. This gives us type-safe queries, reliable migrations, and excellent scalability. All user data, projects, and configurations are securely stored and backed up.",
  },
  {
    q: "Can I collaborate with my team?",
    a: "Team collaboration is available on the Team plan, which supports up to 10 team members with shared project libraries, role-based permissions, and real-time co-editing features. Enterprise plans with unlimited seats are also available.",
  },
  {
    q: "What authentication methods are supported?",
    a: "Nexora Studio supports email/password registration and Google OAuth via NextAuth.js. All sessions are secured with JWT tokens and refresh token rotation. We follow industry best practices for authentication security.",
  },
  {
    q: "Is there a free plan? What are the limits?",
    a: "Yes! The free plan lets you create up to 3 projects, use the basic component library, publish to a Nexora subdomain, and access all community templates. It's a great way to explore the platform before upgrading.",
  },
  {
    q: "How is media and image storage handled?",
    a: "All media uploads are stored via Cloudinary's CDN, ensuring fast global delivery, automatic optimization, and intelligent compression. Your images load blazing-fast worldwide regardless of where your visitors are.",
  },
  {
    q: "Can I migrate my existing website to Nexora?",
    a: "While direct import isn't available yet, you can recreate your existing website structure using our templates and components. Future versions will include Figma-to-Nexora conversion and more import tools.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState(null);

  return (
    <section id="faq" className="relative px-6 py-24">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">FAQ</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Frequently asked{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              questions
            </span>
          </h2>
          <p className="mt-4 text-lg text-[var(--muted-foreground)]">
            Everything you need to know about Nexora Studio. Can&apos;t find your answer?{" "}
            <a href="mailto:support@nexorastudio.app" className="text-[var(--accent)] underline underline-offset-2">
              Reach out to us.
            </a>
          </p>
        </div>

        {/* Accordion */}
        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                  isOpen
                    ? "border-indigo-500/40 bg-indigo-500/5 shadow-lg shadow-indigo-500/5"
                    : "border-[var(--border)] bg-[var(--card)] hover:border-indigo-500/20"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >
                  <span className="pr-4 font-semibold">{faq.q}</span>
                  <span
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                      isOpen
                        ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-400 rotate-45"
                        : "border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)]"
                    }`}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="px-6 pb-6 text-[var(--muted-foreground)] leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
