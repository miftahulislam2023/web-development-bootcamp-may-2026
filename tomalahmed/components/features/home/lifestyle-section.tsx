import Image from "next/image";

import { Reveal } from "@/components/ui/reveal";

import { homeChecklist } from "./content";

export function LifestyleSection() {
  return (
    <section className="py-16">
      <div className="mx-auto grid max-w-container-max grid-cols-1 items-center gap-12 px-gutter md:grid-cols-2 md:gap-16">
        <Reveal className="flex flex-col gap-6">
          <h2 className="text-4xl font-bold text-on-surface md:text-5xl lg:text-[48px] lg:leading-[56px]">
            Stay Connected Anywhere
          </h2>
          <p className="text-lg leading-relaxed text-secondary md:text-xl md:leading-8">
            Whether you&apos;re working from a bustling city cafe or relaxing in a remote mountain cabin, Crimson Connect
            keeps you linked to what matters most. Our adaptive protocol ensures connection even in low-bandwidth areas.
          </p>
          <ul className="flex flex-col gap-3">
            {homeChecklist.map((item) => (
              <li key={item} className="flex items-center gap-2 text-base text-on-surface">
                <span className="material-symbols-outlined text-primary">check_circle</span>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal
          className="relative h-[min(500px,70vh)] min-h-[280px] overflow-hidden rounded-xl shadow-md ring-1 ring-outline-variant/40 transition-[transform,box-shadow] duration-300 ease-out hover:shadow-xl hover:ring-primary/25"
          delay={0.06}
        >
          <Image
            src="/cta.png"
            alt="People collaborating with Crimson Connect"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
          />
        </Reveal>
      </div>
    </section>
  );
}
