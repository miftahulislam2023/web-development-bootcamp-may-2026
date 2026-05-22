import Link from "next/link";

import { ROUTES } from "@/lib/routes";
import { Reveal } from "@/components/ui/reveal";

export function FeaturesPageCta() {
  return (
    <Reveal className="mx-auto max-w-2xl px-gutter py-16 text-center">
      <h2 className="mb-4 text-4xl font-bold tracking-tight text-on-background md:text-5xl lg:text-[48px] lg:leading-[56px]">
        Ready to upgrade your experience?
      </h2>
      <p className="mb-8 text-lg leading-relaxed text-secondary md:text-xl md:leading-8">
        Join over 2 million users who trust Crimson Connect for their daily communications. High-fidelity, secure, and
        always synchronized.
      </p>
      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <Link
          href={ROUTES.chatGlobal}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border-0 bg-primary px-10 py-4 text-center text-base font-medium text-on-primary no-underline shadow-md shadow-primary/20 outline-none transition-[transform,colors,box-shadow] hover:bg-[#8f0010] hover:shadow-lg active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Open Global chat
        </Link>
        <Link
          href="mailto:service.natomal@gmail.com"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-outline bg-surface px-10 py-4 text-center text-base font-medium text-on-surface no-underline outline-none transition-[transform,colors] hover:bg-surface-container active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Contact Sales
        </Link>
      </div>
    </Reveal>
  );
}
