"use client";

import Image from "next/image";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { HighlightedTranscript } from "@/components/reveal/HighlightedTranscript";
import type { Memory, Person } from "@/lib/types";

/**
 * One person's story, on their own page.
 *
 * The year first, set the way an old book sets one, then where and how old they
 * were, then the photograph, then their voice, then their words. Everything the
 * product itself has to say comes later and smaller.
 *
 * Her photographs are prints — cornered into an album, gone warm. Hers are on a
 * screen. Neither is a rounded avatar and neither is a card.
 */
export function MemoryPage({
  person,
  memory,
  align = "left",
  highlight,
  highlightActive = false,
  gloss,
  photo = "large",
}: {
  person: Person;
  memory: Memory;
  align?: "left" | "right";
  highlight?: string;
  highlightActive?: boolean;
  gloss?: string;
  photo?: "large" | "small" | "none";
}) {
  const isThen = person.side === "then";
  const right = align === "right";
  const w = photo === "large" ? "min(58vw,268px)" : "min(42vw,176px)";

  return (
    <article
      className={`flex flex-col gap-6 ${right ? "items-end text-right" : "items-start"}`}
    >
      <header className={`flex flex-col gap-1 ${right ? "items-end" : ""}`}>
        <span
          className={
            isThen
              ? "font-serif text-[46px] leading-none text-bloom-rose md:text-[62px]"
              : "text-[42px] font-light leading-none tracking-tight text-bloom-green md:text-[56px]"
          }
        >
          {memory.year}
        </span>
        <span
          className={`text-[11px] uppercase tracking-[0.24em] ${
            isThen ? "text-then-faded" : "text-now-slate"
          }`}
        >
          {memory.place} · {person.name} · Age {memory.age}
        </span>
      </header>

      {photo !== "none" && (memory.photoUrl || person.portrait) ? (
        <figure
          className={`relative w-fit shrink-0 ${
            isThen
              ? "border border-bloom-gold/60 bg-canvas p-2.5 shadow-[0_16px_28px_rgba(64,56,47,0.1)]"
              : "rounded-[10px] p-2 shadow-[0_14px_34px_rgba(0,0,0,0.05)]"
          }`}
          style={{ transform: `rotate(${isThen ? -1.3 : 0.8}deg)` }}
        >
          <div
            className="relative overflow-hidden"
            style={{
              width: w,
              aspectRatio: "4 / 5",
              borderRadius: isThen ? 2 : 6,
            }}
          >
            <Image
              src={memory.photoUrl ?? person.portrait}
              alt={`${person.name} in ${memory.place}, ${memory.year}`}
              fill
              sizes="268px"
              className={`object-cover ${isThen ? "archival-photo" : ""}`}
            />
          </div>
        </figure>
      ) : null}

      <HighlightedTranscript
        text={memory.transcript}
        highlight={highlight}
        active={highlightActive}
        className={
          isThen
            ? "max-w-[38ch] font-memory text-[18px] italic leading-[1.7] text-then-ink md:text-[21px]"
            : "max-w-[38ch] text-[17px] leading-[1.75] text-now-charcoal md:text-[20px]"
        }
      />

      {gloss ? (
        <p className="animate-rise-in max-w-[38ch] text-[13px] italic text-then-faded">
          {gloss}
        </p>
      ) : null}

      <AudioPlayer
        memory={memory}
        side={person.side}
        compact
        label={isThen ? `Hear ${person.name} tell it` : "Hear my story"}
      />
    </article>
  );
}
