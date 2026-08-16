"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BookSpread, PageHead } from "@/components/book/BookSpread";
import { Seed } from "@/components/botanical/Seed";

/**
 * The title spread.
 *
 * Two generations on facing pages with nothing between them yet, and the name
 * of the book written across the fold. The whole product is the story of that
 * gap closing.
 */
export default function LandingPage() {
  const [rooting, setRooting] = useState(false);

  return (
    <main className="flex min-h-dvh flex-col bg-canvas">
      <BookSpread
        left={
          <div className="flex flex-1 flex-col gap-10 p-8 md:p-14 md:pr-[34%]">
            <PageHead side="then" eyebrow="Then" name="Seoul, 1974" />

            <figure className="flex flex-1 flex-col items-center justify-center gap-4">
              <div
                className="border border-bloom-gold/70 bg-canvas p-3 shadow-[0_18px_30px_rgba(64,56,47,0.1)] md:p-4"
                style={{ transform: "rotate(-1.4deg)" }}
              >
                <div className="relative h-[240px] w-[186px] overflow-hidden md:h-[330px] md:w-[256px]">
                  <Image
                    src="/assets/photos/grandma-library-1974.jpg"
                    alt="A young woman reading in a Seoul library, 1974"
                    fill
                    sizes="(max-width: 768px) 186px, 256px"
                    className="archival-photo object-cover"
                    priority
                  />
                </div>
              </div>
              <figcaption className="text-[11px] uppercase tracking-[0.24em] text-then-faded">
                Grandmother&apos;s youth
              </figcaption>
            </figure>
          </div>
        }
        right={
          <div className="flex flex-1 flex-col items-end gap-10 p-8 text-right md:p-14 md:pl-[34%]">
            <PageHead
              side="now"
              eyebrow="Now"
              name="Seattle, 2026"
              className="items-end"
            />

            <figure className="flex flex-1 w-full flex-col items-center justify-center gap-4">
              <div
                className="rounded-[10px] p-2.5 shadow-[0_14px_36px_rgba(0,0,0,0.05)] md:p-3"
                style={{ transform: "rotate(0.9deg)" }}
              >
                <div className="relative h-[240px] w-[186px] overflow-hidden rounded-[6px] md:h-[330px] md:w-[256px]">
                  <Image
                    src="/assets/photos/ann-living-2026.jpg"
                    alt="A young woman at home in Seattle, 2026"
                    fill
                    sizes="(max-width: 768px) 186px, 256px"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              <figcaption className="text-[11px] uppercase tracking-[0.24em] text-now-slate">
                Ann&apos;s story
              </figcaption>
            </figure>
          </div>
        }
        atTheCentre={
          /* The name of the book, written across the fold. */
          <div className="flex max-w-[40ch] flex-col items-center gap-5 text-center">
            <h1
              className="font-serif text-[46px] leading-none text-then-ink md:text-[68px]"
              style={{ textShadow: "0 0 26px #f2ece0, 0 0 48px #f2ece0" }}
            >
              Then &amp; Now
            </h1>
            <p
              className="font-serif text-[18px] italic text-then-faded md:text-[21px]"
              style={{ textShadow: "0 0 20px #f2ece0, 0 0 36px #f2ece0" }}
            >
              A shared memory garden for two generations.
            </p>
            <p
              className="max-w-[34ch] text-[14px] leading-[1.7] text-then-ink md:text-[15px]"
              style={{ textShadow: "0 0 20px #f2ece0, 0 0 36px #f2ece0" }}
            >
              One question at a time, discover the stories you never knew to
              ask.
            </p>

            <Link
              href="/onboarding/who"
              onMouseEnter={() => setRooting(true)}
              onMouseLeave={() => setRooting(false)}
              onFocus={() => setRooting(true)}
              onBlur={() => setRooting(false)}
              className="mt-3 flex flex-col items-center gap-3"
            >
              <Seed rooting={rooting} />
              <span
                className="text-[16px] font-semibold text-bloom-green underline-offset-8 transition-colors hover:text-then-ink hover:underline md:text-[17px]"
                style={{ textShadow: "0 0 18px #f2ece0, 0 0 32px #f2ece0" }}
              >
                Plant the first story →
              </span>
            </Link>
          </div>
        }
      />
    </main>
  );
}
