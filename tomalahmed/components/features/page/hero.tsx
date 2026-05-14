import Image from "next/image";
import Link from "next/link";

import { ROUTES } from "@/lib/routes";
import { Reveal } from "@/components/ui/reveal";

export function FeaturesPageHero() {
  return (
    <section className="mx-auto max-w-container-max px-gutter py-16">
      <div className="flex flex-col items-center gap-12 md:flex-row md:gap-16">
        <Reveal className="flex-1 space-y-6">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            Evolution of Chat
          </span>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-on-background md:text-5xl lg:text-[48px] lg:leading-[56px]">
            Designed for Power
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-secondary md:text-xl md:leading-8">
            Experience a messaging platform built for the demands of modern communication. Crimson Connect bridges the gap
            between secure professional utility and seamless social interaction.
          </p>
          <div className="flex flex-wrap gap-4 pt-1">
            <Link
              href={ROUTES.chat}
              className="inline-flex items-center justify-center rounded-lg border-0 bg-primary px-8 py-2.5 text-center text-base font-medium text-on-primary no-underline shadow-md shadow-primary/20 outline-none transition-[transform,colors,box-shadow] hover:bg-[#8f0010] hover:shadow-lg active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Try Global chat
            </Link>
            <Link
              href="#"
              className="inline-flex items-center justify-center rounded-lg border border-outline bg-surface px-8 py-2.5 text-center text-base font-medium text-on-surface no-underline outline-none transition-[transform,colors] hover:bg-surface-container active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Watch Demo
            </Link>
          </div>
        </Reveal>
        <Reveal
          className="relative aspect-video w-full flex-1 overflow-hidden rounded-xl border border-outline-variant bg-surface-container shadow-sm ring-1 ring-outline-variant/30 transition-[transform,box-shadow] duration-300 hover:shadow-lg hover:ring-primary/20"
          delay={0.08}
        >
          <Image
            src="/1.png"
            alt="Crimson Connect dashboard on a monitor"
            fill
            className="object-cover transition-transform duration-500 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </Reveal>
      </div>
    </section>
  );
}
