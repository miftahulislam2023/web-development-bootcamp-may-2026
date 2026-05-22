"use client";

import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import logo from "@/public/assets/khorcha_logo.png";

const footerLinks = [
  { name: "Features", href: "#features" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "FAQ", href: "#faq" },
];

export default function Footer() {
  return (
    <footer className="py-12 border-t bg-muted/20">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="relative w-28 h-9 shrink-0">
              <Image
                src={logo}
                fill
                className="object-contain dark:invert"
                alt="Khorcha"
                priority
              />
            </Link>
            <span className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Khorcha. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}