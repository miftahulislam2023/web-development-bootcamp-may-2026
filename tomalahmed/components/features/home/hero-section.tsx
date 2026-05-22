import Image from "next/image";
import Link from "next/link";

import { Chip } from "@heroui/react";

import { ROUTES } from "@/lib/routes";
import { Reveal } from "@/components/ui/reveal";

const ctaPrimary =
  "inline-flex min-h-[52px] items-center justify-center rounded-lg border-0 bg-primary px-10 py-6 text-lg font-bold text-on-primary no-underline shadow-lg shadow-primary/35 outline-none transition-[transform,colors,box-shadow] hover:bg-[#8f0010] hover:shadow-xl active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const ctaSecondary =
  "inline-flex min-h-[52px] items-center justify-center rounded-lg border-2 border-primary bg-surface-container-lowest px-10 py-6 text-lg font-semibold text-primary no-underline outline-none transition-[transform,colors,box-shadow] hover:bg-surface-container-high active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function HeroSection() {
  return (
    <section className="mx-auto max-w-container-max px-gutter pb-16 pt-16 text-center">
      <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-6">
        <Chip color="danger" variant="soft" className="bg-danger-container text-on-danger-container">
          Secure. Fast. Global.
        </Chip>
        <h1 className="text-balance text-4xl font-bold tracking-tight text-on-surface md:text-5xl lg:text-[48px] lg:leading-[56px]">
          Connecting the World, One Message at a Time
        </h1>
        <p className="max-w-2xl text-pretty text-lg leading-relaxed text-secondary md:text-xl md:leading-8">
          Experience the next generation of communication with end-to-end encryption, lightning-fast speeds, and
          professional-grade reliability for teams and individuals.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Link href={ROUTES.chat} className={ctaPrimary}>
            Start Chatting Now
          </Link>
          <Link href={ROUTES.features} className={ctaSecondary}>
            Learn More
          </Link>
        </div>
      </Reveal>

      <Reveal
        className="mt-16 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest p-1 shadow-2xl transition-shadow duration-300 hover:shadow-primary/10"
        delay={0.08}
      >
        <Image
          src="/banner-hero.png"
          alt="Crimson Connect desktop interface"
          width={1920}
          height={1080}
          priority
          className="h-auto w-full rounded-lg object-cover transition-transform duration-500 ease-out hover:scale-[1.02] motion-reduce:hover:scale-100"
        />
      </Reveal>
    </section>
  );
}
