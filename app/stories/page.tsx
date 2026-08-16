"use client";

import Link from "next/link";
import { useMemo } from "react";
import { BookGround } from "@/components/book/BookSpread";
import { Leaf } from "@/components/garden/Botanical";
import { FlowerMark } from "@/components/garden/Flower";
import { MemoryPage } from "@/components/story/MemoryPage";
import { MobileNavSpacer, Navigation } from "@/components/nav/Navigation";
import { seedOf } from "@/lib/botany";
import { useGarden } from "@/lib/state/garden-provider";
import type { Conversation, Memory, Person } from "@/lib/types";
import { personById } from "@/lib/types";

/**
 * Everything you have told each other.
 *
 * Not a feed and not a database — the book read straight through. Her life runs
 * down the left page and yours down the right, the years advancing as you go,
 * and where two of them turned out to be the same story a stem crosses the fold
 * between them and carries the flower it opened.
 *
 * There is nothing to filter. It is a life, not a table.
 */
interface Row {
  id: string;
  index: number;
  year: number;
  then?: { memory: Memory; person: Person };
  now?: { memory: Memory; person: Person };
  grewInto?: Conversation;
}

export default function StoriesPage() {
  const { state } = useGarden();
  const pair = state.pair;

  const rows = useMemo<Row[]>(() => {
    return state.conversations
      .map((c, index) => {
        const sides = Object.values(c.memories).map((memory) => ({
          memory,
          person: personById(pair, memory.personId),
        }));
        return {
          id: c.id,
          index,
          year: Math.min(...sides.map((s) => s.memory.year), 9999),
          then: sides.find((s) => s.person.side === "then"),
          now: sides.find((s) => s.person.side === "now"),
          grewInto: c.connection ? c : undefined,
        };
      })
      .filter((r) => r.then || r.now)
      .sort((a, b) => a.year - b.year);
  }, [state.conversations, pair]);

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <Navigation />

      <BookGround>
        <header className="flex flex-col items-center gap-4 px-7 pb-2 pt-14 text-center">
          <h1 className="max-w-[22ch] font-serif text-[32px] leading-tight text-then-ink md:text-[44px]">
            Everything you&apos;ve told each other
          </h1>
          <Link
            href="/stories/discovered"
            className="group flex items-center gap-2.5 text-[14px] italic text-then-faded transition-colors hover:text-then-ink"
          >
            <svg width="26" height="22" viewBox="-13 -20 26 22" aria-hidden>
              <Leaf side="then" x={0} y={0} length={20} angle={-120} sway={false} />
            </svg>
            Stories I discovered →
          </Link>
        </header>

        <ol className="flex flex-col">
          {rows.map((row) => (
            <li
              key={row.id}
              className="relative grid grid-cols-1 gap-y-14 py-14 md:grid-cols-2 md:py-20"
            >
              <div className="px-7 md:pl-14 md:pr-[clamp(70px,9vw,140px)]">
                {row.then ? (
                  <MemoryPage person={row.then.person} memory={row.then.memory} />
                ) : (
                  <span aria-hidden />
                )}
              </div>
              <div className="px-7 md:pl-[clamp(70px,9vw,140px)] md:pr-14">
                {row.now ? (
                  <MemoryPage
                    person={row.now.person}
                    memory={row.now.memory}
                    align="right"
                  />
                ) : (
                  <span aria-hidden />
                )}
              </div>

              {row.grewInto?.connection ? (
                <Crossing
                  href={`/memory/${row.grewInto.id}`}
                  theme={row.grewInto.connection.theme}
                  seed={seedOf(row.grewInto.id)}
                  paired={Boolean(row.then && row.now)}
                />
              ) : null}
            </li>
          ))}
        </ol>

        {rows.length === 0 ? (
          <p className="py-28 text-center font-serif text-[22px] italic text-then-faded">
            This page is still waiting for its first story.
          </p>
        ) : (
          <p className="px-7 py-16 text-center font-serif text-[17px] italic text-then-faded md:text-[19px]">
            More of it every time one of you answers.
          </p>
        )}
      </BookGround>

      <MobileNavSpacer />
    </div>
  );
}

/** What the two halves grew into, standing in the gutter between them. */
function Crossing({
  href,
  theme,
  seed,
  paired,
}: {
  href: string;
  theme: string;
  seed: number;
  paired: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex flex-col items-center gap-1.5 ${
        paired
          ? "left-1/2 top-1/2 max-md:hidden md:absolute md:-translate-x-1/2 md:-translate-y-1/2"
          : "col-span-full justify-self-center pt-4"
      }`}
    >
      {paired ? (
        <svg width="210" height="46" viewBox="0 0 210 46" aria-hidden>
          <path
            d="M 6 14 C 48 34, 68 44, 105 32 S 162 12, 204 34"
            stroke="#a3936f"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity={0.7}
          />
          <Leaf side="then" x={54} y={33} length={28} angle={-148} sway={false} />
          <Leaf side="now" x={156} y={22} length={26} angle={32} sway={false} />
        </svg>
      ) : null}

      <FlowerMark size={paired ? 78 : 64} seed={seed} />

      <span
        className="pt-1 text-[12px] italic text-then-faded transition-colors group-hover:text-then-ink"
        style={{ textShadow: "0 0 14px #f2ece0, 0 0 24px #f2ece0" }}
      >
        This one grew into{" "}
        <span className="font-serif not-italic text-then-ink underline decoration-bloom-gold/60 underline-offset-4 group-hover:decoration-bloom-gold">
          {theme}
        </span>
      </span>
    </Link>
  );
}
