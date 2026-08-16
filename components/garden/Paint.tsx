"use client";

import { taperedStem } from "@/lib/garden-layout";
import type { Cubic } from "@/lib/garden-layout";
import type { Side } from "@/lib/types";

/**
 * Stems, painted rather than drawn.
 *
 * A stem filled with one flat colour reads as a stick, whatever shape it is —
 * which is what was wrong with the last one. A painted stem has three things a
 * fill does not: the pigment is uneven along its length, the edge wanders
 * because a brush wanders, and it is slightly translucent so the paper shows
 * through where the wash ran thin.
 *
 * All three are here. The shape still comes from the curve, so a stem can go
 * anywhere the garden needs it to; the paint comes from a real wash tiled
 * behind it and an edge pushed about by fractal noise.
 */

/** Put once per SVG. Everything below refers to these by name. */
export function PaintDefs() {
  return (
    <defs>
      <pattern
        id="wash"
        patternUnits="userSpaceOnUse"
        width="360"
        height="360"
        patternTransform="rotate(-8)"
      >
        <image href="/assets/garden/wash.webp" width="360" height="360" />
      </pattern>

      {/* The wandering edge. A brush does not keep to a spline. */}
      <filter id="brushed" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.024"
          numOctaves="3"
          seed="7"
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale="7"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>

      {/* Finer, for the thin stems that carry a single memory. */}
      <filter id="brushed-fine" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.05"
          numOctaves="2"
          seed="3"
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale="4"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </defs>
  );
}

/* Her hand runs warmer than hers, so the same wash is tinted differently. */
const TINT: Record<Side, string> = { then: "#9a7f4e", now: "#6f8a76" };

export function Stem({
  curve,
  side,
  width,
  fine = false,
  opacity = 1,
  style,
}: {
  curve: Cubic;
  side: Side;
  /** Width where it leaves the ground. It tapers to nothing at the tip. */
  width: number;
  fine?: boolean;
  opacity?: number;
  style?: React.CSSProperties;
}) {
  const d = taperedStem(curve, width);
  return (
    <g
      filter={`url(#${fine ? "brushed-fine" : "brushed"})`}
      opacity={opacity}
      style={style}
    >
      {/* The wash itself. */}
      <path d={d} fill="url(#wash)" />
      {/* And the hand that laid it down. */}
      <path d={d} fill={TINT[side]} opacity={side === "then" ? 0.42 : 0.3} />
    </g>
  );
}
