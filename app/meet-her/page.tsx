"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { BookGround } from "@/components/book/BookSpread";
import { Bud } from "@/components/botanical/Bud";
import { SharedFlower } from "@/components/garden/SharedFlower";
import { MobileNavSpacer, Navigation } from "@/components/nav/Navigation";
import { useGarden } from "@/lib/state/garden-provider";
import { flowersOf } from "@/lib/types";

/**
 * Meet Her at My Age.
 *
 * A page turned deeper into the book — the spread arrives on a turn — where you
 * stop meeting your grandmother as your grandmother and meet the person she was
 * at the age you are now.
 *
 * The two pages are held to the same rhythm on purpose: the same four facts in
 * the same order, one on each side of the fold, so the resemblance arrives on
 * its own without anything having to point at it.
 */

const AGE = 22;

/** The same four things, asked of both of them. */
const PAIRED = [
  { then: "Seoul", now: "Seattle" },
  { then: "First job", now: "College" },
  { then: "Away from home", now: "Away from home" },
  { then: "Unsure what came next", now: "Unsure what comes next" },
];

export default function MeetHerPage() {
  const { state } = useGarden();
  const pair = state.pair;
  const shared = useMemo(() => flowersOf(state).slice(0, 4), [state]);

  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden bg-canvas">
      <Navigation />

      <BookGround className="animate-page-turn">
        <p className="pt-12 text-center text-[12px] uppercase tracking-[0.24em] text-then-faded">
          A page further in
        </p>

        {/* Both of them at the same age, one on each page. */}
        <div className="mt-12 grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-0">
          <section className="flex flex-col items-center gap-6 px-7 text-center">
            <figure className="border border-bloom-gold/60 bg-canvas p-3 shadow-[0_18px_30px_rgba(64,56,47,0.1)]">
              <div className="relative h-[280px] w-[220px] overflow-hidden md:h-[330px] md:w-[262px]">
                <Image
                  src="/assets/photos/grandma-at-22.jpg"
                  alt={`${pair.then.name} at ${AGE}`}
                  fill
                  sizes="262px"
                  className="archival-photo object-cover"
                  priority
                />
              </div>
            </figure>
            <h1 className="font-serif text-[32px] leading-none text-then-ink md:text-[42px]">
              {pair.then.name} at {AGE}
            </h1>
          </section>

          <section className="flex flex-col items-center gap-6 px-7 text-center">
            <figure className="rounded-[10px] p-2.5 shadow-[0_14px_36px_rgba(0,0,0,0.05)]">
              <div className="relative h-[280px] w-[220px] overflow-hidden rounded-[6px] md:h-[330px] md:w-[262px]">
                <Image
                  src="/assets/photos/ann-at-22.jpg"
                  alt={`${pair.now.name} at ${AGE}`}
                  fill
                  sizes="262px"
                  className="object-cover"
                  priority
                />
              </div>
            </figure>
            <h2 className="text-[30px] font-medium leading-none text-now-charcoal md:text-[38px]">
              {pair.now.name} at {AGE}
            </h2>
          </section>
        </div>

        {/* The same four facts, facing each other across the fold. */}
        <dl className="mx-auto mt-16 grid w-full max-w-[1180px] grid-cols-2 gap-y-5">
          {PAIRED.map((row) => (
            <div key={row.then + row.now} className="contents">
              <dt className="px-7 text-right font-serif text-[18px] italic text-then-ink md:pr-12 md:text-[21px]">
                {row.then}
              </dt>
              <dd className="px-7 text-[16px] text-now-charcoal md:pl-12 md:text-[19px]">
                {row.now}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-20 flex flex-col items-center gap-3 px-6 text-center">
          <p className="font-serif text-[26px] italic text-then-faded md:text-[30px]">
            Different worlds.
          </p>
          <p className="font-serif text-[38px] leading-none text-then-ink md:text-[54px]">
            Same age.
          </p>
        </div>

        {/* And the things they already found out they share, on the fold. */}
        {shared.length > 0 ? (
          <div className="mt-20 flex flex-col items-center gap-7 px-6">
            <p className="text-[11px] uppercase tracking-[0.24em] text-then-faded">
              What you already found
            </p>
            <ul className="flex flex-wrap items-end justify-center gap-x-12 gap-y-8">
              {shared.map(({ id, connection }, i) => (
                <li key={id}>
                  <Link
                    href={`/memory/${id}`}
                    className="group flex flex-col items-center gap-2"
                  >
                    <SharedFlower size={64 - i * 3} variant={i} />
                    <span className="font-serif text-[16px] italic text-then-ink underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-bloom-gold">
                      {connection?.theme}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <Link
          href="/today"
          className="mb-24 mt-24 flex items-center justify-center gap-4 px-6 text-center"
        >
          <Bud width={26} className="shrink-0" />
          <span className="font-serif text-[20px] italic text-then-ink underline decoration-bloom-gold/50 underline-offset-8 transition-colors hover:decoration-bloom-gold md:text-[24px]">
            Ask her something you wish someone would ask you →
          </span>
        </Link>
      </BookGround>

      <MobileNavSpacer />
    </div>
  );
}
