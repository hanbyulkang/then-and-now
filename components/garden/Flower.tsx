"use client";

import { useId } from "react";
import { BLOOMS, recipe, type Specimen } from "@/lib/botany";
import type { Side } from "@/lib/types";

/**
 * Flowers, in two kinds.
 *
 * A flower that grew out of one person's story is entirely in that person's
 * hand. A flower that grew out of something the two of them turned out to share
 * is half of each — her faded bloom on one side, her calmer one on the other,
 * joined at a single centre. That second kind has to look like neither of them
 * owns it, because that is exactly what it means.
 */

function Painted({
  spec,
  size,
  bloom,
  clip,
  delay = 0,
}: {
  spec: Specimen;
  /** Width across the bloom. */
  size: number;
  bloom: number;
  clip?: string;
  delay?: number;
}) {
  const h = (spec.h / spec.w) * size;
  return (
    <image
      href={spec.src}
      x={-size / 2}
      y={-h / 2}
      width={size}
      height={h}
      clipPath={clip}
      preserveAspectRatio="xMidYMid meet"
      style={{
        opacity: bloom,
        transformOrigin: "0px 0px",
        transform: `scale(${(0.4 + bloom * 0.6).toFixed(3)})`,
        transition: `opacity 900ms ease ${delay}ms, transform 1400ms var(--ease-settle) ${delay}ms`,
      }}
    />
  );
}

/** One person's own flower — a story that mattered on its own. */
export function SideFlower({
  x = 0,
  y = 0,
  size,
  seed,
  side,
  bloom = 1,
}: {
  x?: number;
  y?: number;
  size: number;
  seed: number;
  side: Side;
  bloom?: number;
}) {
  const set = BLOOMS[side];
  const spec = set[Math.abs(seed) % set.length];
  const tilt = -20 + ((Math.abs(seed) * 11) % 41);

  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
      <Painted spec={spec} size={size} bloom={bloom} />
    </g>
  );
}

/**
 * Something the two of them turned out to share.
 *
 * The two halves are cut on the same line and meet under one centre, so it
 * reads as a single flower that happens to have been painted by two people
 * rather than as two flowers pushed together.
 */
export function HybridFlower({
  x = 0,
  y = 0,
  size,
  seed,
  bloom = 1,
}: {
  x?: number;
  y?: number;
  size: number;
  seed: number;
  bloom?: number;
}) {
  const r = recipe(seed);
  const uid = useId().replace(/:/g, "");
  const half = size * 0.62;

  return (
    <g transform={`translate(${x} ${y}) rotate(${r.tilt})`}>
      <defs>
        <clipPath id={`${uid}-l`}>
          <rect x={-half} y={-half} width={half} height={half * 2} />
        </clipPath>
        <clipPath id={`${uid}-r`}>
          <rect x={0} y={-half} width={half} height={half * 2} />
        </clipPath>
      </defs>

      <Painted
        spec={r.then}
        size={size * r.thenScale}
        bloom={bloom}
        clip={`url(#${uid}-l)`}
      />
      <Painted
        spec={r.now}
        size={size * r.nowScale}
        bloom={bloom}
        clip={`url(#${uid}-r)`}
        delay={220}
      />

      {/* Where the two hands meet. It covers the join, which is the point. */}
      <circle
        r={size * 0.085}
        fill={r.eye}
        style={{
          opacity: bloom,
          transition: "opacity 900ms ease 500ms",
        }}
      />
      <circle
        r={size * 0.085}
        fill="none"
        stroke="#8a6a3c"
        strokeWidth={size * 0.012}
        opacity={0.35 * bloom}
      />
    </g>
  );
}

/**
 * One of the above standing on its own outside the garden — pressed onto a page
 * in the archive, or named in the field journal.
 */
export function FlowerMark({
  size,
  seed,
  side,
  className = "",
}: {
  size: number;
  seed: number;
  /** Left out for something the two of them share. */
  side?: Side;
  className?: string;
}) {
  const box = size * 1.16;
  return (
    <svg
      width={box}
      height={box}
      viewBox={`${-box / 2} ${-box / 2} ${box} ${box}`}
      className={className}
      aria-hidden
    >
      {side ? (
        <SideFlower size={size} seed={seed} side={side} />
      ) : (
        <HybridFlower size={size} seed={seed} />
      )}
    </svg>
  );
}
