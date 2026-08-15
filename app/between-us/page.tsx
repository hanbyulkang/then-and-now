"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { NowLeaf, ThenLeaf } from "@/components/garden/Leaf";
import { SharedFlower } from "@/components/garden/SharedFlower";
import { MobileNavSpacer, Navigation } from "@/components/nav/Navigation";
import { MAP, THEME_SLOTS, vine } from "@/lib/between-map";
import { cubicAngle, cubicPoint, taperedStem } from "@/lib/garden-layout";
import { useGarden } from "@/lib/state/garden-provider";
import type { Person } from "@/lib/types";
import { flowersOf } from "@/lib/types";

/**
 * Between Us.
 *
 * The same relationship seen from underneath: everything they turned out to
 * share, hanging off roots that run back to one place. Nothing here is a card
 * and nothing is a list — you find things by looking, the way you find things
 * pressed between the pages of a book somebody kept.
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

  const pct = (v: number, axis: "x" | "y") =>
    `${(v / (axis === "x" ? MAP.width : MAP.height)) * 100}%`;

  const anyOpen = themes.some((t) => t.conversation.id === hovered);

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <Navigation />

      <header className="flex flex-col items-center gap-2 px-6 pb-2 pt-12 text-center">
        <h1 className="font-serif text-[30px] leading-tight text-then-ink md:text-[40px]">
          What you never knew you shared
        </h1>
        <p className="font-serif text-[16px] italic text-then-faded md:text-[18px]">
          {themes.length === 0
            ? "This page is still waiting for its first story."
            : `${spell(themes.length)} ${themes.length === 1 ? "thing" : "things"} so far.`}
        </p>
      </header>

      <main className="relative w-full flex-1 pb-28">
        {/* Desktop: the map. Everything is rooted in the same place. */}
        <div
          className="relative mx-auto hidden w-full md:block"
          style={{ aspectRatio: `${MAP.width} / ${MAP.height}` }}
        >
          <svg
            viewBox={`0 0 ${MAP.width} ${MAP.height}`}
            preserveAspectRatio="none"
            className="absolute inset-0 size-full"
            aria-hidden
          >
            {themes.map(({ conversation, curve, i }) => {
              const lit = hovered === null || hovered === conversation.id;
              return (
                <g
                  key={conversation.id}
                  opacity={lit ? 1 : 0.2}
                  style={{ transition: "opacity 400ms ease" }}
                >
                  <path
                    d={taperedStem(curve, 11 - i * 0.8, 1.2)}
                    fill="#4a4136"
                    opacity={0.48}
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

          {/* Both faces wait at the edges and come forward together. */}
          <EdgePortrait side="then" person={pair.then} active={anyOpen} />
          <EdgePortrait side="now" person={pair.now} active={anyOpen} />

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
              className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 p-2 hover:-translate-y-[calc(50%+6px)]"
              style={{
                left: pct(slot.at.x, "x"),
                top: pct(slot.at.y, "y"),
                opacity:
                  hovered === null || hovered === conversation.id ? 1 : 0.28,
                transition:
                  "opacity 400ms ease, transform 500ms var(--ease-settle)",
              }}
            >
              <span className="font-serif text-[19px] italic text-then-ink md:text-[21px]">
                {conversation.connection?.theme}
              </span>
              <SharedFlower size={slot.size} variant={i} glow={i === 0} />
              <span className="absolute top-full max-w-[200px] pt-1 text-[12px] leading-snug text-now-slate opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                {conversation.connection?.headline}{" "}
                {conversation.connection?.statement}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile keeps every theme and the same words, one under the other. */}
        <ul className="flex flex-col gap-10 px-6 pt-6 md:hidden">
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
      </main>

      <MobileNavSpacer />
    </div>
  );
}

/** Small words for small numbers — figures read as analytics. */
function spell(n: number): string {
  return (
    ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven"][n] ?? String(n)
  );
}

function EdgePortrait({
  side,
  person,
  active,
}: {
  side: "then" | "now";
  person: Person;
  active: boolean;
}) {
  return (
    <figure
      className={`absolute top-1/2 w-[112px] -translate-y-1/2 ${
        side === "then"
          ? "left-[3%] rounded-[3px] border border-bloom-gold/70 bg-canvas p-2"
          : "right-[3%] rounded-[8px] border border-black/[0.04] p-1.5"
      }`}
      style={{
        opacity: active ? 1 : 0.42,
        transform: `translateY(-50%) scale(${active ? 1.06 : 1}) rotate(${
          side === "then" ? -1.6 : 1.2
        }deg)`,
        transition: "opacity 500ms ease, transform 500ms var(--ease-settle)",
      }}
    >
      <div className="relative h-[132px] w-full overflow-hidden">
        <Image
          src={person.portrait}
          alt={person.name}
          fill
          sizes="112px"
          className={`object-cover ${side === "then" ? "archival-photo" : ""}`}
        />
      </div>
      <figcaption className="pt-1.5 text-center text-[11px] uppercase tracking-[0.12em] text-now-slate">
        {person.name}
      </figcaption>
    </figure>
  );
}
