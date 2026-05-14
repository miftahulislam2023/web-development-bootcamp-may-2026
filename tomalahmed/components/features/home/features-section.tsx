import { Card } from "@heroui/react";

import { Reveal } from "@/components/ui/reveal";

import { homePowerFeatures } from "./content";

/** Home “Powerful Features” — three-up cards (not the /features bento page). */
export function FeaturesSection() {
  return (
    <section id="features" className="bg-surface-container-low py-16">
      <div className="mx-auto max-w-container-max px-gutter">
        <Reveal className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-on-surface md:text-5xl lg:text-[48px] lg:leading-[56px]">
            Powerful Features
          </h2>
          <p className="mx-auto max-w-xl text-lg text-secondary md:text-xl md:leading-8">
            Everything you need for seamless communication, built with privacy as the core foundation.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {homePowerFeatures.map((feature, index) => (
            <Reveal key={feature.title} delay={0.05 * index}>
              <Card className="group flex cursor-default flex-col gap-3 border border-outline-variant bg-surface-container-lowest p-8 shadow-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-container text-on-primary transition-transform duration-200 group-hover:scale-105 motion-reduce:group-hover:scale-100">
                  <span className="material-symbols-outlined">{feature.icon}</span>
                </div>
                <Card.Title className="text-2xl font-semibold text-on-surface">{feature.title}</Card.Title>
                <Card.Description className="text-base leading-6 text-secondary">{feature.description}</Card.Description>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
