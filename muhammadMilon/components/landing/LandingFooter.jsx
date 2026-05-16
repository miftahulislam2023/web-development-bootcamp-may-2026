import Link from "next/link";
import { Logo } from "@/components/common/Logo";

const footerLinks = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Components", href: "/components" },
    { label: "Premium Templates", href: "/templates" },
    { label: "Pricing", href: "/pricing" },
    { label: "Templates", href: "/templates" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/docs/api" },
    { label: "Changelog", href: "/changelog" },
    { label: "Blog", href: "/blog" },
    { label: "GitHub", href: "https://github.com" },
    { label: "Status", href: "/status" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
  Community: [
    { label: "Discord Server", href: "/discord" },
    { label: "Twitter / X", href: "https://twitter.com" },
    { label: "YouTube", href: "https://youtube.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "Showcase", href: "/showcase" },
    { label: "Affiliate Program", href: "/affiliate" },
  ],
};

const techBadges = [
  "Next.js", "Tailwind CSS", "PostgreSQL", "Prisma", "Nodemailer", "Vercel",
];

export function LandingFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--border)] bg-[var(--card)]">
      {/* Top gradient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Top row */}
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Logo className="mb-4" />

            <p className="mt-4 text-sm leading-relaxed text-[var(--muted-foreground)]">
              Professional drag-and-drop website builder. Design, customize, and publish modern sites — without writing a line of code.
            </p>

            {/* Social links */}
            <div className="mt-6 flex gap-3">
              {[
                { label: "GitHub", icon: <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg> },
                { label: "Twitter", icon: <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                { label: "LinkedIn", icon: <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
                { label: "YouTube", icon: <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] transition-all hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-400"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-4">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--foreground)]">
                  {category}
                </p>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Tech badges */}
        <div className="mt-12 border-t border-[var(--border)] pt-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
            Built with
          </p>
          <div className="flex flex-wrap gap-2">
            {techBadges.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs font-medium text-[var(--muted-foreground)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-8 sm:flex-row">
          <p className="text-sm text-[var(--muted-foreground)]">
            © {new Date().getFullYear()} Nexora Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              All systems operational
            </span>
            <span>·</span>
            <span>Made with ❤️ using Next.js + Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
