"use client";

import { BUD, LEAF, SEEDLING, type Specimen } from "@/lib/botany";
import type { Side } from "@/lib/types";

/**
 * Where a painting joins the thing it grows out of.
 *
 * A leaf joins a stem at its stalk, not at its middle, and a seedling stands on
 * its soil. Every specimen is painted standing upright with the point it
 * attaches by at the bottom of its own box, so placing one is only ever a
 * translate and a turn.
 */

export interface Placed {
  /** Where it attaches, in scene coordinates. */
  x: number;
  y: number;
  /** How far it reaches from that point. */
  length: number;
  /** Which way it points, in degrees. 0 is east, -90 is straight up. */
  angle?: number;
  opacity?: number;
  /** Mirror it, so a row of the same painting does not repeat. */
  flip?: boolean;
  /** Let it move in the air. Off for anything pressed flat. */
  sway?: boolean;
}

export function Painted({
  spec,
  x,
  y,
  length,
  angle = -90,
  opacity = 1,
  flip = false,
  sway = true,
}: Placed & { spec: Specimen }) {
  const h = length;
  const w = (spec.w / spec.h) * length;

  /* Rounded before it reaches the DOM: server and browser disagree on the last
     bit of an atan2, and React counts that as a hydration mismatch. */
  const r = (n: number) => n.toFixed(3);

  /* Each leaf keeps its own time, taken from where it stands, so a stem full of
     them never moves in unison — which reads as an animation rather than as
     weather. */
  const seed = Math.abs(Math.round(x * 7 + y * 13));
  const duration = 6.5 + (seed % 40) / 10;
  const delay = -((seed % 70) / 10);

  return (
    <g transform={`translate(${r(x)} ${r(y)})`} opacity={opacity}>
      <g
        style={
          sway
            ? {
                animation: `leaf-sway ${duration}s ease-in-out ${delay}s infinite`,
                transformOrigin: "0px 0px",
              }
            : undefined
        }
      >
        {/* Painted upright, so pointing it is one turn from straight up. */}
        <g transform={`rotate(${r(angle + 90)})${flip ? " scale(-1 1)" : ""}`}>
          <image
            href={spec.src}
            x={r(-w / 2)}
            y={r(-h)}
            width={r(w)}
            height={r(h)}
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      </g>
    </g>
  );
}

export const Leaf = ({ side, ...p }: Placed & { side: Side }) => (
  <Painted spec={LEAF[side]} {...p} />
);

/** A question nobody has answered yet. */
export const BudMark = (p: Placed) => <Painted spec={BUD} {...p} />;

/** Where a story is about to come up. */
export const Seedling = (p: Placed) => <Painted spec={SEEDLING} sway={false} {...p} />;
