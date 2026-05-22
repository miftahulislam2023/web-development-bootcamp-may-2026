"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUp } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

const footerLinks = [
  { label: "Features", href: "/features" },
  { label: "Analytics", href: "/analytics" },
  { label: "About Us", href: "/about-us" },
];

const socials = [
  {
    icon: "/icons/github.svg",
    href: "https://github.com/hadialhamza",
    alt: "GitHub",
  },
  {
    icon: "/icons/linkedin.svg",
    href: "https://www.linkedin.com/in/hadihamza",
    alt: "LinkedIn",
  },
  {
    icon: "/icons/gmail.svg",
    href: "mailto:hamzaglory@gmail.com",
    alt: "Gmail",
  },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-background border-t border-border pt-12 pb-8 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 mb-10">
          {/* Brand Info */}
          <div className="flex flex-col items-center lg:items-start space-y-4">
            <Link href="/">
              <Logo />
            </Link>
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed font-medium text-center lg:text-left">
              Advanced financial insights for modern teams and individuals.
            </p>
          </div>

          {/* Consolidated Links */}
          <nav className="flex flex-wrap items-center justify-center gap-8">
            {footerLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors tracking-tight"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Socials */}
          <div className="flex items-center gap-3">
            {socials.map((social, index) => (
              <Link
                key={index}
                href={social.href}
                className="p-2.5 rounded-xl bg-muted/30 hover:bg-primary/10 transition-all duration-300 border border-border/50 group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={social.icon}
                  alt={social.alt}
                  width={20}
                  height={20}
                  className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[11px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} SpendSentry. All rights reserved.
          </p>

          <Button
            variant="icon"
            size="sm"
            onClick={scrollToTop}
            className="h-10 w-10 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl transition-all duration-300"
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-150 h-50 bg-primary/5 rounded-full blur-[80px] -z-10" />
    </footer>
  );
}
