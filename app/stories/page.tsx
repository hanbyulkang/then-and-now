"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { MobileNavSpacer, Navigation } from "@/components/nav/Navigation";
import { useGarden } from "@/lib/state/garden-provider";
import type { Memory, Person } from "@/lib/types";
import { personById } from "@/lib/types";

type Filter = "all" | "then" | "now";

/**
 * 11 — Stories.
 *
 * Every memory either of them has left, laid out as an editorial timeline
 * rather than a grid of cards. Both generations live in one archive; the year
 * is the loudest thing on the page because the archive is about time.
 */
export default function StoriesPage() {
  const { state } = useGarden();
  const [filter, setFilter] = useState<Filter>("all");
  const pair = state.pair;

  const entries = useMemo(() => {
    const all = state.conversations.flatMap((c) => Object.values(c.memories));
    return all
      .filter((m) => {
        if (filter === "all") return true;
        const side = m.personId === pair.then.id ? "then" : "now";
        return side === filter;
      })
      .sort((a, b) => a.year - b.year);
  }, [state.conversations, filter, pair.then.id]);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "then", label: `${pair.then.name} (Then)` },
    { id: "now", label: `${pair.now.name} (Now)` },
  ];

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <Navigation />

      <div className="flex flex-wrap gap-3 px-6 py-6 md:px-20">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className={`rounded-[20px] px-5 py-2 text-[13px] font-semibold transition-colors duration-200 ${
              filter === f.id
                ? "bg-then-ink text-white"
                : "border border-bloom-gold bg-white text-then-ink hover:bg-then-paper"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <main className="flex flex-col gap-12 px-6 pb-24 pt-4 md:gap-16 md:px-20 lg:px-30">
        {entries.map((memory, i) => (
          <EditorialStoryEntry
            key={memory.id}
            memory={memory}
            person={personById(pair, memory.personId)}
            last={i === entries.length - 1}
          />
        ))}

        {entries.length === 0 ? (
          <p className="py-20 text-center font-memory text-[19px] italic text-then-faded">
            Nothing has been told here yet.
          </p>
        ) : null}
      </main>

      <MobileNavSpacer />
    </div>
  );
}

function EditorialStoryEntry({
  memory,
  person,
  last,
}: {
  memory: Memory;
  person: Person;
  last: boolean;
}) {
  const isThen = person.side === "then";

  return (
    <article className="flex flex-col gap-8">
      <div className="flex flex-col gap-6 md:flex-row md:gap-12">
        {/* Mobile puts the year and the byline on one line; desktop stands the
            year up as a column of its own (nodes 11 and M6). */}
        <header className="flex w-full shrink-0 items-end justify-between gap-4 md:w-[160px] md:flex-col md:items-start md:justify-start md:gap-1">
          <p
            className={`font-serif text-[40px] leading-none md:text-[64px] ${
              isThen ? "text-bloom-rose" : "text-bloom-green"
            }`}
          >
            {memory.year}
          </p>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-now-slate md:text-[12px]">
            {person.name} • {memory.place}
          </p>
        </header>

        <div className="flex flex-1 items-start gap-4 md:items-center md:gap-8">
          {memory.photoUrl ? (
            <div
              className={`relative h-[88px] w-[70px] shrink-0 overflow-hidden rounded-[4px] border md:h-[220px] md:w-[180px] ${
                isThen ? "border-bloom-gold" : "border-black/5"
              }`}
            >
              <Image
                src={memory.photoUrl}
                alt={`${person.name} in ${memory.place}, ${memory.year}`}
                fill
                sizes="(max-width: 768px) 70px, 180px"
                className={`object-cover ${isThen ? "archival-photo" : ""}`}
              />
            </div>
          ) : null}

          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <p
              className={
                isThen
                  ? "font-memory text-[18px] italic leading-[1.6] text-then-ink md:text-[20px]"
                  : "text-[18px] leading-[1.6] text-now-charcoal md:text-[20px]"
              }
            >
              &ldquo;{memory.transcript}&rdquo;
            </p>
            <AudioPlayer
              memory={memory}
              side={person.side}
              compact
              label={`Play ${person.name}'s original recording from ${memory.year}`}
            />
          </div>
        </div>
      </div>

      {last ? null : <hr className="border-t border-black/[0.07]" />}
    </article>
  );
}
