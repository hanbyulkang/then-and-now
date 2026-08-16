"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { BookGround, PageYear } from "@/components/book/BookSpread";
import { NowLeaf, ThenLeaf } from "@/components/garden/Leaf";
import { MobileNavSpacer, Navigation } from "@/components/nav/Navigation";
import { useGarden } from "@/lib/state/garden-provider";
import type { Conversation, Memory, Person } from "@/lib/types";
import { personById } from "@/lib/types";

type Filter = "all" | "then" | "now";

interface Spread {
  id: string;
  /** The earlier of the two years — what puts this spread in order. */
  year: number;
  then?: { memory: Memory; person: Person };
  now?: { memory: Memory; person: Person };
  grewInto?: Conversation;
}

/**
 * Everything you have told each other.
 *
 * The book kept open and read straight through. Her stories run down the left
 * page and yours down the right, and the years advance as you go — set at the
 * head of each entry the way an old book marks them, not plotted on an axis.
 *
 * Where two of them turned out to be the same story, a stem crosses the fold
 * between them.
 */
export default function StoriesPage() {
  const { state } = useGarden();
  const [filter, setFilter] = useState<Filter>("all");
  const pair = state.pair;

  const spreads = useMemo<Spread[]>(() => {
    const rows = state.conversations.map((c) => {
      const sides = Object.values(c.memories).map((memory) => ({
        memory,
        person: personById(pair, memory.personId),
      }));
      const then = sides.find((s) => s.person.side === "then");
      const now = sides.find((s) => s.person.side === "now");
      return {
        id: c.id,
        year: Math.min(...sides.map((s) => s.memory.year)),
        then: filter === "now" ? undefined : then,
        now: filter === "then" ? undefined : now,
        grewInto: c.connection ? c : undefined,
      };
    });
    return rows
      .filter((r) => r.then || r.now)
      .sort((a, b) => a.year - b.year);
  }, [state.conversations, filter, pair]);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "Everything" },
    { id: "then", label: pair.then.name },
    { id: "now", label: pair.now.name },
  ];

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <Navigation />

      <BookGround>
        <header className="flex flex-col items-start gap-5 px-7 pb-4 pt-12 md:px-14">
          <h1 className="max-w-[20ch] font-serif text-[32px] leading-tight text-then-ink md:text-[44px]">
            Everything you&apos;ve told each other
          </h1>
          <div className="flex flex-wrap gap-6">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={filter === f.id}
                className={`text-[14px] underline-offset-8 transition-colors duration-200 ${
                  filter === f.id
                    ? "font-semibold text-then-ink underline decoration-bloom-gold decoration-2"
                    : "text-now-slate hover:text-then-faded"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </header>

        <ol className="flex flex-col">
          {spreads.map((spread) => (
            <li
              key={spread.id}
              className="relative grid grid-cols-1 gap-y-14 py-14 md:grid-cols-2 md:py-20"
            >
              <div className="px-7 md:pl-14 md:pr-[clamp(70px,9vw,130px)]">
                {spread.then ? (
                  <Entry {...spread.then} />
                ) : (
                  <span aria-hidden />
                )}
              </div>

              <div className="px-7 md:pl-[clamp(70px,9vw,130px)] md:pr-14">
                {spread.now ? (
                  <Entry {...spread.now} align="right" />
                ) : (
                  <span aria-hidden />
                )}
              </div>

              {/* The two of them turned out to be the same story. */}
              {spread.grewInto?.connection && spread.then && spread.now ? (
                <CrossingStem
                  href={`/memory/${spread.grewInto.id}`}
                  theme={spread.grewInto.connection.theme}
                />
              ) : null}
            </li>
          ))}
        </ol>

        {spreads.length === 0 ? (
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

function Entry({
  memory,
  person,
  align = "left",
}: {
  memory: Memory;
  person: Person;
  align?: "left" | "right";
}) {
  const isThen = person.side === "then";

  return (
    <article
      className={`flex flex-col gap-6 ${align === "right" ? "items-end text-right" : ""}`}
    >
      <PageYear
        side={person.side}
        year={memory.year}
        place={`${memory.place} · ${person.name} · Age ${memory.age}`}
      />

      {memory.photoUrl ? (
        <figure
          className={`relative w-fit ${
            isThen
              ? "border border-bloom-gold/60 bg-canvas p-2.5 shadow-[0_16px_28px_rgba(64,56,47,0.09)]"
              : "rounded-[10px] p-2 shadow-[0_14px_34px_rgba(0,0,0,0.04)]"
          }`}
          style={{ transform: `rotate(${isThen ? -1.3 : 0.8}deg)` }}
        >
          <div
            className="relative w-[min(64vw,300px)] overflow-hidden"
            style={{ aspectRatio: "4 / 5", borderRadius: isThen ? 2 : 6 }}
          >
            <Image
              src={memory.photoUrl}
              alt={`${person.name} in ${memory.place}, ${memory.year}`}
              fill
              sizes="300px"
              className={`object-cover ${isThen ? "archival-photo" : ""}`}
            />
          </div>
        </figure>
      ) : null}

      <blockquote
        className={
          isThen
            ? "max-w-[40ch] font-memory text-[19px] italic leading-[1.7] text-then-ink md:text-[21px]"
            : "max-w-[40ch] text-[18px] leading-[1.75] text-now-charcoal md:text-[20px]"
        }
      >
        &ldquo;{memory.transcript}&rdquo;
      </blockquote>

      <AudioPlayer
        memory={memory}
        side={person.side}
        compact
        label={`Hear ${person.name} tell it`}
      />
    </article>
  );
}

/** A thin stem drawn across the fold, joining the two halves of one story. */
function CrossingStem({ href, theme }: { href: string; theme: string }) {
  return (
    <Link
      href={href}
      className="group absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 md:flex"
    >
      <svg width="184" height="54" viewBox="0 0 184 54" aria-hidden>
        <path
          d="M 6 12 C 46 30, 60 44, 92 30 S 138 12, 178 34"
          stroke="#43392f"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
          opacity={0.6}
        />
        <ThenLeaf x={58} y={31} length={26} angle={-142} />
        <NowLeaf x={126} y={20} length={24} angle={38} />
      </svg>
      <span
        className="text-[12px] italic text-then-faded transition-colors group-hover:text-then-ink"
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
