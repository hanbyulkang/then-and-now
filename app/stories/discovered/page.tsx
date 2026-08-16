"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { BookGround } from "@/components/book/BookSpread";
import { BudMark, Leaf } from "@/components/garden/Botanical";
import { MobileNavSpacer, Navigation } from "@/components/nav/Navigation";
import { useGarden } from "@/lib/state/garden-provider";
import { discoveredBy, otherPerson, personById } from "@/lib/types";

type Shelf = "never" | "remembered";

/**
 * The stories you discovered.
 *
 * Two shelves, and they are not a filter. One holds the pieces of her life you
 * met for the first time; the other holds the ones that were already part of
 * you. Neither is better. They are only different kinds of knowing, kept apart
 * because they feel different to come back to.
 *
 * Laid out like photographs and notes found loose in an old book, not as a grid
 * of cards.
 */
export default function DiscoveredPage() {
  const { state } = useGarden();
  const [shelf, setShelf] = useState<Shelf>("never");

  const viewer = personById(state.pair, state.viewerId);
  const teller = otherPerson(state.pair, state.viewerId);
  const stories = useMemo(
    () => discoveredBy(state, state.viewerId, shelf),
    [state, shelf],
  );

  const isNew = shelf === "never";

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <Navigation />

      <BookGround>
        <header className="flex flex-col items-center gap-6 px-7 pb-4 pt-14 text-center">
          <div className="flex items-center gap-10">
            {(
              [
                ["never", "I never knew"],
                ["remembered", "I remember"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setShelf(id)}
                aria-pressed={shelf === id}
                className={`text-[14px] underline-offset-8 transition-colors duration-200 ${
                  shelf === id
                    ? "font-semibold text-then-ink underline decoration-bloom-gold decoration-2"
                    : "text-then-faded hover:text-then-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <h1 className="max-w-[20ch] font-serif text-[32px] leading-tight text-then-ink md:text-[42px]">
            {isNew ? "Stories I never knew." : "Stories I remember."}
          </h1>
          <p className="max-w-[30ch] font-serif text-[16px] italic leading-snug text-then-faded md:text-[18px]">
            {isNew
              ? `The pieces of ${teller.name}'s life I met for the first time.`
              : "The memories that were already part of us."}
          </p>
        </header>

        <ol className="flex flex-col gap-20 px-7 py-14 md:gap-28 md:px-16 md:py-20">
          {stories.map((memory, i) => (
            <li
              key={memory.id}
              className={`flex flex-col gap-7 md:flex-row md:items-end md:gap-14 ${
                i % 2 ? "md:flex-row-reverse md:text-right" : ""
              }`}
            >
              {memory.photoUrl ? (
                <figure
                  className="relative w-fit shrink-0 border border-bloom-gold/60 bg-canvas p-2.5 shadow-[0_16px_30px_rgba(64,56,47,0.1)]"
                  style={{ transform: `rotate(${i % 2 ? 1.6 : -1.6}deg)` }}
                >
                  <div className="relative w-[min(70vw,300px)] overflow-hidden md:w-[300px]"
                    style={{ aspectRatio: i % 3 === 1 ? "4 / 3" : "4 / 5" }}
                  >
                    <Image
                      src={memory.photoUrl}
                      alt={`${teller.name} in ${memory.place}, ${memory.year}`}
                      fill
                      sizes="300px"
                      className="archival-photo object-cover"
                    />
                  </div>

                  {/* Kept the way each shelf keeps things. */}
                  <span
                    className={`pointer-events-none absolute ${
                      i % 2 ? "-bottom-6 -left-7" : "-right-7 -top-7"
                    }`}
                  >
                    <svg width="52" height="52" viewBox="-26 -50 52 52" aria-hidden>
                      {isNew ? (
                        <BudMark x={0} y={0} length={44} />
                      ) : (
                        <Leaf
                          side="then"
                          x={0}
                          y={0}
                          length={44}
                          angle={-124}
                          sway={false}
                        />
                      )}
                    </svg>
                  </span>
                </figure>
              ) : null}

              <div
                className={`flex min-w-0 flex-1 flex-col gap-4 ${i % 2 ? "md:items-end" : ""}`}
              >
                <span className="font-serif text-[46px] leading-none text-bloom-rose md:text-[64px]">
                  {memory.year}
                </span>
                <blockquote className="max-w-[40ch] font-memory text-[19px] italic leading-[1.7] text-then-ink md:text-[22px]">
                  &ldquo;{memory.transcript}&rdquo;
                </blockquote>
                <AudioPlayer
                  memory={memory}
                  side="then"
                  compact
                  label={`Hear ${teller.name} tell it`}
                />
              </div>
            </li>
          ))}
        </ol>

        {stories.length === 0 ? (
          <p className="px-7 py-24 text-center font-serif text-[20px] italic text-then-faded">
            {isNew
              ? "Nothing here yet. It fills up the first time you hear something you never knew."
              : "Nothing here yet."}
          </p>
        ) : isNew ? (
          <div className="flex flex-col items-center gap-3 px-7 pb-24 text-center">
            <p className="font-serif text-[19px] italic text-then-faded md:text-[22px]">
              You never knew this part of {teller.name}.
              <br />
              Is there something you&apos;d like to ask?
            </p>
            <Link
              href="/today"
              className="text-[15px] font-semibold text-bloom-green underline-offset-8 transition-colors hover:text-then-ink hover:underline"
            >
              Ask {teller.name} →
            </Link>
            <p className="sr-only">Signed in as {viewer.name}</p>
          </div>
        ) : (
          <div className="pb-24" />
        )}
      </BookGround>

      <MobileNavSpacer />
    </div>
  );
}
