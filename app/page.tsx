"use client";

import Image from "next/image";
import Link from "next/link";
import { Seedling } from "@/components/garden/Botanical";
import { Field } from "@/components/garden/Field";
import { FlowerMark } from "@/components/garden/Flower";
import { LeafButton } from "@/components/ui/Panel";

/**
 * The first page.
 *
 * One painted spread, warm where her life is and cooling where yours is, with
 * no line between them. Her photograph is a print with pressed flowers against
 * it; yours is on a screen. Between them the name of the thing, and under it a
 * single seedling in bare earth — the whole garden before anybody has said a
 * word.
 */
export default function LandingPage() {
  return (
    <main className="flex min-h-dvh flex-col bg-canvas">
      <Field className="min-h-[600px] justify-center">
        <div className="grid flex-1 grid-cols-1 items-center gap-10 px-6 py-14 md:grid-cols-[1fr_auto_1fr] md:gap-6 md:px-[5%]">
          {/* Hers: a print, cornered into an album, gone warm. */}
          <div className="flex justify-center md:justify-start">
            <figure
              className="relative w-fit border border-bloom-gold/50 bg-[#fbf8f1] p-3 shadow-[0_20px_40px_rgba(64,56,47,0.14)] md:p-4"
              style={{ transform: "rotate(-2deg)" }}
            >
              <div className="relative h-[248px] w-[196px] overflow-hidden md:h-[348px] md:w-[272px]">
                <Image
                  src="/assets/photos/grandma-library-1974.jpg"
                  alt="A young woman reading in a Seoul library, 1974"
                  fill
                  sizes="(max-width: 768px) 196px, 272px"
                  className="archival-photo object-cover"
                  priority
                />
              </div>
              <figcaption className="pt-2 text-center text-[10px] uppercase tracking-[0.26em] text-then-faded">
                Seoul · 1974
              </figcaption>

              <span className="pointer-events-none absolute -right-9 -top-10">
                <FlowerMark size={84} seed={3} side="then" />
              </span>
              <span className="pointer-events-none absolute -bottom-8 -left-9">
                <FlowerMark size={58} seed={12} side="then" />
              </span>
            </figure>
          </div>

          {/* The name of it, in the middle where the two worlds meet. */}
          <div className="flex max-w-[32ch] flex-col items-center gap-5 px-2 text-center">
            <h1
              className="font-serif text-[40px] leading-none text-then-ink md:text-[56px]"
              style={{ textShadow: "0 0 26px #faf7f0, 0 0 50px #faf7f0" }}
            >
              Then &amp; Now
            </h1>
            <p
              className="font-serif text-[17px] italic leading-snug text-then-faded md:text-[19px]"
              style={{ textShadow: "0 0 20px #faf7f0, 0 0 38px #faf7f0" }}
            >
              A shared memory garden
              <br />
              for two generations.
            </p>
            <p
              className="max-w-[24ch] text-[13px] leading-[1.8] text-then-ink"
              style={{ textShadow: "0 0 20px #faf7f0, 0 0 38px #faf7f0" }}
            >
              One question at a time, discover the stories you never knew to
              ask.
            </p>

            <svg width="88" height="78" viewBox="-44 -72 88 78" aria-hidden>
              <Seedling x={0} y={0} length={68} />
            </svg>

            <Link href="/onboarding/who">
              <LeafButton className="px-7 py-3 text-[14px]">
                Start your garden
              </LeafButton>
            </Link>
          </div>

          {/* And hers: on a screen, this year. */}
          <div className="flex justify-center md:justify-end">
            <figure
              className="relative w-fit rounded-[10px] bg-white/60 p-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.07)] md:p-3"
              style={{ transform: "rotate(1.4deg)" }}
            >
              <div className="relative h-[248px] w-[196px] overflow-hidden rounded-[6px] md:h-[348px] md:w-[272px]">
                <Image
                  src="/assets/photos/ann-living-2026.jpg"
                  alt="A young woman at home in Seattle, 2026"
                  fill
                  sizes="(max-width: 768px) 196px, 272px"
                  className="object-cover"
                  priority
                />
              </div>
              <figcaption className="pt-2 text-center text-[10px] uppercase tracking-[0.26em] text-now-slate">
                Seattle · 2026
              </figcaption>

              <span className="pointer-events-none absolute -left-10 -top-9">
                <FlowerMark size={64} seed={7} side="now" />
              </span>
            </figure>
          </div>
        </div>
      </Field>
    </main>
  );
}
