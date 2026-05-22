"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 mx-auto">
        <div className="relative rounded-2xl bg-primary/5 border p-8 md:p-16 text-center overflow-hidden">
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Start Tracking Your Finances Today
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Join thousands of users who have gained clarity on their spending.
              It takes less than a minute to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Get Started Free <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
        </div>
      </div>
    </section>
  );
}