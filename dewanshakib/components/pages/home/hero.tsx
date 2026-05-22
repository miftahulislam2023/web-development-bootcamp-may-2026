"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Wallet, PieChart } from "lucide-react";
import SignIn from "@/components/auth/sign-in";

const lightImg = "/assets/hero_section_perview_light.png";
const darkImg = "/assets/hero_section_perview_dark.png";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 lg:py-32">
      <div className="container px-4 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="flex flex-col items-start space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Wallet className="w-4 h-4" />
                <span>Personal Finance Tracker</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Track Your Finances with{" "}
                <span className="text-primary">Khorcha</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                Take control of your money. Track income, manage expenses, and
                visualize your financial journey with beautiful charts.
              </p>
            </div>
            <div className="flex flex-row gap-3 md:gap-4">
              <SignIn variant={"default"} title="Start Free" />
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">See Features</Link>
              </Button>
            </div>
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Privacy first</span>
              </div>
            </div>
          </div>
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border">
            <div className="dark:hidden absolute inset-0">
              <Image
                src={lightImg}
                alt="Khorcha Dashboard Preview - Light Mode"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="hidden dark:block absolute inset-0">
              <Image
                src={darkImg}
                alt="Khorcha Dashboard Preview - Dark Mode"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
