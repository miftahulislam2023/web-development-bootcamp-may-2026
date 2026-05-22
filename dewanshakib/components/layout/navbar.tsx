"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import SignIn from "../auth/sign-in";
import Image from "next/image";
import logo from "@/public/assets/khorcha_logo.png";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Button } from "../ui/button";

const navLinks = [
  {
    id: 1,
    href: "#features",
    name: "Features",
  },
  {
    id: 2,
    href: "#testimonials",
    name: "Testomonials",
  },
  {
    id: 3,
    href: "#faq",
    name: "FAQ",
  },
];

export default function Navbar() {

  return (
    <header className="sticky shadow-2xs top-0 dark:border-b z-50 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
      <div className="flex py-4 w-full items-center justify-between px-5">
        <Link href="/" className="relative w-32 h-11 shrink-0 ">
          <Image
            src={logo}
            fill
            className="object-contain dark:invert"
            alt="khorcha - brand logo"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-x-5">
          {navLinks.map((n) => (
            <Link
              key={n.id}
              href={n.href}
              className="text-sm hover:text-primary transition-colors"
            >
              {n.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-x-3">
          {/* <ThemeToggle /> */}
          <SignIn variant={"default"} title="Get Started" />
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger>
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent className="w-full md:hidden">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <div className="relative w-28 -mt-2 h-11 shrink-0 ">
                    <Image
                      src={logo}
                      fill
                      className="object-contain dark:invert"
                      alt="khorcha - brand logo"
                      priority
                    />
                  </div>
                </SheetTitle>
              </SheetHeader>
              <div className="flex pl-5 w-full flex-col gap-6 mt-4">
                <div className="flex flex-col gap-4">
                  {navLinks.map((n) => (
                    <SheetClose asChild key={n.id}>
                      <Link
                        href={n.href}
                        className="text-lg font-medium hover:text-primary transition-colors"
                      >
                        {n.name}
                      </Link>
                    </SheetClose>
                  ))}
                </div>
                <div className="flex mt-5 flex-row gap-3">
                  <ThemeToggle />
                  <SignIn variant={"default"} title="Get Started" />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
