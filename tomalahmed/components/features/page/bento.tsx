import Image from "next/image";

import { Reveal } from "@/components/ui/reveal";

import { materialIconFilled } from "./icon-style";

export function FeaturesPageBento() {
  return (
    <section className="bg-surface-container-low py-16">
      <div className="mx-auto max-w-container-max px-gutter">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <Reveal className="md:col-span-8" delay={0.02}>
            <div className="flex flex-col gap-8 rounded-xl border border-outline-variant bg-surface p-6 shadow-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md md:flex-row motion-reduce:transition-none motion-reduce:hover:translate-y-0">
            <div className="flex-1 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <span className="material-symbols-outlined text-primary" style={materialIconFilled}>
                  encrypted
                </span>
              </div>
              <h2 className="text-2xl font-semibold text-on-surface">End-to-End Encryption</h2>
              <p className="text-base leading-6 text-secondary">
                Your privacy is non-negotiable. Every message, file, and voice call is protected by state-of-the-art
                encryption protocols. We use the Signal Protocol to ensure that only you and your intended recipients
                can read what is sent.
              </p>
              <ul className="space-y-2 pt-2 text-sm font-medium text-secondary">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
                  No metadata logging
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
                  Perfect Forward Secrecy
                </li>
              </ul>
            </div>
            <div className="relative min-h-[240px] flex-1 overflow-hidden rounded-lg bg-surface-container">
              <Image
                src="/2.png"
                alt="Secure infrastructure representing encryption"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 40vw, 100vw"
              />
            </div>
            </div>
          </Reveal>

          <Reveal className="md:col-span-4" delay={0.06}>
            <div className="space-y-4 rounded-xl border border-outline-variant bg-surface p-6 shadow-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <span className="material-symbols-outlined text-primary" style={materialIconFilled}>
                devices
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-on-surface">Multi-Device Sync</h2>
            <p className="text-base leading-6 text-secondary">
              Stay connected across your phone, tablet, and desktop. Our proprietary sync engine maintains conversation
              state without ever compromising security.
            </p>
            <div className="pt-6">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-surface-container-high">
                <Image
                  src="/3.png"
                  alt="Synced messaging across phone, tablet, and laptop"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
              </div>
            </div>
            </div>
          </Reveal>

          <Reveal className="md:col-span-12" delay={0.1}>
            <div className="flex flex-col items-center gap-8 rounded-xl border border-outline-variant bg-surface p-6 shadow-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md md:flex-row motion-reduce:transition-none motion-reduce:hover:translate-y-0">
            <div className="relative order-2 h-64 w-full flex-1 overflow-hidden rounded-lg shadow-sm md:order-1">
              <Image
                src="/4.png"
                alt="Team collaboration in a modern workspace"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
            <div className="order-1 flex-1 space-y-4 md:order-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <span className="material-symbols-outlined text-primary" style={materialIconFilled}>
                  groups
                </span>
              </div>
              <h2 className="text-2xl font-semibold text-on-surface">Advanced Group Controls</h2>
              <p className="text-base leading-6 text-secondary">
                Manage communities of any size with professional-grade moderation tools. Set granular permissions,
                automate membership approvals, and organize topics with threaded conversations that keep the noise to a
                minimum.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="rounded-lg border border-outline-variant/30 bg-surface-container-low p-2">
                  <span className="block text-sm font-medium text-primary">Admin Roles</span>
                  <span className="text-xs text-secondary">Fine-tuned control</span>
                </div>
                <div className="rounded-lg border border-outline-variant/30 bg-surface-container-low p-2">
                  <span className="block text-sm font-medium text-primary">Threaded Chat</span>
                  <span className="text-xs text-secondary">Organized topics</span>
                </div>
              </div>
            </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
