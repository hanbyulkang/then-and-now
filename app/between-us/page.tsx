"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { SharedFlower } from "@/components/garden/SharedFlower";
import { MobileNavSpacer, Navigation } from "@/components/nav/Navigation";
import { useGarden } from "@/lib/state/garden-provider";
import { flowersOf } from "@/lib/types";

const MAP = { width: 1440, height: 600 } as const;

/** A curated arrangement — legible at one theme and at seven. */
const THEME_SLOTS = [
  { x: 720, y: 150, size: 150 },
  { x: 400, y: 262, size: 128 },
  { x: 1040, y: 262, size: 128 },
  { x: 720, y: 430, size: 122 },
  { x: 272, y: 448, size: 112 },
  { x: 1168, y: 448, size: 112 },
  { x: 516, y: 76, size: 104 },
];

/**
 * 12 — Between Us.
 *
 * Not the garden and not the archive: only what the two of them turned out to
 * share. A botanical map of themes, with both faces waiting at the edges.
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
        .map((conversation, i) => ({ conversation, slot: THEME_SLOTS[i], i })),
    [state],
  );

  /* The map crops to the slots actually in use, so three themes do not sit in
     the top third of an empty field. */
  const mapHeight = Math.max(
    360,
    Math.min(
      MAP.height,
      Math.max(...themes.map((t) => t.slot.y + t.slot.size / 2), 200) + 120,
    ),
  );

  const pct = (v: number, axis: "x" | "y") =>
    `${(v / (axis === "x" ? MAP.width : mapHeight)) * 100}%`;

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <Navigation />

      <header className="flex flex-col items-center gap-1 px-6 pb-5 pt-10 text-center">
        <h1 className="font-serif text-[28px] text-then-ink md:text-[36px]">
          What you&apos;ve discovered about each other
        </h1>
        <p className="text-[13px] uppercase tracking-wide text-now-slate md:text-[14px]">
          {themes.length} shared {themes.length === 1 ? "thread" : "threads"}{" "}
          connecting {pair.then.name} &amp; {pair.now.name}
        </p>
      </header>

      <main className="relative w-full flex-1 px-4 pb-24 md:px-0">
        {/* Desktop: the map. The lines only ever join things that are joined. */}
        <div
          className="relative hidden w-full md:block"
          style={{ aspectRatio: `${MAP.width} / ${mapHeight}` }}
        >
          <svg
            viewBox={`0 0 ${MAP.width} ${mapHeight}`}
            preserveAspectRatio="none"
            className="absolute inset-0 size-full"
            aria-hidden
          >
            {themes.slice(1).map(({ slot, conversation }) => (
              <line
                key={conversation.id}
                x1={THEME_SLOTS[0].x}
                y1={THEME_SLOTS[0].y}
                x2={slot.x}
                y2={slot.y}
                stroke="#c5a768"
                strokeWidth="1"
                opacity={
                  hovered === null || hovered === conversation.id ? 0.55 : 0.18
                }
                style={{ transition: "opacity 300ms ease" }}
              />
            ))}
          </svg>

          {/* Both faces sit at the far edges and lift when a theme is touched. */}
          <EdgePortrait
            side="then"
            src={pair.then.portrait}
            name={pair.then.name}
            active={hovered !== null}
          />
          <EdgePortrait
            side="now"
            src={pair.now.portrait}
            name={pair.now.name}
            active={hovered !== null}
          />

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
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 rounded-2xl p-2 transition-transform duration-300 hover:-translate-y-[calc(50%+4px)]"
              style={{ left: pct(slot.x, "x"), top: pct(slot.y, "y") }}
            >
              <SharedFlower size={slot.size} variant={i} glow={i === 0} />
              <span className="font-serif text-[20px] text-then-ink md:text-[22px]">
                {conversation.connection?.theme}
              </span>
              <span className="text-[12px] text-now-slate">
                {conversation.connection?.headline}{" "}
                {conversation.connection?.statement}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile keeps every theme and the same words, stacked. */}
        <ul className="flex flex-col gap-4 md:hidden">
          {themes.map(({ conversation, i }) => (
            <li key={conversation.id}>
              <button
                type="button"
                onClick={() => router.push(`/memory/${conversation.id}`)}
                className="flex w-full items-center gap-4 rounded-[16px] border border-bloom-gold/50 bg-white/70 p-4 text-left"
              >
                <SharedFlower size={64} variant={i} />
                <span className="flex flex-col gap-1">
                  <span className="font-serif text-[20px] text-then-ink">
                    {conversation.connection?.theme}
                  </span>
                  <span className="text-[13px] text-now-slate">
                    {conversation.connection?.headline}{" "}
                    {conversation.connection?.statement}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        {themes.length === 0 ? (
          <p className="py-24 text-center font-memory text-[19px] italic text-then-faded">
            Nothing has been found between you yet.
          </p>
        ) : null}
      </main>

      <MobileNavSpacer />
    </div>
  );
}

function EdgePortrait({
  side,
  src,
  name,
  active,
}: {
  side: "then" | "now";
  src: string;
  name: string;
  active: boolean;
}) {
  return (
    <div
      className={`absolute top-1/2 h-[130px] w-[100px] -translate-y-1/2 overflow-hidden rounded-[4px] border ${
        side === "then"
          ? "left-[4%] border-bloom-gold"
          : "right-[4%] border-now-slate"
      }`}
      style={{
        opacity: active ? 1 : 0.55,
        transform: `translateY(-50%) scale(${active ? 1.06 : 1})`,
        transition: "opacity 400ms ease, transform 400ms var(--ease-settle)",
      }}
    >
      <Image
        src={src}
        alt={name}
        fill
        sizes="100px"
        className={`object-cover ${side === "then" ? "archival-photo" : ""}`}
      />
    </div>
  );
}
