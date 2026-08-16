"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { BookSpread } from "@/components/book/BookSpread";
import { FlowerMark } from "@/components/garden/Flower";
import { MobileNavSpacer, Navigation } from "@/components/nav/Navigation";
import { seedOf } from "@/lib/botany";
import { useGarden } from "@/lib/state/garden-provider";
import { flowersOf } from "@/lib/types";

/**
 * Meet her at my age.
 *
 * A page turned deeper into the book, where you stop meeting your grandmother
 * as your grandmother and meet the person she was at the age you are now.
 *
 * The two pages are held to the same rhythm on purpose — the same facts in the
 * same order — so the resemblance arrives on its own without anything having to
 * point at it. Between them stand the things they have already found they
 * share.
 */
const AGE = 22;

const HERS = ["Seoul", "First job", "Living away from family", "Unsure about the future"];
const YOURS = ["Seattle", "College", "Living away from family", "Unsure about the future"];

export default function MeetHerPage() {
  const { state } = useGarden();
  const pair = state.pair;
  const shared = useMemo(() => flowersOf(state).slice(0, 3), [state]);

  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden bg-canvas">
      <Navigation />

      <BookSpread
        className="animate-page-turn min-h-[640px]"
        left={
          <div className="relative z-20 flex flex-1 flex-col items-center gap-7 p-8 pt-14 md:pl-14 md:pr-[clamp(90px,13vw,190px)]">
            <header className="flex flex-col items-center gap-1 text-center">
              <h1 className="font-serif text-[26px] uppercase tracking-[0.1em] text-then-ink md:text-[32px]">
                {pair.then.name} at {AGE}
              </h1>
              <p className="text-[11px] uppercase tracking-[0.26em] text-then-faded">
                1974 · Seoul
              </p>
            </header>

            <figure
              className="w-fit border border-bloom-gold/60 bg-canvas p-3 shadow-[0_18px_30px_rgba(64,56,47,0.1)]"
              style={{ transform: "rotate(-1.6deg)" }}
            >
              <div className="relative h-[268px] w-[212px] overflow-hidden md:h-[320px] md:w-[254px]">
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

            <ul className="flex flex-col items-center gap-2 text-center">
              {HERS.map((fact) => (
                <li
                  key={fact}
                  className="font-serif text-[17px] italic text-then-ink md:text-[19px]"
                >
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        }
        right={
          <div className="relative z-20 flex flex-1 flex-col items-center gap-7 p-8 pt-14 md:pl-[clamp(90px,13vw,190px)] md:pr-14">
            <header className="flex flex-col items-center gap-1 text-center">
              <h2 className="text-[24px] font-medium uppercase tracking-[0.08em] text-now-charcoal md:text-[30px]">
                {pair.now.name} at {AGE}
              </h2>
              <p className="text-[11px] uppercase tracking-[0.26em] text-now-slate">
                2026 · Seattle
              </p>
            </header>

            <figure
              className="w-fit rounded-[10px] p-2.5 shadow-[0_14px_36px_rgba(0,0,0,0.05)]"
              style={{ transform: "rotate(1.2deg)" }}
            >
              <div className="relative h-[268px] w-[212px] overflow-hidden rounded-[6px] md:h-[320px] md:w-[254px]">
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

            <ul className="flex flex-col items-center gap-2 text-center">
              {YOURS.map((fact) => (
                <li
                  key={fact}
                  className="text-[16px] text-now-charcoal md:text-[18px]"
                >
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        }
        atTheCentre={
          <div className="flex flex-col items-center gap-5 px-4 text-center">
            {/* What they have already found they share, standing between them. */}
            {shared.length ? (
              <div className="flex items-end gap-3">
                {shared.map(({ id }, i) => (
                  <Link key={id} href={`/memory/${id}`} aria-label="Open">
                    <FlowerMark size={78 - i * 12} seed={seedOf(id)} />
                  </Link>
                ))}
              </div>
            ) : null}

            <p
              className="font-serif text-[22px] italic text-then-faded md:text-[26px]"
              style={{ textShadow: "0 0 20px #f2ece0, 0 0 36px #f2ece0" }}
            >
              Different worlds.
            </p>
            <p
              className="font-serif text-[32px] leading-none text-then-ink md:text-[44px]"
              style={{ textShadow: "0 0 22px #f2ece0, 0 0 40px #f2ece0" }}
            >
              Same age.
            </p>
          </div>
        }
        atTheFold={
          <div className="px-6 pb-8 text-center md:pb-11">
            <Link
              href="/today"
              className="font-serif text-[18px] italic leading-snug text-then-ink underline decoration-bloom-gold/50 underline-offset-8 transition-colors hover:decoration-bloom-gold md:text-[21px]"
              style={{ textShadow: "0 0 18px #f2ece0, 0 0 32px #f2ece0" }}
            >
              Ask her something you wish someone would ask you →
            </Link>
          </div>
        }
      />

      <MobileNavSpacer />
    </div>
  );
}
