"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { BookSpread } from "@/components/book/BookSpread";
import { Bud } from "@/components/botanical/Bud";
import { NowLeaf, ThenLeaf } from "@/components/garden/Leaf";
import { SharedFlower } from "@/components/garden/SharedFlower";
import { MobileNavSpacer, Navigation } from "@/components/nav/Navigation";
import { BUD_SLOT, MAP, THEME_SLOTS, vine } from "@/lib/between-map";
import { cubicAngle, cubicPoint, taperedStem } from "@/lib/garden-layout";
import { useGarden } from "@/lib/state/garden-provider";
import type { Conversation, Memory, Person } from "@/lib/types";
import { flowersOf, yearsBetween } from "@/lib/types";

const pctX = (v: number) => `${(v / MAP.width) * 100}%`;
const pctY = (v: number) => `${(v / MAP.height) * 100}%`;

/**
 * Between Us.
 *
 * One botanical plate across the open book. Everything the two of them turned
 * out to share grows on vines that run back into the binding, and each one is
 * named the way a field guide names a specimen — small, in serif, under the
 * drawing. Rest on one and the rest of the plate goes quiet while the two
 * memories it came from surface on their own pages.
 *
 * Nothing here is a card and nothing is a list. You find things by looking.
 */
export default function BetweenUsPage() {
  const router = useRouter();
  const { state } = useGarden();
  const [hovered, setHovered] = useState<string | null>(null);

  const pair = state.pair;
  const themes = useMemo(
    () =>
      flowersOf(state)
        .slice(0, THEME_SLOTS.length)
        .map((conversation, i) => ({
          conversation,
          slot: THEME_SLOTS[i],
          curve: vine(THEME_SLOTS[i]),
          i,
        })),
    [state],
  );

  const open = themes.find((t) => t.conversation.id === hovered)?.conversation;
  const years = yearsBetween(pair);
  const stories = state.conversations.reduce(
    (n, c) => n + Object.keys(c.memories).length,
    0,
  );

  /* The one that hasn't opened yet: the newest question they have between them
     that neither has answered. */
  const waiting = useMemo(
    () =>
      [...state.conversations]
        .reverse()
        .find((c) => c.connection?.followUp)?.connection,
    [state.conversations],
  );

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <Navigation />

      <BookSpread
        className="min-h-[720px]"
        across={
          <div className="absolute inset-0">
            <svg
              viewBox={`0 0 ${MAP.width} ${MAP.height}`}
              preserveAspectRatio="none"
              className="absolute inset-0 hidden size-full md:block"
              aria-hidden
            >
              {themes.map(({ conversation, curve, i }) => {
                const lit = hovered === null || hovered === conversation.id;
                return (
                  <g
                    key={conversation.id}
                    opacity={lit ? 1 : 0.16}
                    style={{ transition: "opacity 400ms ease" }}
                  >
                    <path
                      d={taperedStem(curve, 15 - i * 1.1, 1.4)}
                      fill="#43392f"
                      opacity={0.72}
                    />
                    {[0.44, 0.68, 0.87].map((t, j) => {
                      const at = cubicPoint(curve, t);
                      const along = cubicAngle(curve, t);
                      return j % 2 === 0 ? (
                        <ThenLeaf
                          key={t}
                          x={at.x}
                          y={at.y}
                          length={34 - j * 5}
                          angle={along - 58}
                          flip={i % 2 === 0}
                        />
                      ) : (
                        <NowLeaf
                          key={t}
                          x={at.x}
                          y={at.y}
                          length={30 - j * 4}
                          angle={along + 122}
                        />
                      );
                    })}
                  </g>
                );
              })}
            </svg>

            {/* Named the way a field guide names a specimen. */}
            {themes.map(({ conversation, slot, i }) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => router.push(`/memory/${conversation.id}`)}
                onMouseEnter={() => setHovered(conversation.id)}
                onMouseLeave={() =>
                  setHovered((h) => (h === conversation.id ? null : h))
                }
                onFocus={() => setHovered(conversation.id)}
                onBlur={() =>
                  setHovered((h) => (h === conversation.id ? null : h))
                }
                className="absolute hidden -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 p-2 md:flex"
                style={{
                  left: pctX(slot.at.x),
                  top: pctY(slot.at.y),
                  opacity:
                    hovered === null || hovered === conversation.id ? 1 : 0.22,
                  transition: "opacity 400ms ease",
                }}
              >
                <SharedFlower size={slot.size} variant={i} glow={i === 0} />
                <span className="font-serif text-[15px] italic leading-none text-then-ink md:text-[17px]">
                  {conversation.connection?.theme}
                </span>
              </button>
            ))}

            {/* The one that hasn't opened yet. */}
            {waiting ? (
              <div
                className="absolute hidden -translate-x-1/2 -translate-y-1/2 md:block"
                style={{ left: pctX(BUD_SLOT.x), top: pctY(BUD_SLOT.y) }}
              >
                <Bud width={30} />
              </div>
            ) : null}
          </div>
        }
        left={
          <div className="pointer-events-none relative z-20 flex flex-1 flex-col justify-between gap-10 p-7 md:p-14">
            <header className="flex flex-col gap-3">
              <p className="text-[11px] uppercase tracking-[0.32em] text-then-faded">
                Between us
              </p>
              <h1 className="max-w-[18ch] font-serif text-[30px] leading-[1.15] text-then-ink md:text-[40px]">
                Things we never knew we shared.
              </h1>
            </header>

            {/* Rest on a flower and her side of it surfaces here. */}
            <SurfacedMemory
              person={pair.then}
              conversation={open}
              placeholder="Rest on one and her half of it comes back."
            />
          </div>
        }
        right={
          <div className="pointer-events-none relative z-20 flex flex-1 flex-col items-end justify-between gap-10 p-7 text-right md:p-14">
            <p className="max-w-[26ch] font-serif text-[16px] italic leading-relaxed text-then-faded md:text-[18px]">
              {themes.length === 0
                ? "This page is still waiting for its first story."
                : `${years} years. ${stories} stories. ${themes.length} things we found in each other.`}
            </p>

            <SurfacedMemory
              person={pair.now}
              conversation={open}
              align="right"
              placeholder="And yours here, beside it."
            />
          </div>
        }
        atTheFold={
          <div className="flex flex-col items-center gap-3 px-6 pb-7 text-center md:pb-9">
            {open?.connection ? (
              <p
                className="animate-rise-in max-w-[40ch] text-[13px] uppercase leading-relaxed tracking-[0.16em] text-bloom-rose"
                style={{ textShadow: "0 0 18px #f2ece0, 0 0 30px #f2ece0" }}
              >
                {open.connection.headline} {open.connection.statement}
              </p>
            ) : waiting ? (
              <>
                <p
                  className="max-w-[40ch] font-serif text-[18px] italic leading-snug text-then-ink md:text-[21px]"
                  style={{ textShadow: "0 0 18px #f2ece0, 0 0 30px #f2ece0" }}
                >
                  &ldquo;{waiting.followUp}&rdquo;
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/today")}
                  className="text-[15px] font-semibold text-bloom-green underline-offset-8 transition-colors hover:text-then-ink hover:underline"
                  style={{ textShadow: "0 0 16px #f2ece0, 0 0 28px #f2ece0" }}
                >
                  Ask {pair.then.name} →
                </button>
              </>
            ) : (
              <p
                className="font-serif text-[18px] italic text-then-faded md:text-[21px]"
                style={{ textShadow: "0 0 18px #f2ece0" }}
              >
                Maybe we weren&apos;t so far apart after all.
              </p>
            )}
          </div>
        }
      />

      {/* Mobile keeps every theme and the same words, one under the other. */}
      <ul className="flex flex-col gap-10 px-6 pb-10 pt-4 md:hidden">
        {themes.map(({ conversation, i }) => (
          <li key={conversation.id}>
            <button
              type="button"
              onClick={() => router.push(`/memory/${conversation.id}`)}
              className="flex w-full items-center gap-5 text-left"
            >
              <SharedFlower size={72} variant={i} />
              <span className="flex flex-col gap-1">
                <span className="font-serif text-[21px] italic text-then-ink">
                  {conversation.connection?.theme}
                </span>
                <span className="text-[13px] leading-snug text-now-slate">
                  {conversation.connection?.headline}{" "}
                  {conversation.connection?.statement}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <MobileNavSpacer />
    </div>
  );
}

/**
 * The half of a shared thing that belongs to one person, brought back up onto
 * her own page while you are looking at the flower it grew into.
 */
function SurfacedMemory({
  person,
  conversation,
  align = "left",
  placeholder,
}: {
  person: Person;
  conversation?: Conversation;
  align?: "left" | "right";
  placeholder: string;
}) {
  const memory: Memory | undefined = conversation?.memories[person.id];
  const isThen = person.side === "then";

  if (!memory) {
    return (
      <p
        className={`hidden max-w-[26ch] text-[13px] italic md:block ${
          isThen ? "text-then-faded" : "text-now-slate"
        }`}
      >
        {placeholder}
      </p>
    );
  }

  return (
    <figure
      key={memory.id}
      className={`animate-rise-in flex max-w-[34ch] items-end gap-4 ${
        align === "right" ? "flex-row-reverse" : ""
      }`}
    >
      <div
        className={`relative size-[62px] shrink-0 overflow-hidden ${
          isThen
            ? "border border-bloom-gold/60 bg-canvas"
            : "rounded-[6px] border border-black/[0.05]"
        }`}
      >
        <Image
          src={memory.photoUrl ?? person.portrait}
          alt={person.name}
          fill
          sizes="62px"
          className={`object-cover ${isThen ? "archival-photo" : ""}`}
        />
      </div>

      <figcaption className="flex flex-col gap-1.5">
        <span
          className={`text-[11px] uppercase tracking-[0.2em] ${
            isThen ? "text-then-faded" : "text-now-slate"
          }`}
        >
          {person.name} · {memory.year} · {memory.place}
        </span>
        <span
          className={
            isThen
              ? "font-memory text-[15px] italic leading-[1.6] text-then-ink"
              : "text-[14px] leading-[1.65] text-now-charcoal"
          }
          style={{ textShadow: `0 0 14px ${isThen ? "#e8ddc8" : "#f7f4ec"}` }}
        >
          &ldquo;{clip(memory.transcript)}&rdquo;
        </span>
      </figcaption>
    </figure>
  );
}

/** Enough of it to recognise, not the whole thing — that lives on its own page. */
function clip(text: string, max = 118) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}
