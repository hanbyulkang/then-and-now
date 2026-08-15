"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Seed } from "@/components/botanical/Seed";

/**
 * 01 — Landing.
 *
 * Two generations on opposite sides of the screen, with nothing between them
 * yet. The whole product is the story of that gap closing.
 */
export default function LandingPage() {
  const [rooting, setRooting] = useState(false);

  return (
    <main className="relative flex min-h-dvh flex-col bg-canvas md:flex-row">
      {/* THEN — aged paper, archival photograph */}
      <section className="paper-grain relative flex flex-1 flex-col items-start justify-between bg-then-paper p-8 pb-16 md:p-16">
        <p className="font-serif text-[20px] text-then-ink md:text-[24px]">
          Then
        </p>
        <div className="flex w-full flex-col items-center gap-6 py-10 md:absolute md:inset-x-0 md:top-1/2 md:-translate-y-1/2 md:py-0">
          <figure className="rounded-[4px] border border-bloom-gold bg-canvas p-3 shadow-[0_16px_16px_rgba(64,56,47,0.07)] md:p-4">
            <div className="relative h-[260px] w-[200px] overflow-hidden rounded-[2px] md:h-[360px] md:w-[280px]">
              <Image
                src="/assets/photos/grandma-library-1974.jpg"
                alt="A young woman reading in a Seoul library, 1974"
                fill
                sizes="(max-width: 768px) 200px, 280px"
                className="archival-photo object-cover"
                priority
              />
              <span
                className="absolute inset-0 bg-then-faded/15"
                aria-hidden
              />
            </div>
          </figure>
          <figcaption className="flex flex-wrap items-baseline justify-center gap-2">
            <span className="font-serif text-[20px] text-then-ink">
              Seoul, 1974
            </span>
            <span className="text-[12px] uppercase tracking-wide text-then-faded">
              Grandmother&apos;s Youth
            </span>
          </figcaption>
        </div>
        <span className="hidden md:block" aria-hidden />
      </section>

      {/* NOW — clean off-white, contemporary photograph */}
      <section className="relative flex flex-1 flex-col items-end justify-between bg-now-canvas p-8 pt-16 md:p-16">
        <p className="text-[14px] font-semibold uppercase tracking-wide text-now-slate">
          Now
        </p>
        <div className="flex w-full flex-col items-center gap-6 py-10 md:absolute md:inset-x-0 md:top-1/2 md:-translate-y-1/2 md:py-0">
          <figure className="rounded-[8px] border border-black/[0.03] bg-white p-2.5 shadow-[0_8px_12px_rgba(0,0,0,0.02)] md:p-3">
            <div className="relative h-[260px] w-[200px] overflow-hidden rounded-[4px] md:h-[360px] md:w-[280px]">
              <Image
                src="/assets/photos/ann-living-2026.jpg"
                alt="A young woman at home in Seattle, 2026"
                fill
                sizes="(max-width: 768px) 200px, 280px"
                className="object-cover"
                priority
              />
            </div>
          </figure>
          <figcaption className="flex flex-wrap items-baseline justify-center gap-2">
            <span className="text-[16px] font-medium text-now-charcoal">
              Seattle, 2026
            </span>
            <span className="text-[12px] uppercase tracking-wide text-now-slate">
              Ann&apos;s Story
            </span>
          </figcaption>
        </div>
        <span className="hidden md:block" aria-hidden />
      </section>

      {/* BETWEEN — the card sits across the seam of the two worlds */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-5">
        <div className="pointer-events-auto flex w-full max-w-[540px] flex-col items-center gap-7 rounded-[24px] border-[1.5px] border-bloom-gold bg-canvas p-8 text-center shadow-[0_24px_24px_rgba(64,56,47,0.12)] md:gap-8 md:p-10">
          <div className="flex flex-col items-center gap-3">
            <h1 className="font-serif text-[44px] leading-none text-then-ink md:text-[64px]">
              Then &amp; Now
            </h1>
            <p className="font-memory text-[18px] italic text-then-faded md:text-[20px]">
              A shared memory garden for two generations.
            </p>
          </div>

          <p className="max-w-[400px] text-[14px] leading-[1.6] text-then-ink">
            One question at a time, discover the stories you never knew to ask.
            Build a bridge across years and miles.
          </p>

          <Link
            href="/onboarding/who"
            onMouseEnter={() => setRooting(true)}
            onMouseLeave={() => setRooting(false)}
            onFocus={() => setRooting(true)}
            onBlur={() => setRooting(false)}
            className="rounded-[24px] bg-bloom-green px-6 py-3 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-then-sage"
          >
            Start your garden
          </Link>

          <div className="flex flex-col items-center gap-1 pt-2">
            <Seed rooting={rooting} />
            <p className="text-[11px] uppercase tracking-wide text-then-faded">
              Plant the first story
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
