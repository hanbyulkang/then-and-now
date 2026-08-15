"use client";

import { Botanical, GROUND, type Specimen } from "./Leaf";

/**
 * What grows along the bottom of the garden.
 *
 * Without it the two root systems stand on nothing and the screen reads as a
 * diagram of a garden rather than a garden. The planting is denser at each
 * person's own edge and thins toward the middle, where the ground still belongs
 * to today's question.
 *
 * Positions are fixed rather than random, for the same reason the flowers are:
 * a garden that rearranges itself on every load is not a place.
 */

interface Plant {
  spec: Specimen;
  x: number;
  /** Height above the ground line. */
  length: number;
  flip?: boolean;
  /** Further back in the bed, so it sits quieter. */
  depth?: number;
}

const GROUND_Y = 706;

const PLANTS: Plant[] = [
  /* THEN's bed — the left edge, thinning as it travels inward. */
  { spec: GROUND.thenFern, x: 34, length: 96 },
  { spec: GROUND.thenGrass, x: 92, length: 62, flip: true },
  { spec: GROUND.thenPods, x: 232, length: 78, depth: 0.5 },
  { spec: GROUND.thenGrass, x: 300, length: 48, depth: 0.6 },
  { spec: GROUND.thenSprig, x: 372, length: 70 },
  { spec: GROUND.thenGrass, x: 448, length: 40, flip: true, depth: 0.7 },
  { spec: GROUND.thenFern, x: 520, length: 54, depth: 0.75 },
  { spec: GROUND.thenGrass, x: 588, length: 32, depth: 0.85 },

  /* The middle keeps almost nothing: this is where the question stands. */
  { spec: GROUND.thenGrass, x: 676, length: 24, depth: 0.9 },
  { spec: GROUND.nowGrass, x: 792, length: 26, flip: true, depth: 0.9 },

  /* NOW's bed — mirrored, and drawn in the other hand. */
  { spec: GROUND.nowGrass, x: 872, length: 34, depth: 0.85 },
  { spec: GROUND.nowSprig, x: 946, length: 56, depth: 0.75 },
  { spec: GROUND.nowGrass, x: 1024, length: 44, flip: true, depth: 0.7 },
  { spec: GROUND.nowPods, x: 1112, length: 68 },
  { spec: GROUND.nowGrass, x: 1206, length: 52, depth: 0.55 },
  { spec: GROUND.nowSprig, x: 1330, length: 84, flip: true },
  { spec: GROUND.nowGrass, x: 1404, length: 62 },
];

export function GroundPlanting({ opacity = 1 }: { opacity?: number }) {
  return (
    <g opacity={opacity}>
      {PLANTS.map((plant, i) => (
        <Botanical
          key={i}
          spec={plant.spec}
          x={plant.x}
          y={GROUND_Y + (plant.depth ? (1 - plant.depth) * 10 : 0)}
          length={plant.length}
          flip={plant.flip}
          /* Plants set further back sit quieter, the way distance works. */
          opacity={plant.depth ?? 1}
          angle={-90 + ((i * 37) % 11) - 5}
        />
      ))}
    </g>
  );
}
