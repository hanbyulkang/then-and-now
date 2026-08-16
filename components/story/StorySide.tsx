"use client";

import Image from "next/image";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { HighlightedTranscript } from "@/components/reveal/HighlightedTranscript";
import { TornPrint } from "./TornPrint";
import type { Memory, Person } from "@/lib/types";

/**
 * One person's side of a shared question.
 *
 * Who, when and where in three small lines; the photograph the way each of them
 * keeps one — hers a print with a warm border, hers on a screen; their actual
 * voice; and then their actual words, with the phrase that caught marked the
 * way somebody marks a book.
 */
export function StorySide({
  person,
  memory,
  align = "left",
  highlight,
  highlightActive = false,
  gloss,
}: {
  person: Person;
  memory: Memory;
  align?: "left" | "right";
  highlight?: string;
  highlightActive?: boolean;
  gloss?: string;
}) {
  const isThen = person.side === "then";
  const right = align === "right";

  return (
    <article
      className={`flex flex-col gap-4 ${right ? "items-end text-right" : "items-start"}`}
    >
      <header className={`flex flex-col gap-1 ${right ? "md:items-end" : ""}`}>
        <p
          className={`text-[10px] uppercase tracking-[0.3em] ${
            isThen ? "text-then-faded" : "text-now-slate"
          }`}
        >
          {isThen ? "Then" : "Now"}
        </p>
        <p
          className={
            isThen
              ? "font-serif text-[26px] leading-none text-then-ink md:text-[30px]"
              : "text-[24px] font-medium leading-none tracking-tight text-now-charcoal md:text-[28px]"
          }
        >
          {person.name}
        </p>
        <p
          className={`text-[11px] tracking-[0.1em] ${
            isThen ? "text-then-faded" : "text-now-slate"
          }`}
        >
          {memory.year} · {memory.place} · Age {memory.age}
        </p>
      </header>

      {isThen ? (
        <TornPrint
          src={memory.photoUrl ?? person.portrait}
          alt={`${person.name} in ${memory.place}, ${memory.year}`}
          width={158}
          height={198}
          tilt={-1.4}
        />
      ) : (
        <figure
          className="relative w-fit shrink-0 rounded-[8px] bg-white/70 p-2 shadow-[0_12px_30px_rgba(0,0,0,0.05)]"
          style={{ transform: "rotate(0.8deg)" }}
        >
          <div className="relative h-[198px] w-[158px] overflow-hidden rounded-[5px]">
            <Image
              src={memory.photoUrl ?? person.portrait}
              alt={`${person.name} in ${memory.place}, ${memory.year}`}
              fill
              sizes="158px"
              className="object-cover"
            />
          </div>
        </figure>
      )}

      <AudioPlayer memory={memory} side={person.side} />

      <HighlightedTranscript
        text={memory.transcript}
        highlight={highlight}
        active={highlightActive}
        className={
          isThen
            ? "max-w-[30ch] font-memory text-[16px] italic leading-[1.75] text-then-ink md:text-[18px]"
            : "max-w-[30ch] text-[15px] leading-[1.8] text-now-charcoal md:text-[17px]"
        }
      />

      {gloss ? (
        <p className="animate-rise-in max-w-[30ch] text-[12px] italic text-then-faded">
          {gloss}
        </p>
      ) : null}
    </article>
  );
}
