"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

const plans = [
  {
    name: "Free",
    tagline: "Perfect to get started",
    monthlyPrice: 0,
    yearlyPrice: 0,
    color: "border-[var(--border)]",
    badge: null,
    cta: "Get started free",
    ctaVariant: "outline",
    features: [
      { text: "3 active projects", available: true },
      { text: "Basic component library", available: true },
      { text: "Nexora subdomain", available: true },
      { text: "Community templates", available: true },
      { text: "Unlimited page elements", available: true },
      { text: "Custom domain", available: false },
      { text: "Premium templates", available: false },
      { text: "Priority support", available: false },
      { text: "Team collaboration", available: false },
    ],
  },
  {
    name: "Pro",
    tagline: "For serious builders",
    monthlyPrice: 19,
    yearlyPrice: 15,
    color: "border-indigo-500 shadow-2xl shadow-indigo-500/20",
    badge: "Most Popular",
    cta: "Start Pro trial",
    ctaVariant: "primary",
    features: [
      { text: "Unlimited projects", available: true },
      { text: "Full component library", available: true },
      { text: "Custom domain", available: true },
      { text: "Premium templates (50+)", available: true },
      { text: "Real-time preview", available: true },
      { text: "Export clean HTML/CSS", available: true },
      { text: "Advanced components", available: true },
      { text: "Priority support", available: true },
      { text: "Team collaboration", available: false },
    ],
  },
  {
    name: "Team",
    tagline: "Scale with your team",
    monthlyPrice: 49,
    yearlyPrice: 39,
    color: "border-[var(--border)]",
    badge: null,
    cta: "Start Team trial",
    ctaVariant: "secondary",
    features: [
      { text: "Everything in Pro", available: true },
      { text: "Up to 10 team members", available: true },
      { text: "Shared project library", available: true },
      { text: "Custom branding", available: true },
      { text: "Advanced analytics", available: true },
      { text: "White-label option", available: true },
      { text: "Team templates", available: true },
      { text: "24/7 priority support", available: true },
      { text: "SLA guarantee", available: true },
    ],
  },
];

function CheckIcon({ available }) {
  if (available) {
    return (
      <svg className="h-4 w-4 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    );
  }
  return (
    <svg className="h-4 w-4 flex-shrink-0 text-[var(--muted-foreground)]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export function PricingSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="relative overflow-hidden px-6 py-24">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-px w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">Pricing</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Simple, transparent{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              pricing
            </span>
          </h2>
          <p className="mt-4 text-lg text-[var(--muted-foreground)]">
            Start free, scale as you grow. No hidden fees, no surprise charges.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <span className={`text-sm font-medium ${!yearly ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}`}>
            Monthly
          </span>
          <button
            onClick={() => setYearly(!yearly)}
            className={`relative h-7 w-12 rounded-full transition-colors ${yearly ? "bg-[var(--accent)]" : "bg-[var(--muted)]"}`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform ${yearly ? "translate-x-6" : "translate-x-1"}`}
            />
          </button>
          <span className={`text-sm font-medium ${yearly ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}`}>
            Yearly
          </span>
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-bold text-emerald-400">
            Save 20%
          </span>
        </div>

        {/* Pricing cards */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col overflow-hidden rounded-2xl border-2 bg-[var(--card)] ${plan.color} transition-transform duration-300 hover:-translate-y-1`}
            >
              {plan.badge && (
                <div className="absolute right-4 top-4 rounded-full bg-indigo-500 px-3 py-1 text-xs font-bold text-white">
                  {plan.badge}
                </div>
              )}

              {plan.name === "Pro" && (
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
              )}

              <div className="p-6">
                <p className="font-display text-xl font-bold">{plan.name}</p>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">{plan.tagline}</p>

                <div className="mt-6 flex items-end gap-1">
                  <span className="font-display text-5xl font-bold">
                    ${yearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  {plan.monthlyPrice > 0 && (
                    <span className="mb-2 text-sm text-[var(--muted-foreground)]">/mo</span>
                  )}
                </div>
                {yearly && plan.monthlyPrice > 0 && (
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    Billed annually (${plan.yearlyPrice * 12}/yr)
                  </p>
                )}

                <div className="mt-6">
                  <Button
                    href="/register"
                    variant={plan.ctaVariant}
                    className={`w-full ${plan.name === "Pro" ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:opacity-90" : ""}`}
                  >
                    {plan.cta}
                  </Button>
                </div>
              </div>

              <div className="flex-1 border-t border-[var(--border)] p-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Includes
                </p>
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex items-center gap-3">
                      <CheckIcon available={f.available} />
                      <span className={`text-sm ${f.available ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]/50 line-through"}`}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="mt-10 text-center text-sm text-[var(--muted-foreground)]">
          All plans include a 14-day free trial. No credit card required.{" "}
          <a href="#faq" className="underline underline-offset-2 hover:text-[var(--foreground)]">
            Have questions?
          </a>
        </p>
      </div>
    </section>
  );
}
