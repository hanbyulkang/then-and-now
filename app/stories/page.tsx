"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { NowLeaf, ThenLeaf } from "@/components/garden/Leaf";
import { MobileNavSpacer, Navigation } from "@/components/nav/Navigation";
import { useGarden } from "@/lib/state/garden-provider";
import type { Conversation, Memory, Person } from "@/lib/types";
import { personById } from "@/lib/types";

type Filter = "all" | "then" | "now";

interface Entry {
  memory: Memory;
  person: Person;
  /** Set when this memory grew into something the two of them share. */
  grewInto?: Conversation;
}

/**
 * Stories.
 *
 * Not a feed — a book of things kept. A photograph, a year written large, a
 * voice, and the words as they were said. Grandma's pages are set in the older
 * hand and Ann's in the newer one, and the book turns from one side to the
 * other as you go down it.
 *
 * Where a memory grew into something they share, a sprig comes off the edge of
 * the page and says so.
 */
export default function StoriesPage() {
  const { state } = useGarden();
  const [filter, setFilter] = useState<Filter>("all");
  const pair = state.pair;

  const entries = useMemo<Entry[]>(() => {
    const all = state.conversations.flatMap((c) =>
      Object.values(c.memories).map((memory) => ({
        memory,
        person: personById(pair, memory.personId),
        grewInto: c.connection ? c : undefined,
      })),
    );
    return all
      .filter((e) => filter === "all" || e.person.side === filter)
      .sort((a, b) => a.memory.year - b.memory.year);
  }, [state.conversations, filter, pair]);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "Everything" },
    { id: "then", label: pair.then.name },
    { id: "now", label: pair.now.name },
  ];

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <Navigation />

      <header className="flex flex-col items-start gap-5 px-6 pb-2 pt-10 md:px-16 lg:px-24">
        <h1 className="font-serif text-[32px] leading-tight text-then-ink md:text-[44px]">
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

      <main className="flex flex-col gap-24 px-6 pb-28 pt-12 md:gap-36 md:px-16 lg:px-24">
        {entries.map((entry, i) => (
          <StoryPage key={entry.memory.id} entry={entry} index={i} />
        ))}

        {entries.length === 0 ? (
          <p className="py-24 text-center font-serif text-[22px] italic text-then-faded">
            This page is still waiting for its first story.
          </p>
        ) : null}
      </main>

      <MobileNavSpacer />
    </div>
  );
}

function StoryPage({ entry, index }: { entry: Entry; index: number }) {
  const { memory, person, grewInto } = entry;
  const isThen = person.side === "then";

  return (
    <article
      className={`relative flex flex-col gap-6 md:flex-row md:items-end md:gap-14 ${
        /* The book turns from one side to the other as you go down it. */
        isThen ? "" : "md:flex-row-reverse"
      }`}
    >
      {memory.photoUrl ? (
        <figure
          className={`relative shrink-0 ${
            isThen
              ? "rounded-[3px] border border-bloom-gold/70 bg-canvas p-3 shadow-[0_18px_30px_rgba(64,56,47,0.09)]"
              : "rounded-[10px] border border-black/[0.04] p-2.5 shadow-[0_14px_36px_rgba(0,0,0,0.04)]"
          }`}
          style={{ transform: `rotate(${isThen ? -1.4 : 0.8}deg)` }}
        >
          <div
            className="relative w-[min(100%,380px)] overflow-hidden md:w-[380px]"
            style={{
              aspectRatio: index % 3 === 1 ? "4 / 3" : "4 / 5",
              borderRadius: isThen ? 2 : 6,
            }}
          >
            <Image
              src={memory.photoUrl}
              alt={`${person.name} in ${memory.place}, ${memory.year}`}
              fill
              sizes="380px"
              className={`object-cover ${isThen ? "archival-photo" : ""}`}
            />
          </div>
        </figure>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span
            className={`font-serif leading-none ${
              isThen
                ? "text-[60px] text-bloom-rose md:text-[88px]"
                : "text-[54px] text-bloom-green md:text-[78px]"
            }`}
          >
            {memory.year}
          </span>
          <span className="text-[13px] uppercase tracking-[0.14em] text-now-slate">
            {person.name} · {memory.place}
          </span>
        </div>

        <blockquote
          className={
            isThen
              ? "max-w-[46ch] font-memory text-[20px] italic leading-[1.65] text-then-ink md:text-[23px]"
              : "max-w-[46ch] text-[19px] leading-[1.7] text-now-charcoal md:text-[21px]"
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

        {/* Pressed beside the page: this one grew into something shared. */}
        {grewInto?.connection ? (
          <Link
            href={`/memory/${grewInto.id}`}
            className="group mt-1 flex items-center gap-2.5 text-[13px] italic text-then-faded transition-colors hover:text-then-ink"
          >
            <svg width="34" height="22" viewBox="0 0 34 22" aria-hidden>
              {isThen ? (
                <ThenLeaf x={25} y={18} length={22} angle={-146} />
              ) : (
                <NowLeaf x={9} y={18} length={20} angle={-44} />
              )}
            </svg>
            This one grew into{" "}
            <span className="font-serif not-italic text-then-ink underline decoration-bloom-gold/60 underline-offset-4 group-hover:decoration-bloom-gold">
              {grewInto.connection.theme}
            </span>
          </Link>
        ) : null}
      </div>
    </article>
  );
}
