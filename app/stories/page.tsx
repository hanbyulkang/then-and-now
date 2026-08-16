"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { FlowerMark } from "@/components/garden/Flower";
import { MobileNavSpacer, Navigation } from "@/components/nav/Navigation";
import { seedOf } from "@/lib/botany";
import { useGarden } from "@/lib/state/garden-provider";
import type { Memory, Person } from "@/lib/types";
import { personById } from "@/lib/types";

type Whose = "all" | "then" | "now";

interface Entry {
  memory: Memory;
  person: Person;
  /** Set where this one turned out to be half of something shared. */
  sharedWith?: { id: string; theme: string };
}

/**
 * The archive.
 *
 * A list of everything either of them has said, in the order it happened: the
 * year, the photograph it came with, what it was about, and their voice. Their
 * two hands stay apart in it — hers set in the old serif, yours in the newer
 * one — and where two entries turned out to be the same story the flower it
 * opened sits at the end of the row.
 */
export default function StoriesPage() {
  const { state } = useGarden();
  const [whose, setWhose] = useState<Whose>("all");
  const pair = state.pair;

  const entries = useMemo<Entry[]>(() => {
    return state.conversations
      .flatMap((c) =>
        Object.values(c.memories).map((memory) => ({
          memory,
          person: personById(pair, memory.personId),
          sharedWith: c.connection
            ? { id: c.id, theme: c.connection.theme }
            : undefined,
        })),
      )
      .filter((e) => whose === "all" || e.person.side === whose)
      .sort((a, b) => a.memory.year - b.memory.year);
  }, [state.conversations, pair, whose]);

  const tabs: { id: Whose; label: string }[] = [
    { id: "all", label: "All" },
    { id: "then", label: pair.then.name },
    { id: "now", label: pair.now.name },
  ];

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <Navigation />

      <main className="mx-auto flex w-full max-w-[900px] flex-1 flex-col px-6 pb-24 pt-10">
        <div className="flex items-center justify-center gap-9 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setWhose(tab.id)}
              aria-pressed={whose === tab.id}
              className={`pb-1.5 text-[14px] transition-colors duration-200 ${
                whose === tab.id
                  ? "border-b-2 border-bloom-gold font-semibold text-then-ink"
                  : "border-b-2 border-transparent text-then-faded hover:text-then-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Link
          href="/stories/discovered"
          className="self-center pb-6 pt-3 text-[13px] italic text-then-faded transition-colors hover:text-then-ink"
        >
          Stories I discovered →
        </Link>

        <ol className="flex flex-col">
          {entries.map((entry) => (
            <Row key={entry.memory.id} entry={entry} />
          ))}
        </ol>

        {entries.length === 0 ? (
          <p className="py-24 text-center font-serif text-[20px] italic text-then-faded">
            This page is still waiting for its first story.
          </p>
        ) : null}
      </main>

      <MobileNavSpacer />
    </div>
  );
}

function Row({ entry }: { entry: Entry }) {
  const { memory, person, sharedWith } = entry;
  const isThen = person.side === "then";

  return (
    <li className="flex items-center gap-5 border-b border-then-faded/15 py-5 last:border-b-0 md:gap-7">
      <span
        className={`w-[86px] shrink-0 text-right ${
          isThen
            ? "font-serif text-[19px] text-then-ink"
            : "text-[18px] font-light text-bloom-green"
        }`}
      >
        {memory.year} <span className="text-then-faded/50">→</span>
      </span>

      {memory.photoUrl ? (
        <figure
          className={`relative size-[62px] shrink-0 overflow-hidden md:size-[70px] ${
            isThen ? "border border-bloom-gold/45" : "rounded-[6px]"
          }`}
        >
          <Image
            src={memory.photoUrl}
            alt={`${person.name} in ${memory.place}, ${memory.year}`}
            fill
            sizes="70px"
            className={`object-cover ${isThen ? "archival-photo" : ""}`}
          />
        </figure>
      ) : (
        <span className="size-[62px] shrink-0 md:size-[70px]" aria-hidden />
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span
          className={`truncate text-[15px] ${
            isThen ? "font-serif text-then-ink" : "font-medium text-now-charcoal"
          }`}
        >
          {memory.context}
        </span>
        <span className="text-[12px] text-then-faded">
          {memory.place} · {person.name}
        </span>
      </div>

      <blockquote
        className={`hidden min-w-0 flex-[1.4] truncate text-[14px] md:block ${
          isThen
            ? "font-memory italic text-then-ink"
            : "text-now-charcoal"
        }`}
      >
        &ldquo;{memory.transcript}&rdquo;
      </blockquote>

      {sharedWith ? (
        <Link
          href={`/memory/${sharedWith.id}`}
          title={`This one grew into ${sharedWith.theme}`}
          className="shrink-0 transition-transform duration-300 hover:scale-110"
        >
          <FlowerMark size={42} seed={seedOf(sharedWith.id)} />
        </Link>
      ) : (
        <span className="w-[42px] shrink-0" aria-hidden />
      )}

      <span className="shrink-0">
        <AudioPlayer memory={memory} side={person.side} compact />
      </span>
    </li>
  );
}
