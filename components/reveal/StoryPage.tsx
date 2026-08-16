"use client";

import Image from "next/image";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { PageYear } from "@/components/book/BookSpread";
import type { Memory, Person } from "@/lib/types";
import { HighlightedTranscript } from "./HighlightedTranscript";

/**
 * One page of the reveal.
 *
 * The year is set the way an old book sets one, then the place and the age, then
 * the photograph, then her voice, then her words. Everything sits toward the
 * outer edge of the page so the gutter stays clear — that is where the two of
 * them meet, and it has to be empty until they do.
 */
export function StoryPage({
  person,
  memory,
  highlight,
  gloss,
  highlightActive,
  showTranslation,
  onToggleTranslation,
}: {
  person: Person;
  memory: Memory;
  highlight?: string;
  gloss?: string;
  highlightActive: boolean;
  showTranslation: boolean;
  onToggleTranslation(): void;
}) {
  const isThen = person.side === "then";

  return (
    <div
      className={`relative z-20 flex flex-1 flex-col gap-7 p-7 md:gap-9 md:py-14 ${
        isThen
          ? "md:pl-16 md:pr-[clamp(80px,12vw,180px)]"
          : "items-end text-right md:pl-[clamp(80px,12vw,180px)] md:pr-16"
      }`}
    >
      <div className={isThen ? "" : "flex flex-col items-end"}>
        <PageYear
          side={person.side}
          year={memory.year}
          place={`${memory.place} · ${person.name} · Age ${memory.age}`}
        />
      </div>

      {/* The photograph, kept the way each of them would have kept it: hers
          printed and cornered into an album, hers held on a screen. */}
      <figure
        className={`relative w-fit shrink-0 ${
          isThen
            ? "border border-bloom-gold/60 bg-canvas p-2.5 shadow-[0_16px_28px_rgba(64,56,47,0.1)]"
            : "rounded-[10px] p-2 shadow-[0_14px_34px_rgba(0,0,0,0.05)]"
        }`}
        style={{ transform: `rotate(${isThen ? -1.2 : 0.7}deg)` }}
      >
        <div
          className="relative w-[min(58vw,230px)] overflow-hidden"
          style={{ aspectRatio: "4 / 5", borderRadius: isThen ? 2 : 6 }}
        >
          <Image
            src={memory.photoUrl ?? person.portrait}
            alt={`${person.name} in ${memory.place}, ${memory.year}`}
            fill
            sizes="230px"
            className={`object-cover ${isThen ? "archival-photo" : ""}`}
            priority
          />
        </div>
      </figure>

      <HighlightedTranscript
        text={memory.transcript}
        highlight={highlight}
        active={highlightActive}
        className={
          isThen
            ? "max-w-[38ch] font-memory text-[19px] italic leading-[1.7] text-then-ink md:text-[22px]"
            : "max-w-[38ch] text-[18px] leading-[1.75] text-now-charcoal md:text-[20px]"
        }
      />

      {gloss ? (
        <p className="animate-rise-in max-w-[38ch] text-[13px] italic text-then-faded">
          {gloss}
        </p>
      ) : null}

      <div className={isThen ? "" : "flex flex-col items-end"}>
        <AudioPlayer
          memory={memory}
          side={person.side}
          compact
          label={`Hear ${person.name} tell it`}
        />
      </div>

      {/* Translation is opt-in and secondary — the original is the memory. */}
      {memory.translation ? (
        <div className={isThen ? "" : "flex flex-col items-end"}>
          <button
            type="button"
            onClick={onToggleTranslation}
            className={`text-[13px] underline-offset-4 hover:underline ${
              isThen ? "text-then-faded" : "text-now-slate"
            }`}
          >
            {showTranslation ? "Hide the translation" : "Read it in English"}
          </button>
          {showTranslation ? (
            <p
              className={`animate-rise-in mt-3 max-w-[38ch] text-[15px] leading-[1.7] text-then-faded ${
                isThen
                  ? "border-l-2 border-bloom-gold/40 pl-4"
                  : "border-r-2 border-bloom-gold/40 pr-4"
              }`}
            >
              {memory.translation}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
