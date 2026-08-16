"use client";

import { SharedFlower } from "@/components/garden/SharedFlower";
import { NowLeaf, ThenLeaf } from "@/components/garden/Leaf";
import type { Connection } from "@/lib/types";
import type { RevealPhase } from "./phases";
import { atLeast } from "./phases";

/**
 * What grows in the gutter.
 *
 * Two stems come up out of the two pages and reach past each other over the
 * fold, and a flower opens where they cross. It is deliberately unhurried — the
 * pause before the bloom does as much work as the bloom. No particles, no
 * confetti: the feeling is quiet recognition.
 *
 * The stems are drawn in spread coordinates and stretched with the page, which
 * only ever bends a curve. Anything that would look wrong stretched — the
 * leaves, the flower, the words — is laid over the top at the same points.
 */
const W = 1440;
const H = 900;
/** Where they cross, a little above the middle of the book. */
const MEET = { x: 720, y: 466 };

/** Two points on each stem, as a share of the spread. */
const THEN_LEAVES = [
  { left: 32, top: 15.8 },
  { left: 36.4, top: 31.6 },
];
const NOW_LEAVES = [
  { left: 63.5, top: 16.2 },
  { left: 59.3, top: 32.2 },
];

export function FoldBloom({
  phase,
  connection,
  yearsApart,
  variant = 2,
}: {
  phase: RevealPhase;
  connection: Connection;
  yearsApart: number;
  /** Which of the drawn flowers opened here. */
  variant?: number;
}) {
  const branches = atLeast(phase, "branches");
  const bloomed = atLeast(phase, "bloom");

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
      >
        {/* Hers, in the older hand: it wanders on its way up. */}
        <path
          d="M 470 0 C 502 112, 542 224, 598 322 S 700 430, 744 468"
          stroke="#40382f"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: branches ? 0 : 1,
            transition: "stroke-dashoffset 1800ms var(--ease-organic)",
          }}
        />
        {/* Hers, in the newer one: drawn with a steadier hand. */}
        <path
          d="M 968 0 C 938 118, 898 228, 844 328 S 742 436, 696 476"
          stroke="#2d302f"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: branches ? 0 : 1,
            transition: "stroke-dashoffset 1800ms var(--ease-organic) 340ms",
          }}
        />
      </svg>

      {THEN_LEAVES.map((leaf, i) => (
        <span
          key={`then-${leaf.top}`}
          className="absolute"
          style={{
            left: `${leaf.left}%`,
            top: `${leaf.top}%`,
            opacity: branches ? 1 : 0,
            transition: `opacity 700ms ease ${700 + i * 420}ms`,
          }}
        >
          <svg width="60" height="42" viewBox="0 0 60 42">
            <ThenLeaf x={54} y={6} length={46} angle={165} />
          </svg>
        </span>
      ))}

      {NOW_LEAVES.map((leaf, i) => (
        <span
          key={`now-${leaf.top}`}
          className="absolute"
          style={{
            left: `${leaf.left}%`,
            top: `${leaf.top}%`,
            opacity: branches ? 1 : 0,
            transition: `opacity 700ms ease ${1000 + i * 420}ms`,
          }}
        >
          <svg width="60" height="42" viewBox="0 0 60 42">
            <NowLeaf x={6} y={6} length={42} angle={15} />
          </svg>
        </span>
      ))}

      {/* The flower opens where they cross, standing on the fold. */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${(MEET.x / W) * 100}%`,
          top: `${(MEET.y / H) * 100}%`,
          opacity: bloomed ? 1 : 0,
          transition: "opacity 1100ms var(--ease-settle)",
        }}
      >
        <SharedFlower
          size={220}
          variant={variant}
          bloom={bloomed ? 1 : 0.14}
          glow
        />
      </div>

      {/* The words arrive one at a time, after the picture has said it. */}
      <div
        className="absolute inset-x-0 flex flex-col items-center gap-2.5 px-6 text-center"
        style={{ top: "62%" }}
      >
        <p
          className="font-serif text-[19px] italic text-bloom-gold md:text-[23px]"
          style={{
            opacity: atLeast(phase, "theme") ? 1 : 0,
            transform: atLeast(phase, "theme")
              ? "translateY(0)"
              : "translateY(6px)",
            transition: "opacity 800ms ease, transform 800ms var(--ease-settle)",
            textShadow: "0 0 20px #f2ece0, 0 0 34px #f2ece0",
          }}
        >
          {connection.theme}
        </p>
        <p
          className="text-[20px] font-semibold uppercase tracking-[0.16em] text-then-ink md:text-[25px]"
          style={{
            opacity: atLeast(phase, "headline") ? 1 : 0,
            transform: atLeast(phase, "headline")
              ? "translateY(0)"
              : "translateY(10px)",
            transition: "opacity 900ms ease, transform 900ms var(--ease-settle)",
            textShadow: "0 0 22px #f2ece0, 0 0 40px #f2ece0",
          }}
        >
          {(connection.headline || `${yearsApart} years apart.`).replace(
            /\.$/,
            "",
          )}
        </p>
        <p
          className="text-[20px] font-semibold uppercase tracking-[0.16em] text-bloom-rose md:text-[25px]"
          style={{
            opacity: atLeast(phase, "statement") ? 1 : 0,
            transform: atLeast(phase, "statement")
              ? "translateY(0)"
              : "translateY(10px)",
            transition: "opacity 900ms ease, transform 900ms var(--ease-settle)",
            textShadow: "0 0 22px #f2ece0, 0 0 40px #f2ece0",
          }}
        >
          {connection.statement.replace(/\.$/, "")}
        </p>
      </div>
    </div>
  );
}
