"use client";

import { SharedFlower } from "@/components/garden/SharedFlower";
import type { Connection } from "@/lib/types";
import type { RevealPhase } from "./phases";
import { atLeast } from "./phases";

const W = 480;
const H = 620;
const FLOWER = { x: W / 2, y: 250 };

/**
 * The signature moment.
 *
 * Two branches grow toward each other and a flower opens where they meet. It is
 * deliberately unhurried — the pause before the bloom is doing as much work as
 * the bloom. No particles, no confetti: the feeling is quiet recognition.
 */
export function BloomSequence({
  phase,
  connection,
  yearsApart,
}: {
  phase: RevealPhase;
  connection: Connection;
  yearsApart: number;
}) {
  const branches = atLeast(phase, "branches");
  const bloomed = atLeast(phase, "bloom");

  return (
    <div className="relative flex h-full w-full flex-col items-center">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMin meet"
        className="absolute inset-0 size-full"
        aria-hidden
      >
        {/* The seam between the two worlds. */}
        <line
          x1={W / 2}
          y1={0}
          x2={W / 2}
          y2={H}
          stroke="#c5a768"
          strokeWidth="1"
          opacity={branches ? 0.5 : 0.16}
          style={{ transition: "opacity 1.2s ease" }}
        />

        {/* The two branches descend from opposite corners and meet at the
            flower. THEN's line wanders on its way down; NOW's is drawn with a
            straighter hand. Together they close a V, which is the whole point. */}
        <path
          d={`M -8 96 C 66 118, 74 168, 128 190 S ${FLOWER.x - 62} ${FLOWER.y - 40}, ${FLOWER.x - 12} ${FLOWER.y - 6}`}
          stroke="#40382f"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: branches ? 0 : 1,
            transition: "stroke-dashoffset 1500ms var(--ease-organic)",
          }}
        />
        <ellipse
          cx="46"
          cy="112"
          rx="8"
          ry="3.6"
          fill="#7c876a"
          transform="rotate(18 46 112)"
          style={{
            opacity: branches ? 1 : 0,
            transition: "opacity 600ms ease 700ms",
          }}
        />
        <ellipse
          cx="140"
          cy="196"
          rx="10"
          ry="4.4"
          fill="#7c876a"
          transform="rotate(-26 140 196)"
          style={{
            opacity: branches ? 1 : 0,
            transition: "opacity 600ms ease 1000ms",
          }}
        />

        <path
          d={`M ${W + 8} 112 C ${W - 74} 132, ${W - 96} 178, ${W - 148} 202 S ${FLOWER.x + 58} ${FLOWER.y - 34}, ${FLOWER.x + 14} ${FLOWER.y + 4}`}
          stroke="#2d302f"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: branches ? 0 : 1,
            transition: "stroke-dashoffset 1500ms var(--ease-organic) 320ms",
          }}
        />
        <rect
          x={W - 60}
          y={126}
          width="9"
          height="9"
          rx="4.5"
          fill="#9aaa94"
          transform={`rotate(20 ${W - 56} 130)`}
          style={{
            opacity: branches ? 1 : 0,
            transition: "opacity 600ms ease 1100ms",
          }}
        />
        <rect
          x={W - 156}
          y={198}
          width="8"
          height="8"
          rx="4"
          fill="#9aaa94"
          style={{
            opacity: branches ? 1 : 0,
            transition: "opacity 600ms ease 1400ms",
          }}
        />
      </svg>

      {/* The flower opens where they meet. */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{
          left: "50%",
          top: `${(FLOWER.y / H) * 100}%`,
          opacity: bloomed ? 1 : 0,
          transition: "opacity 900ms var(--ease-settle)",
        }}
      >
        <SharedFlower size={208} variant={2} bloom={bloomed ? 1 : 0.14} glow />
      </div>

      {/* The words arrive one at a time, after the picture has said it. */}
      <div
        className="absolute inset-x-0 flex flex-col items-center gap-2 px-6 text-center"
        style={{ top: `${(492 / H) * 100}%` }}
      >
        <p
          className="text-[14px] font-semibold uppercase tracking-wide text-bloom-gold"
          style={{
            opacity: atLeast(phase, "theme") ? 1 : 0,
            transform: atLeast(phase, "theme")
              ? "translateY(0)"
              : "translateY(6px)",
            transition: "opacity 800ms ease, transform 800ms var(--ease-settle)",
          }}
        >
          {connection.theme}
        </p>
        <p
          className="font-serif text-[28px] leading-[1.1] text-then-ink md:text-[32px]"
          style={{
            opacity: atLeast(phase, "headline") ? 1 : 0,
            transform: atLeast(phase, "headline")
              ? "translateY(0)"
              : "translateY(10px)",
            transition: "opacity 900ms ease, transform 900ms var(--ease-settle)",
          }}
        >
          {connection.headline || `${yearsApart} years apart.`}
        </p>
        <p
          className="font-memory text-[20px] italic leading-snug text-then-faded md:text-[22px]"
          style={{
            opacity: atLeast(phase, "statement") ? 1 : 0,
            transform: atLeast(phase, "statement")
              ? "translateY(0)"
              : "translateY(10px)",
            transition: "opacity 900ms ease, transform 900ms var(--ease-settle)",
          }}
        >
          {connection.statement}
        </p>
      </div>
    </div>
  );
}
