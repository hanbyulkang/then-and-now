"use client";

import Image from "next/image";
import Link from "next/link";
import { BookSpread } from "@/components/book/BookSpread";
import { Seedling } from "@/components/garden/Botanical";
import { FlowerMark } from "@/components/garden/Flower";

/**
 * The book, opened for the first time.
 *
 * Her photograph on the left page, hers on the right, and the name of it across
 * the fold. Under the name a single seedling in bare earth — the whole garden
 * before anybody has said a word. There is no finished garden here, because
 * nobody has grown one yet.
 */
export default function LandingPage() {
  return (
    <main className="flex min-h-dvh flex-col bg-canvas">
      <BookSpread
        className="min-h-[600px]"
        left={
          <div className="relative flex flex-1 items-center justify-center p-8 md:justify-start md:p-14 md:pr-0">
            <figure
              className="relative w-fit border border-bloom-gold/50 bg-canvas p-3 shadow-[0_20px_36px_rgba(64,56,47,0.12)] md:p-4"
              style={{ transform: "rotate(-2deg)" }}
            >
              <div className="relative h-[268px] w-[210px] overflow-hidden md:h-[372px] md:w-[290px]">
                <Image
                  src="/assets/photos/grandma-library-1974.jpg"
                  alt="A young woman reading in a Seoul library, 1974"
                  fill
                  sizes="(max-width: 768px) 210px, 290px"
                  className="archival-photo object-cover"
                  priority
                />
              </div>
              <figcaption className="pt-2 text-center text-[10px] uppercase tracking-[0.26em] text-then-faded">
                Seoul · 1974
              </figcaption>

              {/* Pressed against the print, the way one ends up in an album. */}
              <span className="pointer-events-none absolute -right-9 -top-10">
                <FlowerMark size={82} seed={3} side="then" />
              </span>
              <span className="pointer-events-none absolute -bottom-8 -left-9">
                <FlowerMark size={58} seed={12} side="then" />
              </span>
            </figure>
          </div>
        }
        right={
          <div className="relative flex flex-1 items-center justify-center p-8 md:justify-end md:p-14 md:pl-0">
            <figure
              className="relative w-fit rounded-[10px] p-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.06)] md:p-3"
              style={{ transform: "rotate(1.4deg)" }}
            >
              <div className="relative h-[268px] w-[210px] overflow-hidden rounded-[6px] md:h-[372px] md:w-[290px]">
                <Image
                  src="/assets/photos/ann-living-2026.jpg"
                  alt="A young woman at home in Seattle, 2026"
                  fill
                  sizes="(max-width: 768px) 210px, 290px"
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
        }
        atTheCentre={
          <div className="flex max-w-[32ch] flex-col items-center gap-5 px-5 text-center">
            <h1
              className="font-serif text-[40px] leading-none text-then-ink md:text-[58px]"
              style={{ textShadow: "0 0 26px #f2ece0, 0 0 50px #f2ece0" }}
            >
              Then &amp; Now
            </h1>
            <p
              className="font-serif text-[17px] italic leading-snug text-then-faded md:text-[20px]"
              style={{ textShadow: "0 0 20px #f2ece0, 0 0 38px #f2ece0" }}
            >
              A shared memory garden
              <br />
              for two generations.
            </p>
            <p
              className="max-w-[24ch] text-[13px] leading-[1.8] text-then-ink md:text-[14px]"
              style={{ textShadow: "0 0 20px #f2ece0, 0 0 38px #f2ece0" }}
            >
              One question at a time, discover the stories you never knew to
              ask.
            </p>

            <svg width="92" height="82" viewBox="-46 -76 92 82" aria-hidden>
              <Seedling x={0} y={0} length={72} />
            </svg>

            <Link
              href="/onboarding/who"
              className="text-[16px] font-semibold text-bloom-green underline-offset-8 transition-colors hover:text-then-ink hover:underline"
              style={{ textShadow: "0 0 18px #f2ece0, 0 0 32px #f2ece0" }}
            >
              Start your garden →
            </Link>
          </div>
        }
      />
    </main>
  );
}
