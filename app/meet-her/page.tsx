"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Bud } from "@/components/botanical/Bud";
import { SharedFlower } from "@/components/garden/SharedFlower";
import { MobileNavSpacer, Navigation } from "@/components/nav/Navigation";
import { useGarden } from "@/lib/state/garden-provider";
import { flowersOf } from "@/lib/types";

/**
 * Meet Her at My Age.
 *
 * A page turned deeper into the book, where you stop meeting your grandmother
 * as your grandmother and meet the person she was at the age you are now.
 *
 * The two columns are held to the same rhythm on purpose: the same four facts
 * in the same order, so the resemblance arrives on its own without anything
 * having to point at it.
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
    <div className="flex min-h-dvh flex-col bg-canvas">
      <Navigation />

      <main className="flex flex-1 flex-col items-center px-6 pb-24 pt-14 md:px-12">
        <p
          className="text-[12px] uppercase tracking-[0.22em] text-then-faded"
          style={{ animation: "rise-in 1200ms var(--ease-settle) 100ms both" }}
        >
          A page further in
        </p>

        {/* Both of them at the same age, held to the same rhythm. */}
        <div
          className="mt-12 grid w-full max-w-[1120px] grid-cols-1 gap-14 md:grid-cols-[1fr_auto_1fr] md:gap-10"
          style={{ animation: "rise-in 1400ms var(--ease-settle) 500ms both" }}
        >
          <section className="flex flex-col items-center gap-6 text-center md:items-end md:text-right">
            <figure className="rounded-[3px] border border-bloom-gold/70 bg-canvas p-3 shadow-[0_18px_30px_rgba(64,56,47,0.1)]">
              <div className="relative h-[280px] w-[220px] overflow-hidden md:h-[320px] md:w-[254px]">
                <Image
                  src="/assets/photos/grandma-at-22.jpg"
                  alt={`${pair.then.name} at ${AGE}`}
                  fill
                  sizes="254px"
                  className="archival-photo object-cover"
                  priority
                />
              </div>
            </figure>
            <h1 className="font-serif text-[32px] leading-none text-then-ink md:text-[42px]">
              {pair.then.name} at {AGE}
            </h1>
          </section>

          <div className="hidden w-px bg-bloom-gold/30 md:block" aria-hidden />

          <section className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
            <figure className="rounded-[10px] border border-black/[0.04] p-2.5 shadow-[0_14px_36px_rgba(0,0,0,0.04)]">
              <div className="relative h-[280px] w-[220px] overflow-hidden rounded-[6px] md:h-[320px] md:w-[254px]">
                <Image
                  src="/assets/photos/ann-at-22.jpg"
                  alt={`${pair.now.name} at ${AGE}`}
                  fill
                  sizes="254px"
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

        {/* The same four facts, side by side, nothing pointing at anything. */}
        <dl
          className="mt-16 grid w-full max-w-[1120px] grid-cols-1 gap-y-5 md:grid-cols-[1fr_auto_1fr] md:gap-x-10"
          style={{ animation: "rise-in 1400ms var(--ease-settle) 900ms both" }}
        >
          {PAIRED.map((row, i) => (
            <div key={i} className="contents">
              <dt className="font-serif text-[19px] italic text-then-ink md:text-right md:text-[21px]">
                {row.then}
              </dt>
              <span
                className="hidden self-center text-[13px] text-bloom-gold md:block"
                aria-hidden
              >
                ↔
              </span>
              <dd className="border-b border-black/5 pb-5 text-[17px] text-now-charcoal md:border-none md:pb-0 md:text-[19px]">
                {row.now}
              </dd>
            </div>
          ))}
        </dl>

        <div
          className="mt-20 flex flex-col items-center gap-3 text-center"
          style={{ animation: "rise-in 1600ms var(--ease-settle) 1400ms both" }}
        >
          <p className="font-serif text-[26px] italic text-then-faded md:text-[30px]">
            Different worlds.
          </p>
          <p className="font-serif text-[38px] leading-none text-then-ink md:text-[52px]">
            Same age.
          </p>
        </div>

        {/* And the things they already found out they share. */}
        {shared.length > 0 ? (
          <div
            className="mt-20 flex flex-col items-center gap-7"
            style={{
              animation: "rise-in 1600ms var(--ease-settle) 1900ms both",
            }}
          >
            <p className="text-[12px] uppercase tracking-[0.18em] text-then-faded">
              What you already found
            </p>
            <ul className="flex flex-wrap items-end justify-center gap-x-12 gap-y-8">
              {shared.map(({ id, connection }, i) => (
                <li key={id}>
                  <Link
                    href={`/memory/${id}`}
                    className="group flex flex-col items-center gap-2"
                  >
                    <SharedFlower size={62 - i * 3} variant={i} />
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
          href="/garden"
          className="mt-24 flex items-center gap-4 text-center"
          style={{ animation: "rise-in 1600ms var(--ease-settle) 2300ms both" }}
        >
          <Bud width={26} className="shrink-0" />
          <span className="font-serif text-[20px] italic text-then-ink underline decoration-bloom-gold/50 underline-offset-8 transition-colors hover:decoration-bloom-gold md:text-[24px]">
            Ask her something you wish someone would ask you →
          </span>
        </Link>
      </main>

      <MobileNavSpacer />
    </div>
  );
}
