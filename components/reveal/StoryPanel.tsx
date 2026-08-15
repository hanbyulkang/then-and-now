"use client";

import Image from "next/image";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import type { Memory, Person } from "@/lib/types";
import { HighlightedTranscript } from "./HighlightedTranscript";

/**
 * One person's side of the reveal.
 *
 * Photograph, place, age, their actual voice, then their actual words — in that
 * order. Anything the product itself has to say comes later and smaller
 * (spec §3.2).
 */
export function StoryPanel({
  person,
  memory,
  compact,
  highlight,
  gloss,
  highlightActive,
  showTranslation,
  onToggleTranslation,
}: {
  person: Person;
  memory: Memory;
  /** The bloom has begun: the panel makes room for what grows between them. */
  compact: boolean;
  highlight?: string;
  gloss?: string;
  highlightActive: boolean;
  showTranslation: boolean;
  onToggleTranslation(): void;
}) {
  const isThen = person.side === "then";

  return (
    <section
      className={`flex flex-1 flex-col gap-6 p-6 md:p-16 ${
        isThen ? "paper-grain bg-then-paper" : "bg-now-canvas"
      } ${compact ? "md:gap-6 md:p-12" : "md:gap-8"}`}
      aria-label={`${isThen ? "Then" : "Now"} — ${person.name}`}
    >
      <header className="flex w-full items-center justify-between">
        <p
          className={`text-[14px] font-semibold tracking-wide ${
            isThen ? "text-then-faded" : "text-now-slate"
          }`}
        >
          {isThen ? "THEN" : "NOW"}
        </p>
        <p
          className={
            isThen
              ? "font-serif text-[20px] text-then-ink"
              : "text-[16px] font-medium text-now-charcoal"
          }
        >
          {person.name}
        </p>
      </header>

      {/* Once the panel goes compact the place and age move up beside the name,
          so nothing about who is speaking is ever lost (node M4). */}
      {compact ? (
        <p
          className={`-mt-4 text-[12px] ${isThen ? "text-then-faded" : "text-now-slate"}`}
        >
          {memory.year} · {memory.place} · Age {memory.age}
        </p>
      ) : null}

      <div
        className={`flex items-center gap-6 md:gap-8 ${compact ? "md:flex-col md:items-start md:gap-4" : ""}`}
      >
        <div
          className={`relative shrink-0 overflow-hidden rounded-[4px] border ${
            isThen ? "border-then-faded" : "border-now-slate"
          }`}
          style={{
            width: compact ? 120 : 160,
            height: compact ? 150 : 208,
            transition: "width 800ms var(--ease-settle), height 800ms var(--ease-settle)",
          }}
        >
          <Image
            src={memory.photoUrl ?? person.portrait}
            alt={`${person.name} in ${memory.place}, ${memory.year}`}
            fill
            sizes="200px"
            className={`object-cover ${isThen ? "archival-photo" : ""}`}
            priority
          />
        </div>

        {/* Once the branches start growing the panel gives up its metadata so
            the middle of the screen can have the room. */}
        {compact ? null : (
          <div className="flex min-w-0 flex-col gap-2">
            <p
              className={
                isThen
                  ? "font-serif text-[26px] text-then-ink md:text-[32px]"
                  : "text-[22px] font-medium text-now-charcoal md:text-[28px]"
              }
            >
              {memory.place}, {memory.year}
            </p>
            <p
              className={`text-[14px] ${isThen ? "text-then-faded" : "text-now-slate"}`}
            >
              Age {memory.age} • {memory.context}
            </p>
          </div>
        )}
      </div>

      {compact ? null : <AudioPlayer memory={memory} side={person.side} />}

      <div className="flex flex-col gap-3">
        <p
          className={`text-[12px] uppercase tracking-wide ${
            isThen ? "text-then-faded" : "text-now-slate"
          }`}
        >
          {compact ? (isThen ? "Her memory" : "Her story") : "Transcript"}
        </p>

        <HighlightedTranscript
          text={memory.transcript}
          highlight={highlight}
          active={highlightActive}
          className={
            isThen
              ? `font-memory leading-[1.6] text-then-ink ${compact ? "text-[17px] md:text-[18px]" : "text-[18px] md:text-[20px]"}`
              : `leading-[1.6] text-now-charcoal ${compact ? "text-[15px] md:text-[16px]" : "text-[16px] md:text-[18px]"}`
          }
        />

        {gloss && compact ? (
          <p className="animate-rise-in text-[13px] text-then-faded">{gloss}</p>
        ) : null}

        {/* Translation is opt-in and secondary — the original is the memory. */}
        {memory.translation ? (
          <div>
            <button
              type="button"
              onClick={onToggleTranslation}
              className={`text-[13px] underline ${isThen ? "text-then-faded" : "text-now-slate"}`}
            >
              {showTranslation
                ? "Hide English translation"
                : "View English translation"}
            </button>
            {showTranslation ? (
              <p className="animate-rise-in mt-3 border-l-2 border-bloom-gold/40 pl-4 text-[15px] leading-[1.6] text-then-faded">
                {memory.translation}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
