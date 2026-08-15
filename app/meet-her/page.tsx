"use client";

import { Bud } from "@/components/botanical/Bud";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Vine } from "@/components/botanical/Vine";
import { MobileNavSpacer, Navigation } from "@/components/nav/Navigation";
import { useGarden } from "@/lib/state/garden-provider";

/**
 * 14 — Meet Her at My Age.
 *
 * The same age, sixty years apart. Nothing here is generated: these are the
 * facts each of them gave, set side by side so the resemblance does the work.
 */

const AGE = 22;

const THEN_NOTES = [
  "First job as a secondary school clerk",
  "Moved from the countryside to Seoul alone",
  "Constantly unsure about the future",
];

const NOW_NOTES = [
  "Preparing to graduate from college",
  "Moved out of her hometown to Seattle",
  "Frequently anxious about career paths",
];

export default function MeetHerPage() {
  const router = useRouter();
  const { state, active } = useGarden();
  const pair = state.pair;

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <Navigation />

      <main className="flex flex-1 flex-col md:flex-row md:items-stretch">
        <section className="paper-grain flex flex-1 flex-col justify-center bg-then-paper p-8 md:p-16">
          <div className="flex w-full max-w-[420px] flex-col gap-6 md:gap-8">
            <p className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-wide text-then-ink">
              <span className="h-4 w-px bg-bloom-gold/35" aria-hidden />
              Then • {pair.then.city}, 1974
            </p>

            <div className="flex flex-col gap-4">
              <h1 className="font-serif text-[38px] leading-none text-then-ink md:text-[48px]">
                {pair.then.name} at {AGE}
              </h1>
              <ul className="flex flex-col gap-3">
                {THEN_NOTES.map((note) => (
                  <li key={note} className="flex gap-2.5">
                    <span className="text-[14px] text-bloom-gold" aria-hidden>
                      •
                    </span>
                    <span className="text-[15px] leading-[1.5] text-then-ink">
                      {note}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <figure className="w-fit rounded-[4px] border border-bloom-gold bg-canvas p-3 shadow-[0_12px_12px_rgba(64,56,47,0.08)]">
              <div className="relative h-[180px] w-full max-w-[320px] overflow-hidden rounded-t-[2px] border border-bloom-gold md:h-[200px] md:w-[320px]">
                <Image
                  src="/assets/photos/grandma-at-22.jpg"
                  alt={`${pair.then.name} at ${AGE}, in ${pair.then.city}`}
                  fill
                  sizes="320px"
                  className="archival-photo object-cover"
                />
              </div>
              <div className="h-3 border-t border-bloom-gold" aria-hidden />
            </figure>
          </div>
        </section>

        {/* The vine between them, and the one line worth saying out loud. */}
        <div className="relative order-2 min-h-[220px] shrink-0 border-y border-black/5 md:order-none md:min-h-0 md:w-[180px] md:border-x md:border-y-0">
          <Vine className="absolute inset-0" />
          <div className="absolute left-1/2 top-1/2 flex w-[240px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 rounded-[12px] border border-bloom-gold bg-canvas p-4 text-center shadow-[0_8px_8px_rgba(64,56,47,0.06)]">
            <p className="text-[12px] uppercase tracking-wide text-bloom-gold">
              Parallel Lives
            </p>
            <p className="font-serif text-[22px] italic text-bloom-rose">
              Different worlds.
            </p>
            <p className="font-serif text-[26px] text-then-ink md:text-[28px]">
              Same age.
            </p>
          </div>
        </div>

        <section className="flex flex-1 flex-col justify-center bg-now-canvas p-8 md:p-16">
          <div className="flex w-full max-w-[420px] flex-col gap-6 md:gap-8">
            <p className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-wide text-now-charcoal">
              <span className="h-4 w-px bg-now-slate/35" aria-hidden />
              Now • {pair.now.city}, 2026
            </p>

            <div className="flex flex-col gap-4">
              <h2 className="font-serif text-[32px] leading-none text-now-charcoal md:text-[40px]">
                {pair.now.name} at {AGE}
              </h2>
              <ul className="flex flex-col gap-3">
                {NOW_NOTES.map((note) => (
                  <li key={note} className="flex gap-2.5">
                    <span className="text-[14px] text-now-slate" aria-hidden>
                      •
                    </span>
                    <span className="text-[15px] leading-[1.5] text-now-charcoal">
                      {note}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <figure className="w-fit rounded-[12px] border border-black/[0.03] p-3 shadow-[0_8px_24px_rgba(0,0,0,0.02)]">
              <div className="relative h-[180px] w-full max-w-[320px] overflow-hidden rounded-[8px] border border-now-grey md:h-[200px] md:w-[320px]">
                <Image
                  src="/assets/photos/ann-at-22.jpg"
                  alt={`${pair.now.name} at ${AGE}, in ${pair.now.city}`}
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              </div>
            </figure>
          </div>
        </section>
      </main>

      <footer className="flex flex-col items-start gap-4 border-t border-bloom-gold bg-then-paper px-6 py-5 md:flex-row md:items-center md:justify-between md:px-12">
        <div className="flex items-center gap-4">
          <Bud width={28} className="shrink-0" />
          <p className="font-serif text-[19px] italic text-then-ink md:text-[22px]">
            What would you ask {pair.then.name} about her youth?
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/garden")}
          className="shrink-0 rounded-[24px] bg-then-ink px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-then-faded"
        >
          Ask {pair.then.name} her story →
        </button>
      </footer>

      <MobileNavSpacer />

      <p className="sr-only">
        Today&apos;s open question is: {active.question.text}
      </p>
    </div>
  );
}
