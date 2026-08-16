"use client";

import { HybridFlower } from "@/components/garden/Flower";
import { Leaf } from "@/components/garden/Botanical";
import { taperedStem } from "@/lib/garden-layout";
import type { Beat } from "./sequence";
import { reached } from "./sequence";

/**
 * The moment the whole product is for.
 *
 * Two stems come up out of the two pages — hers heavy and wandering, hers fine
 * and steady — reach across the binding, and meet. A flower opens where they
 * cross, and it is neither of theirs: half of it is drawn in her hand and half
 * in hers. Then the words arrive, one line at a time, after the picture has
 * already said it.
 *
 * No particles, no confetti. The pause before the bloom is doing as much work
 * as the bloom.
 */

const W = 1440;
const H = 900;
const MEET = { x: 720, y: 430 };

/* Where each stem starts on its own page, and the leaves it carries. */
const THEN_STEM = {
  p0: { x: 250, y: H },
  p1: { x: 320, y: 720 },
  p2: { x: 520, y: 600 },
  p3: { x: MEET.x + 24, y: MEET.y + 30 },
};
const NOW_STEM = {
  p0: { x: 1190, y: H },
  p1: { x: 1120, y: 730 },
  p2: { x: 920, y: 612 },
  p3: { x: MEET.x - 26, y: MEET.y + 44 },
};

export function Meeting({
  beat,
  seed,
  theme,
  headline,
  statement,
}: {
  beat: Beat;
  seed: number;
  theme: string;
  headline: string;
  statement: string;
}) {
  const growing = reached(beat, "growing");
  const bloomed = reached(beat, "bloom");

  const line = (at: Beat) => ({
    opacity: reached(beat, at) ? 1 : 0,
    transform: reached(beat, at) ? "translateY(0)" : "translateY(10px)",
    transition: "opacity 900ms ease, transform 900ms var(--ease-settle)",
    textShadow: "0 0 20px #f2ece0, 0 0 38px #f2ece0",
  });

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
      >
        <clipPath id="reveal-then">
          <rect
            x="0"
            y="0"
            width={W}
            height={H}
            style={{
              transformOrigin: `250px ${H}px`,
              transform: growing ? "scale(1)" : "scale(1, 0.02)",
              transition: "transform 2400ms var(--ease-organic)",
            }}
          />
        </clipPath>
        <clipPath id="reveal-now">
          <rect
            x="0"
            y="0"
            width={W}
            height={H}
            style={{
              transformOrigin: `1190px ${H}px`,
              transform: growing ? "scale(1)" : "scale(1, 0.02)",
              transition: "transform 2400ms var(--ease-organic) 260ms",
            }}
          />
        </clipPath>

        <g clipPath="url(#reveal-then)">
          <path d={taperedStem(THEN_STEM, 11)} fill="#a3936f" opacity={0.95} />
          <Leaf side="then" x={430} y={648} length={72} angle={-32} />
          <Leaf side="then" x={588} y={566} length={62} angle={-142} flip />
        </g>
        <g clipPath="url(#reveal-now)">
          <path d={taperedStem(NOW_STEM, 8)} fill="#9aab96" opacity={0.9} />
          <Leaf side="now" x={1010} y={660} length={66} angle={-148} />
          <Leaf side="now" x={862} y={578} length={58} angle={-36} flip />
        </g>
      </svg>

      {/* The flower opens where they cross, standing on the binding. */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${(MEET.x / W) * 100}%`,
          top: `${(MEET.y / H) * 100}%`,
        }}
      >
        <svg width="272" height="272" viewBox="-136 -136 272 272">
          <HybridFlower size={230} seed={seed} bloom={bloomed ? 1 : 0} />
        </svg>
      </div>

      <div
        className="absolute inset-x-0 flex flex-col items-center gap-2 px-6 text-center"
        style={{ top: "62%" }}
      >
        <p
          className="font-serif text-[19px] italic text-bloom-gold md:text-[23px]"
          style={line("name")}
        >
          {theme}
        </p>
        <p
          className="text-[20px] font-semibold uppercase tracking-[0.16em] text-then-ink md:text-[26px]"
          style={line("words")}
        >
          {headline.replace(/\.$/, "")}
        </p>
        <p
          className="text-[20px] font-semibold uppercase tracking-[0.16em] text-bloom-rose md:text-[26px]"
          style={line("words")}
        >
          {statement.replace(/\.$/, "")}
        </p>
      </div>
    </div>
  );
}
