"use client";

import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";

const HeroSection = () => {
  return (
    <div className="pb-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title">
          Your Finances,<br /> Made Simple
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          BudgeTX helps you track expenses, set budgets, and stay on top of
          your money — without the noise. Just clean, straightforward tools
          that actually make sense.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/dashboard ">
            <Button className="px-8" size="lg">
              Get Started
            </Button>
          </Link>
          <Link href="https://youtu.be/sTjnNV12kgw?si=UX91tcchYdVYu-bN" target="_blank">
            <Button variant="outline" className="px-8" size="lg">
              Watch Demo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
