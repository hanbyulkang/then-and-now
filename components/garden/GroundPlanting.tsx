"use client";

import { GROUND_Y } from "@/lib/garden-layout";
import { Botanical, GROUND, type Specimen } from "./Leaf";

/**
 * What grows along the bottom of the garden.
 *
 * Planted in clumps, not in a row. An evenly spaced line of specimens reads as
 * a repeating band — busy and mechanical — where two or three plants leaning
 * into each other read as a bed someone tends. Each clump has one tall plant, a
 * shorter one beside it and something small at its feet, and there are real
 * gaps between clumps for the eye to rest in.
 *
 * Positions are fixed rather than random, for the same reason the flowers are:
 * a garden that rearranges itself on every load is not a place.
 */

interface Clump {
  /** Where the clump sits along the bed. */
  x: number;
  /** Its members, offset from that point. */
  of: Array<{
    spec: Specimen;
    dx: number;
    length: number;
    flip?: boolean;
    /** Further back in the bed, so it sits quieter. */
    back?: number;
  }>;
}

const CLUMPS: Clump[] = [
  /* THEN's side. Fullest at the edge, easing inward. */
  {
    x: 62,
    of: [
      { spec: GROUND.thenFern, dx: -18, length: 104 },
      { spec: GROUND.thenGrass, dx: 30, length: 66, flip: true },
      { spec: GROUND.thenSprig, dx: 8, length: 44, back: 0.55 },
    ],
  },
  {
    x: 258,
    of: [
      { spec: GROUND.thenPods, dx: 0, length: 84 },
      { spec: GROUND.thenGrass, dx: -34, length: 52 },
      { spec: GROUND.thenGrass, dx: 26, length: 38, flip: true, back: 0.6 },
    ],
  },
  {
    x: 452,
    of: [
      { spec: GROUND.thenSprig, dx: 0, length: 68 },
      { spec: GROUND.thenGrass, dx: 28, length: 40, flip: true, back: 0.65 },
    ],
  },

  /* The middle keeps almost nothing: the ground here belongs to the question. */
  { x: 646, of: [{ spec: GROUND.thenGrass, dx: 0, length: 26, back: 0.75 }] },
  { x: 806, of: [{ spec: GROUND.nowGrass, dx: 0, length: 28, flip: true, back: 0.75 }] },

  /* NOW's side, mirrored, in the other hand. */
  {
    x: 986,
    of: [
      { spec: GROUND.nowSprig, dx: 0, length: 62 },
      { spec: GROUND.nowGrass, dx: -30, length: 40, back: 0.65 },
    ],
  },
  {
    x: 1178,
    of: [
      { spec: GROUND.nowPods, dx: 0, length: 78 },
      { spec: GROUND.nowGrass, dx: 32, length: 48, flip: true },
      { spec: GROUND.nowGrass, dx: -28, length: 34, back: 0.6 },
    ],
  },
  {
    x: 1372,
    of: [
      { spec: GROUND.nowSprig, dx: 12, length: 92, flip: true },
      { spec: GROUND.nowGrass, dx: -26, length: 58 },
      { spec: GROUND.nowPods, dx: 40, length: 44, back: 0.55 },
    ],
  },
];

export function GroundPlanting() {
  return (
    <g>
      {CLUMPS.flatMap((clump, c) =>
        clump.of.map((plant, i) => (
          <Botanical
            key={`${c}-${i}`}
            spec={plant.spec}
            x={clump.x + plant.dx}
            /* Anything set back sits a little lower and a little quieter,
               which is all it takes to read as depth. */
            y={GROUND_Y + (plant.back ? (1 - plant.back) * 14 : 0)}
            length={plant.length}
            flip={plant.flip}
            opacity={plant.back ?? 1}
            angle={-90 + ((c * 23 + i * 41) % 13) - 6}
          />
        )),
      )}
    </g>
  );
}
