"use client";

import { BudMark, Leaf } from "@/components/garden/Botanical";
import { HybridFlower } from "@/components/garden/Flower";
import { Stem } from "@/components/garden/Paint";
import { PaintDefs } from "@/components/garden/Paint";
import type { Beat } from "./sequence";
import { reached } from "./sequence";

/**
 * The moment the whole product is for.
 *
 * Before anything is found there is one closed bud between the two pages, held
 * in a small circle of light. Then two stems come up out of the pages — hers
 * warm and wandering, hers cool and steady — reach across the middle, and meet.
 * The flower that opens where they cross is neither of theirs: half of it is
 * painted in her hand and half in hers.
 *
 * The words come last, one line at a time, after the picture has already said
 * it. No particles and no confetti — the pause before the bloom is doing as
 * much work as the bloom.
 */

const W = 1440;
const H = 900;
const MEET = { x: 720, y: 408 };

const THEN_STEM = {
  p0: { x: 300, y: H },
  p1: { x: 372, y: 706 },
  p2: { x: 562, y: 566 },
  p3: { x: MEET.x + 26, y: MEET.y + 42 },
};
const NOW_STEM = {
  p0: { x: 1150, y: H },
  p1: { x: 1078, y: 714 },
  p2: { x: 888, y: 580 },
  p3: { x: MEET.x - 28, y: MEET.y + 56 },
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

  const arrive = (at: Beat, delay = 0) => ({
    opacity: reached(beat, at) ? 1 : 0,
    transform: reached(beat, at) ? "translateY(0)" : "translateY(10px)",
    transition: `opacity 1000ms ease ${delay}ms, transform 1000ms var(--ease-settle) ${delay}ms`,
    textShadow: "0 0 22px #f6f1e6, 0 0 40px #f6f1e6",
  });

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {/* What the picture is about to prove, set above it. */}
      <div
        className="absolute inset-x-0 flex flex-col items-center gap-1 px-6 text-center"
        style={{ top: "8%" }}
      >
        <p
          className="font-serif text-[21px] italic leading-snug text-then-ink md:text-[26px]"
          style={arrive("words")}
        >
          {headline}
        </p>
        <p
          className="font-serif text-[21px] italic leading-snug text-then-ink md:text-[26px]"
          style={arrive("words", 260)}
        >
          {statement}
        </p>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
      >
        <PaintDefs />
        <clipPath id="rise-then">
          <rect
            width={W}
            height={H}
            style={{
              transformOrigin: `300px ${H}px`,
              transform: growing ? "scale(1)" : "scale(1, 0.02)",
              transition: "transform 2400ms var(--ease-organic)",
            }}
          />
        </clipPath>
        <clipPath id="rise-now">
          <rect
            width={W}
            height={H}
            style={{
              transformOrigin: `1150px ${H}px`,
              transform: growing ? "scale(1)" : "scale(1, 0.02)",
              transition: "transform 2400ms var(--ease-organic) 260ms",
            }}
          />
        </clipPath>

        <g clipPath="url(#rise-then)">
          <Stem curve={THEN_STEM} side="then" width={13} />
          <Leaf side="then" x={464} y={638} length={78} angle={-28} />
          <Leaf side="then" x={616} y={536} length={64} angle={-146} flip />
        </g>
        <g clipPath="url(#rise-now)">
          <Stem curve={NOW_STEM} side="now" width={10} />
          <Leaf side="now" x={984} y={648} length={72} angle={-152} />
          <Leaf side="now" x={844} y={550} length={60} angle={-34} flip />
        </g>
      </svg>

      {/* Before anything is found: one closed bud in a circle of light. */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${(MEET.x / W) * 100}%`,
          top: `${(MEET.y / H) * 100}%`,
          opacity: bloomed ? 0 : 1,
          transition: "opacity 700ms ease",
        }}
      >
        <span className="flex size-[92px] items-center justify-center rounded-full border border-bloom-gold/40 bg-[#fbf8f1] shadow-[0_8px_24px_rgba(64,56,47,0.08)]">
          <svg width="46" height="56" viewBox="-23 -52 46 56" aria-hidden>
            <BudMark x={0} y={0} length={50} />
          </svg>
        </span>
      </div>

      {/* And where they meet, the flower that is half of each of them. */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${(MEET.x / W) * 100}%`,
          top: `${(MEET.y / H) * 100}%`,
        }}
      >
        <svg width="300" height="300" viewBox="-150 -150 300 300">
          <HybridFlower size={244} seed={seed} bloom={bloomed ? 1 : 0} />
        </svg>
      </div>

      <p
        className="absolute inset-x-0 text-center font-serif text-[15px] italic text-bloom-gold md:text-[17px]"
        style={{
          top: `${((MEET.y + 148) / H) * 100}%`,
          ...arrive("name"),
        }}
      >
        {theme}
      </p>
    </div>
  );
}
